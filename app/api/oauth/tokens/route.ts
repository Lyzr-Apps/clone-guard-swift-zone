import { NextRequest, NextResponse } from 'next/server'
import {
  storeToken,
  getToken,
  removeToken,
  getUserTokens,
  hasValidToken,
} from '@/lib/oauth/tokenManager'

/**
 * OAuth Token Management API
 *
 * Note: The agent system handles OAuth authentication
 * This API is for storing, retrieving, and managing tokens
 */

// GET - Retrieve tokens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const integration = searchParams.get('integration')

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_id parameter required',
        },
        { status: 400 }
      )
    }

    if (integration) {
      // Get specific token
      const token = getToken(userId, integration)
      if (!token) {
        return NextResponse.json(
          {
            success: false,
            error: 'Token not found',
          },
          { status: 404 }
        )
      }

      // Don't send the actual tokens in response (security)
      const safeToken = {
        integration: token.integration,
        scope: token.scope,
        expires_at: token.expires_at,
        has_access_token: !!token.access_token,
        has_refresh_token: !!token.refresh_token,
        created_at: token.created_at,
        updated_at: token.updated_at,
      }

      return NextResponse.json({
        success: true,
        token: safeToken,
      })
    }

    // Get all tokens for user
    const tokens = getUserTokens(userId)
    const safeTokens = tokens.map(token => ({
      integration: token.integration,
      scope: token.scope,
      expires_at: token.expires_at,
      has_access_token: !!token.access_token,
      has_refresh_token: !!token.refresh_token,
      created_at: token.created_at,
      updated_at: token.updated_at,
    }))

    return NextResponse.json({
      success: true,
      tokens: safeTokens,
      total: safeTokens.length,
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

// POST - Store a new token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, integration, access_token, refresh_token, expires_in, scope } = body

    if (!user_id || !integration || !access_token) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_id, integration, and access_token are required',
        },
        { status: 400 }
      )
    }

    const tokenData = {
      access_token,
      refresh_token,
      expires_at: expires_in ? Date.now() + expires_in * 1000 : undefined,
      scope,
    }

    storeToken(user_id, integration, tokenData)

    return NextResponse.json({
      success: true,
      message: 'Token stored successfully',
      integration,
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

// DELETE - Remove a token
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const integration = searchParams.get('integration')

    if (!userId || !integration) {
      return NextResponse.json(
        {
          success: false,
          error: 'user_id and integration parameters required',
        },
        { status: 400 }
      )
    }

    const removed = removeToken(userId, integration)

    if (!removed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token removed successfully',
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

// HEAD - Check if token exists
export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const integration = searchParams.get('integration')

    if (!userId || !integration) {
      return new NextResponse(null, { status: 400 })
    }

    const hasToken = hasValidToken(userId, integration)
    return new NextResponse(null, { status: hasToken ? 200 : 404 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}
