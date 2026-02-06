import { NextRequest, NextResponse } from 'next/server'

/**
 * Agent Chat API
 *
 * Handles real-time chat with Lyzr AI agent
 * Provides conversational interface for problem-solving
 */

const LYZR_API_KEY = process.env.LYZR_API_KEY
const AGENT_ID = process.env.AGENT_ID
const LYZR_API_BASE = 'https://agent-prod.studio.lyzr.ai/v3'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, user_id, session_id } = body

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required',
        },
        { status: 400 }
      )
    }

    if (!LYZR_API_KEY || !AGENT_ID) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lyzr API credentials not configured',
        },
        { status: 500 }
      )
    }

    // Call Lyzr Agent API
    const response = await fetch(`${LYZR_API_BASE}/agent/${AGENT_ID}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify({
        user_id: user_id || 'default-user',
        session_id: session_id || `session-${Date.now()}`,
        message: message,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lyzr API error:', errorText)
      return NextResponse.json(
        {
          success: false,
          error: `Lyzr API error: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract the response text from Lyzr's response format
    let responseText = ''
    if (data.response) {
      responseText = data.response
    } else if (data.message) {
      responseText = data.message
    } else if (typeof data === 'string') {
      responseText = data
    } else {
      responseText = 'I processed your request successfully.'
    }

    return NextResponse.json({
      success: true,
      response: responseText,
      session_id: session_id,
      timestamp: new Date().toISOString(),
      metadata: {
        agent_id: AGENT_ID,
        user_id: user_id || 'default-user',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
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

// GET endpoint to retrieve chat history (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const userId = searchParams.get('user_id')

    if (!sessionId && !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'session_id or user_id parameter required',
        },
        { status: 400 }
      )
    }

    // In a real implementation, you would fetch chat history from a database
    // For now, return empty history as we're using stateless chat
    return NextResponse.json({
      success: true,
      messages: [],
      session_id: sessionId,
      user_id: userId,
    })
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
