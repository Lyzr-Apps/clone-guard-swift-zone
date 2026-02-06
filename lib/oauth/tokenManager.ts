/**
 * OAuth Token Manager
 *
 * Manages OAuth tokens for enterprise integrations
 * Note: Agent system already handles OAuth - this is for storing and retrieving tokens
 */

export interface OAuthToken {
  integration: string
  access_token: string
  refresh_token?: string
  expires_at?: number
  scope?: string
  user_id: string
  created_at: string
  updated_at: string
}

// In-memory token storage (replace with encrypted database in production)
const tokenStore: Map<string, OAuthToken> = new Map()

/**
 * Store an OAuth token for a user and integration
 */
export function storeToken(userId: string, integration: string, tokenData: Omit<OAuthToken, 'user_id' | 'integration' | 'created_at' | 'updated_at'>): void {
  const key = `${userId}:${integration}`
  const token: OAuthToken = {
    ...tokenData,
    user_id: userId,
    integration,
    created_at: tokenStore.has(key) ? tokenStore.get(key)!.created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  tokenStore.set(key, token)
}

/**
 * Get an OAuth token for a user and integration
 */
export function getToken(userId: string, integration: string): OAuthToken | null {
  const key = `${userId}:${integration}`
  const token = tokenStore.get(key)

  if (!token) {
    return null
  }

  // Check if token is expired
  if (token.expires_at && token.expires_at < Date.now()) {
    return null
  }

  return token
}

/**
 * Remove an OAuth token
 */
export function removeToken(userId: string, integration: string): boolean {
  const key = `${userId}:${integration}`
  return tokenStore.delete(key)
}

/**
 * Get all tokens for a user
 */
export function getUserTokens(userId: string): OAuthToken[] {
  const tokens: OAuthToken[] = []
  for (const [key, token] of tokenStore.entries()) {
    if (token.user_id === userId) {
      tokens.push(token)
    }
  }
  return tokens
}

/**
 * Check if user has valid token for integration
 */
export function hasValidToken(userId: string, integration: string): boolean {
  const token = getToken(userId, integration)
  return token !== null
}

/**
 * Refresh an OAuth token (if refresh_token is available)
 */
export async function refreshToken(userId: string, integration: string): Promise<OAuthToken | null> {
  const token = tokenStore.get(`${userId}:${integration}`)

  if (!token || !token.refresh_token) {
    return null
  }

  try {
    // This would call the integration's token refresh endpoint
    // For now, we'll simulate a refresh
    const refreshedToken: OAuthToken = {
      ...token,
      access_token: `refreshed_${Date.now()}`,
      expires_at: Date.now() + 3600000, // 1 hour
      updated_at: new Date().toISOString(),
    }

    tokenStore.set(`${userId}:${integration}`, refreshedToken)
    return refreshedToken
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

/**
 * Get authorization headers for an integration
 */
export function getAuthHeaders(userId: string, integration: string): Record<string, string> | null {
  const token = getToken(userId, integration)

  if (!token) {
    return null
  }

  return {
    'Authorization': `Bearer ${token.access_token}`,
  }
}
