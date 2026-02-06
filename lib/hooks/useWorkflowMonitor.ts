import { useState, useEffect, useCallback, useRef } from 'react'

export interface WorkflowUpdate {
  type: 'connected' | 'workflow_started' | 'node_started' | 'node_completed' | 'workflow_completed' | 'workflow_failed'
  data?: any
  timestamp: string
}

interface UseWorkflowMonitorReturn {
  updates: WorkflowUpdate[]
  connected: boolean
  error: string | null
  clearUpdates: () => void
}

/**
 * Hook for monitoring workflow execution in real-time using Server-Sent Events
 *
 * @param executionId - The workflow execution ID to monitor
 * @param enabled - Whether to start monitoring (default: true)
 */
export function useWorkflowMonitor(
  executionId: string | null,
  enabled: boolean = true
): UseWorkflowMonitorReturn {
  const [updates, setUpdates] = useState<WorkflowUpdate[]>([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const clearUpdates = useCallback(() => {
    setUpdates([])
    setError(null)
  }, [])

  useEffect(() => {
    if (!executionId || !enabled) {
      return
    }

    let eventSource: EventSource | null = null

    try {
      // Create EventSource connection
      eventSource = new EventSource(
        `/api/workflows/monitor?execution_id=${executionId}`
      )
      eventSourceRef.current = eventSource

      // Handle incoming messages
      eventSource.onmessage = (event) => {
        try {
          const update: WorkflowUpdate = JSON.parse(event.data)

          setUpdates((prev) => [...prev, update])

          if (update.type === 'connected') {
            setConnected(true)
            setError(null)
          }

          // Auto-disconnect on workflow completion or failure
          if (update.type === 'workflow_completed' || update.type === 'workflow_failed') {
            setTimeout(() => {
              if (eventSourceRef.current) {
                eventSourceRef.current.close()
                eventSourceRef.current = null
                setConnected(false)
              }
            }, 1000)
          }
        } catch (err) {
          console.error('Failed to parse SSE message:', err)
        }
      }

      // Handle connection open
      eventSource.onopen = () => {
        setConnected(true)
        setError(null)
      }

      // Handle errors
      eventSource.onerror = (err) => {
        console.error('SSE error:', err)
        setError('Connection error')
        setConnected(false)

        // Close the connection
        if (eventSource) {
          eventSource.close()
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect'
      setError(errorMsg)
      setConnected(false)
    }

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close()
        eventSourceRef.current = null
        setConnected(false)
      }
    }
  }, [executionId, enabled])

  return {
    updates,
    connected,
    error,
    clearUpdates,
  }
}

/**
 * Hook to get the current workflow status from updates
 */
export function useWorkflowStatus(updates: WorkflowUpdate[]) {
  const [status, setStatus] = useState<{
    state: 'idle' | 'running' | 'completed' | 'failed'
    currentNode?: string
    progress: number
    message?: string
  }>({
    state: 'idle',
    progress: 0,
  })

  useEffect(() => {
    if (updates.length === 0) {
      setStatus({ state: 'idle', progress: 0 })
      return
    }

    const latestUpdate = updates[updates.length - 1]

    switch (latestUpdate.type) {
      case 'workflow_started':
        setStatus({
          state: 'running',
          progress: 0,
          message: 'Workflow started',
        })
        break

      case 'node_started':
        setStatus((prev) => ({
          state: 'running',
          currentNode: latestUpdate.data?.node_id,
          progress: Math.min(prev.progress + 10, 90),
          message: `Executing ${latestUpdate.data?.agent_name || latestUpdate.data?.node_type}`,
        }))
        break

      case 'node_completed':
        setStatus((prev) => ({
          state: 'running',
          currentNode: latestUpdate.data?.node_id,
          progress: Math.min(prev.progress + 10, 95),
          message: `Completed ${latestUpdate.data?.agent_name || latestUpdate.data?.node_type}`,
        }))
        break

      case 'workflow_completed':
        setStatus({
          state: 'completed',
          progress: 100,
          message: 'Workflow completed successfully',
        })
        break

      case 'workflow_failed':
        setStatus({
          state: 'failed',
          progress: 0,
          message: latestUpdate.data?.error || 'Workflow failed',
        })
        break
    }
  }, [updates])

  return status
}
