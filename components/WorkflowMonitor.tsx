'use client'

import { useWorkflowMonitor, useWorkflowStatus } from '@/lib/hooks/useWorkflowMonitor'
import { FiCheckCircle, FiXCircle, FiLoader, FiActivity } from 'react-icons/fi'

interface WorkflowMonitorProps {
  executionId: string | null
  onComplete?: (success: boolean) => void
}

export default function WorkflowMonitor({ executionId, onComplete }: WorkflowMonitorProps) {
  const { updates, connected, error } = useWorkflowMonitor(executionId)
  const status = useWorkflowStatus(updates)

  // Call onComplete callback when workflow finishes
  if (onComplete && (status.state === 'completed' || status.state === 'failed')) {
    onComplete(status.state === 'completed')
  }

  if (!executionId) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Execution</h3>
        <div className="flex items-center gap-2">
          {connected ? (
            <div className="flex items-center gap-2 text-green-600">
              <FiActivity className="w-4 h-4" />
              <span className="text-sm">Connected</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600">
              <FiXCircle className="w-4 h-4" />
              <span className="text-sm">Disconnected</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {status.message || 'Waiting...'}
          </span>
          <span className="text-sm text-gray-500">{status.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              status.state === 'completed'
                ? 'bg-green-500'
                : status.state === 'failed'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>

      {/* Status Updates */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {updates.map((update, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="mt-0.5">
              {update.type === 'workflow_completed' ? (
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              ) : update.type === 'workflow_failed' ? (
                <FiXCircle className="w-5 h-5 text-red-600" />
              ) : (
                <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {getUpdateTitle(update.type, update.data)}
              </div>
              {update.data && (
                <div className="text-xs text-gray-500 mt-1">
                  {getUpdateDetails(update.type, update.data)}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(update.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <FiXCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Final Status */}
      {status.state === 'completed' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <FiCheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Workflow completed successfully</span>
          </div>
        </div>
      )}

      {status.state === 'failed' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <FiXCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {status.message || 'Workflow failed'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function getUpdateTitle(type: string, data: any): string {
  switch (type) {
    case 'connected':
      return 'Connected to workflow execution'
    case 'workflow_started':
      return `Started: ${data?.workflow_name || 'Workflow'}`
    case 'node_started':
      return `Executing: ${data?.agent_name || data?.node_type || 'Node'}`
    case 'node_completed':
      return `Completed: ${data?.agent_name || data?.node_type || 'Node'}`
    case 'workflow_completed':
      return 'Workflow completed'
    case 'workflow_failed':
      return 'Workflow failed'
    default:
      return type
  }
}

function getUpdateDetails(type: string, data: any): string {
  switch (type) {
    case 'workflow_started':
      return data?.message || ''
    case 'node_started':
      return `Node ID: ${data?.node_id || 'unknown'}`
    case 'node_completed':
      return data?.result?.message || data?.result?.text || 'Node executed successfully'
    case 'workflow_failed':
      return data?.error || 'An error occurred'
    default:
      return ''
  }
}
