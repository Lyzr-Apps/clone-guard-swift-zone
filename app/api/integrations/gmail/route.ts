import { NextRequest, NextResponse } from 'next/server'
import { getAuthHeaders } from '@/lib/oauth/tokenManager'

/**
 * Gmail Integration API
 *
 * Handles email operations through Gmail API
 * OAuth is already handled by the agent system
 */

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params, context } = body
    const userId = context?.user_id || 'default'

    // Check for OAuth token
    const authHeaders = getAuthHeaders(userId, 'gmail')
    if (!authHeaders && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Gmail OAuth token required. Please connect your Gmail account.',
        },
        { status: 401 }
      )
    }

    switch (action) {
      case 'send_email':
        return await sendEmail(params, authHeaders)
      case 'read_emails':
        return await readEmails(params, authHeaders)
      case 'search_emails':
        return await searchEmails(params, authHeaders)
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

async function sendEmail(params: any, authHeaders: Record<string, string> | null) {
  const { to, subject, body, cc, bcc } = params

  // In production with OAuth token, make actual Gmail API call
  if (authHeaders && process.env.NODE_ENV === 'production') {
    try {
      // Create email message in RFC 2822 format
      const emailContent = [
        `To: ${to}`,
        cc ? `Cc: ${cc}` : '',
        bcc ? `Bcc: ${bcc}` : '',
        `Subject: ${subject}`,
        '',
        body,
      ].filter(Boolean).join('\r\n')

      const encodedMessage = Buffer.from(emailContent).toString('base64url')

      const response = await fetch(`${GMAIL_API_BASE}/users/me/messages/send`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`Gmail API error: ${response.statusText}`)
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        result: {
          message_id: data.id,
          to,
          subject,
          sent_at: new Date().toISOString(),
          status: 'sent',
        },
        message: `Email sent to ${to}`,
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Gmail API error'
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 500 }
      )
    }
  }

  // Development mode: Simulate Gmail API call
  const result = {
    message_id: `msg-${Date.now()}`,
    to,
    subject,
    sent_at: new Date().toISOString(),
    status: 'sent (simulated)',
  }

  return NextResponse.json({
    success: true,
    result,
    message: `Email sent to ${to} (development mode)`,
  })
}

async function readEmails(params: any, authHeaders: Record<string, string> | null) {
  const { limit = 10, unread_only = false } = params

  // In production with OAuth token, make actual Gmail API call
  if (authHeaders && process.env.NODE_ENV === 'production') {
    try {
      const query = unread_only ? 'is:unread' : ''
      const response = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?maxResults=${limit}&q=${query}`,
        {
          headers: authHeaders,
        }
      )

      if (!response.ok) {
        throw new Error(`Gmail API error: ${response.statusText}`)
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        result: {
          emails: data.messages || [],
          total: data.resultSizeEstimate || 0,
        },
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Gmail API error'
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 500 }
      )
    }
  }

  // Development mode: Simulate reading emails
  const emails = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
    id: `email-${i + 1}`,
    from: `sender${i + 1}@example.com`,
    subject: `Email Subject ${i + 1}`,
    snippet: `This is a preview of email ${i + 1}...`,
    received_at: new Date(Date.now() - i * 3600000).toISOString(),
    unread: i < 2,
  }))

  return NextResponse.json({
    success: true,
    result: {
      emails: unread_only ? emails.filter(e => e.unread) : emails,
      total: emails.length,
    },
  })
}

async function searchEmails(params: any, authHeaders: Record<string, string> | null) {
  const { query, from, subject, after, before } = params

  // Build search query
  const searchParts = []
  if (query) searchParts.push(query)
  if (from) searchParts.push(`from:${from}`)
  if (subject) searchParts.push(`subject:${subject}`)
  if (after) searchParts.push(`after:${after}`)
  if (before) searchParts.push(`before:${before}`)
  const searchQuery = searchParts.join(' ')

  // In production with OAuth token, make actual Gmail API call
  if (authHeaders && process.env.NODE_ENV === 'production') {
    try {
      const response = await fetch(
        `${GMAIL_API_BASE}/users/me/messages?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: authHeaders,
        }
      )

      if (!response.ok) {
        throw new Error(`Gmail API error: ${response.statusText}`)
      }

      const data = await response.json()

      return NextResponse.json({
        success: true,
        result: {
          emails: data.messages || [],
          total: data.resultSizeEstimate || 0,
          query: searchQuery,
        },
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Gmail API error'
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 500 }
      )
    }
  }

  // Development mode: Simulate email search
  const results = [
    {
      id: 'email-search-1',
      from: from || 'user@example.com',
      subject: subject || 'Search Result 1',
      snippet: `Email matching query: ${searchQuery}`,
      received_at: new Date().toISOString(),
    },
  ]

  return NextResponse.json({
    success: true,
    result: {
      emails: results,
      total: results.length,
      query: searchQuery,
    },
  })
}
