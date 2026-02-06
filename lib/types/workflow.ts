/**
 * Enterprise Workflow Types
 */

export interface WorkflowAgent {
  id: string
  name: string
  description: string
  agent_id: string // Lyzr Agent ID
  type: 'coordinator' | 'specialist' | 'integration'
  capabilities: string[]
  integrations?: string[]
}

export interface WorkflowNode {
  id: string
  type: 'agent' | 'condition' | 'integration' | 'transform'
  agent?: WorkflowAgent
  config: Record<string, any>
  nextNodes: string[]
}

export interface WorkflowDefinition {
  id: string
  name: string
  description: string
  agents: WorkflowAgent[]
  nodes: WorkflowNode[]
  startNode: string
  created: string
  updated: string
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  current_node?: string
  results: Record<string, any>
  started: string
  completed?: string
  error?: string
}

export interface IntegrationConfig {
  type: 'gmail' | 'slack' | 'github' | 'calendar' | 'custom'
  credentials?: Record<string, string>
  endpoints: Record<string, string>
}

export interface AgentMessage {
  role: 'user' | 'agent' | 'system'
  content: string
  agent_id?: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface WorkflowContext {
  user_id: string
  session_id: string
  workflow_id: string
  execution_id: string
  variables: Record<string, any>
  history: AgentMessage[]
}
