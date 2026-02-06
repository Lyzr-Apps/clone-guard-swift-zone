import { NextRequest } from 'next/server'

/**
 * Real-time Workflow Monitoring using Server-Sent Events (SSE)
 *
 * Streams workflow execution updates to clients in real-time
 */

// Store for workflow execution updates
const executionUpdates: Map<string, any[]> = new Map()
const activeConnections: Map<string, Set<ReadableStreamDefaultController>> = new Map()

// Helper to broadcast updates to all connected clients for an execution
export function broadcastExecutionUpdate(executionId: string, update: any) {
  const controllers = activeConnections.get(executionId)
  if (controllers) {
    const data = `data: ${JSON.stringify(update)}\n\n`
    controllers.forEach(controller => {
      try {
        controller.enqueue(new TextEncoder().encode(data))
      } catch (error) {
        // Client disconnected, remove controller
        controllers.delete(controller)
      }
    })
  }

  // Store update in history
  if (!executionUpdates.has(executionId)) {
    executionUpdates.set(executionId, [])
  }
  executionUpdates.get(executionId)!.push({
    ...update,
    timestamp: new Date().toISOString(),
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const executionId = searchParams.get('execution_id')

  if (!executionId) {
    return new Response('Missing execution_id parameter', { status: 400 })
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add this controller to active connections
      if (!activeConnections.has(executionId)) {
        activeConnections.set(executionId, new Set())
      }
      activeConnections.get(executionId)!.add(controller)

      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: 'connected',
        execution_id: executionId,
        timestamp: new Date().toISOString(),
      })}\n\n`
      controller.enqueue(new TextEncoder().encode(initialMessage))

      // Send any existing updates
      const updates = executionUpdates.get(executionId) || []
      updates.forEach(update => {
        const message = `data: ${JSON.stringify(update)}\n\n`
        controller.enqueue(new TextEncoder().encode(message))
      })

      // Set up keep-alive ping every 30 seconds
      const keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': keep-alive\n\n'))
        } catch {
          // Client disconnected
          clearInterval(keepAliveInterval)
        }
      }, 30000)

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAliveInterval)
        const controllers = activeConnections.get(executionId)
        if (controllers) {
          controllers.delete(controller)
          if (controllers.size === 0) {
            activeConnections.delete(executionId)
          }
        }
        try {
          controller.close()
        } catch {
          // Already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// POST endpoint to publish updates (called by orchestrator)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { execution_id, type, data } = body

    if (!execution_id || !type) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'execution_id and type are required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const update = {
      type,
      data,
      timestamp: new Date().toISOString(),
    }

    broadcastExecutionUpdate(execution_id, update)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Update broadcasted',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Server error'
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMsg,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// DELETE endpoint to clear updates for an execution
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const executionId = searchParams.get('execution_id')

  if (!executionId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'execution_id parameter required',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  executionUpdates.delete(executionId)
  activeConnections.delete(executionId)

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Updates cleared',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}
