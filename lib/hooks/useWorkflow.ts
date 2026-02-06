import { useState, useCallback } from 'react'
import { WorkflowDefinition, WorkflowExecution } from '@/lib/types/workflow'

export interface UseWorkflowReturn {
  executeWorkflow: (workflow: WorkflowDefinition, message: string, userId?: string) => Promise<WorkflowExecution>
  loading: boolean
  error: string | null
  execution: WorkflowExecution | null
  clearError: () => void
}

export function useWorkflow(): UseWorkflowReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)

  const executeWorkflow = useCallback(
    async (workflow: WorkflowDefinition, message: string, userId?: string): Promise<WorkflowExecution> => {
      setLoading(true)
      setError(null)
      setExecution(null)

      try {
        const response = await fetch('/api/workflow/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workflow,
            message,
            user_id: userId || `user-${Date.now()}`,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to execute workflow')
        }

        setExecution(data.execution)
        return data.execution
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to execute workflow'
        setError(errorMsg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    executeWorkflow,
    loading,
    error,
    execution,
    clearError,
  }
}

export interface UseWorkflowHistoryReturn {
  executions: WorkflowExecution[]
  loading: boolean
  error: string | null
  fetchExecutions: (workflowId?: string, status?: string) => Promise<void>
  refresh: () => void
}

export function useWorkflowHistory(): UseWorkflowHistoryReturn {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastParams, setLastParams] = useState<{ workflowId?: string; status?: string }>({})

  const fetchExecutions = useCallback(async (workflowId?: string, status?: string) => {
    setLoading(true)
    setError(null)
    setLastParams({ workflowId, status })

    try {
      const params = new URLSearchParams()
      if (workflowId) params.append('workflow_id', workflowId)
      if (status) params.append('status', status)

      const response = await fetch(`/api/workflows/executions?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch executions')
      }

      setExecutions(data.executions || [])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch executions'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    fetchExecutions(lastParams.workflowId, lastParams.status)
  }, [fetchExecutions, lastParams])

  return {
    executions,
    loading,
    error,
    fetchExecutions,
    refresh,
  }
}

export interface UseWorkflowManagementReturn {
  workflows: WorkflowDefinition[]
  loading: boolean
  error: string | null
  fetchWorkflows: () => Promise<void>
  createWorkflow: (workflow: Omit<WorkflowDefinition, 'id' | 'created' | 'updated'>) => Promise<WorkflowDefinition>
  updateWorkflow: (workflow: WorkflowDefinition) => Promise<WorkflowDefinition>
  deleteWorkflow: (id: string) => Promise<void>
}

export function useWorkflowManagement(): UseWorkflowManagementReturn {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkflows = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch workflows')
      }

      setWorkflows(data.workflows || [])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch workflows'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  const createWorkflow = useCallback(
    async (workflow: Omit<WorkflowDefinition, 'id' | 'created' | 'updated'>): Promise<WorkflowDefinition> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/workflows', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workflow),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to create workflow')
        }

        setWorkflows((prev) => [...prev, data.workflow])
        return data.workflow
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create workflow'
        setError(errorMsg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateWorkflow = useCallback(async (workflow: WorkflowDefinition): Promise<WorkflowDefinition> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/workflows', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to update workflow')
      }

      setWorkflows((prev) => prev.map((w) => (w.id === workflow.id ? data.workflow : w)))
      return data.workflow
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update workflow'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWorkflow = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/workflows?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete workflow')
      }

      setWorkflows((prev) => prev.filter((w) => w.id !== id))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete workflow'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    workflows,
    loading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
  }
}
