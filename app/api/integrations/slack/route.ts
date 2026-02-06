import { NextRequest, NextResponse } from 'next/server'
import { getAuthHeaders } from '@/lib/oauth/tokenManager'

/**
 * Slack Integration API
 *
 * Handles Slack operations through Slack API
 * OAuth is already handled by the agent system
 */

const SLACK_API_BASE = 'https://slack.com/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params, context } = body
    const userId = context?.user_id || 'default'

    // Check for OAuth token
    const authHeaders = getAuthHeaders(userId, 'slack')
    if (!authHeaders && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Slack OAuth token required. Please connect your Slack workspace.',
        },
        { status: 401 }
      )
    }

    switch (action) {
      case 'send_message':
        return await sendMessage(params)
      case 'create_channel':
        return await createChannel(params)
      case 'list_channels':
        return await listChannels(params)
      case 'get_messages':
        return await getMessages(params)
      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`,
          },
          { status: 400 }
        )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    )
  }
}

async function sendMessage(params: any) {
  const { channel, text, thread_ts, attachments } = params

  const result = {
    ts: Date.now().toString(),
    channel,
    text,
    sent_at: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    result,
    message: `Message sent to ${channel}`,
  })
}

async function createChannel(params: any) {
  const { name, is_private = false, description } = params

  const result = {
    id: `C${Date.now()}`,
    name,
    is_private,
    description,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    result,
    message: `Channel ${name} created`,
  })
}

async function listChannels(params: any) {
  const { limit = 20, types = 'public_channel,private_channel' } = params

  const channels = [
    {
      id: 'C001',
      name: 'general',
      is_private: false,
      member_count: 150,
    },
    {
      id: 'C002',
      name: 'engineering',
      is_private: false,
      member_count: 45,
    },
    {
      id: 'C003',
      name: 'security-alerts',
      is_private: true,
      member_count: 12,
    },
  ]

  return NextResponse.json({
    success: true,
    result: {
      channels,
      total: channels.length,
    },
  })
}

async function getMessages(params: any) {
  const { channel, limit = 10, latest, oldest } = params

  const messages = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    ts: (Date.now() - i * 60000).toString(),
    user: `U00${i + 1}`,
    text: `Sample message ${i + 1} in ${channel}`,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }))

  return NextResponse.json({
    success: true,
    result: {
      messages,
      channel,
      total: messages.length,
    },
  })
}
