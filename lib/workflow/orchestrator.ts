/**
 * Workflow Orchestration Engine
 *
 * Coordinates multiple AI agents to execute complex enterprise workflows
 */

import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowContext,
  WorkflowNode,
  AgentMessage
} from '@/lib/types/workflow'

export class WorkflowOrchestrator {
  private context: WorkflowContext
  private workflow: WorkflowDefinition

  constructor(workflow: WorkflowDefinition, context: WorkflowContext) {
    this.workflow = workflow
    this.context = context
  }

  /**
   * Send real-time update
   */
  private async sendUpdate(executionId: string, type: string, data: any): Promise<void> {
    try {
      await fetch('/api/workflows/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          execution_id: executionId,
          type,
          data,
        }),
      })
    } catch (error) {
      // Don't fail workflow if monitoring fails
      console.error('Failed to send monitoring update:', error)
    }
  }

  /**
   * Execute the workflow
   */
  async execute(initialMessage: string): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: this.generateExecutionId(),
      workflow_id: this.workflow.id,
      status: 'running',
      current_node: this.workflow.startNode,
      results: {},
      started: new Date().toISOString(),
    }

    // Send workflow started update
    await this.sendUpdate(execution.id, 'workflow_started', {
      workflow_id: this.workflow.id,
      workflow_name: this.workflow.name,
      message: initialMessage,
    })

    try {
      // Add initial message to context
      this.addMessageToContext({
        role: 'user',
        content: initialMessage,
        timestamp: new Date().toISOString(),
      })

      // Execute workflow nodes
      let currentNodeId = this.workflow.startNode
      let iterationCount = 0
      const maxIterations = 50 // Prevent infinite loops

      while (currentNodeId && iterationCount < maxIterations) {
        const node = this.findNode(currentNodeId)
        if (!node) {
          throw new Error(`Node ${currentNodeId} not found`)
        }

        execution.current_node = currentNodeId

        // Send node execution started update
        await this.sendUpdate(execution.id, 'node_started', {
          node_id: node.id,
          node_type: node.type,
          agent_name: node.agent?.name,
        })

        // Execute the node
        const nodeResult = await this.executeNode(node)
        execution.results[currentNodeId] = nodeResult

        // Send node execution completed update
        await this.sendUpdate(execution.id, 'node_completed', {
          node_id: node.id,
          node_type: node.type,
          agent_name: node.agent?.name,
          result: nodeResult,
        })

        // Determine next node
        currentNodeId = this.getNextNode(node, nodeResult)
        iterationCount++
      }

      execution.status = 'completed'
      execution.completed = new Date().toISOString()

      // Send workflow completed update
      await this.sendUpdate(execution.id, 'workflow_completed', {
        workflow_id: this.workflow.id,
        results: execution.results,
      })

      return execution
    } catch (error) {
      execution.status = 'failed'
      execution.error = error instanceof Error ? error.message : 'Unknown error'
      execution.completed = new Date().toISOString()

      // Send workflow failed update
      await this.sendUpdate(execution.id, 'workflow_failed', {
        workflow_id: this.workflow.id,
        error: execution.error,
      })

      return execution
    }
  }

  /**
   * Execute a single workflow node
   */
  private async executeNode(node: WorkflowNode): Promise<any> {
    switch (node.type) {
      case 'agent':
        return await this.executeAgentNode(node)
      case 'condition':
        return this.evaluateCondition(node)
      case 'integration':
        return await this.executeIntegration(node)
      case 'transform':
        return this.transformData(node)
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  }

  /**
   * Execute an agent node
   */
  private async executeAgentNode(node: WorkflowNode): Promise<any> {
    if (!node.agent) {
      throw new Error('Agent node missing agent configuration')
    }

    // Get the last user message or use context
    const lastMessage = this.getLastUserMessage()
    const message = node.config.message || lastMessage || 'Continue processing'

    try {
      // Call the agent API
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          agent_id: node.agent.agent_id,
          user_id: this.context.user_id,
          session_id: this.context.session_id,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Agent execution failed')
      }

      // Add agent response to context
      this.addMessageToContext({
        role: 'agent',
        content: this.extractResponseContent(data.response),
        agent_id: node.agent.agent_id,
        timestamp: new Date().toISOString(),
        metadata: data.response.metadata,
      })

      return data.response
    } catch (error) {
      throw new Error(
        `Agent ${node.agent.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Evaluate a condition node
   */
  private evaluateCondition(node: WorkflowNode): boolean {
    const { condition, variable, operator, value } = node.config

    if (condition) {
      // Custom condition logic
      return this.evaluateExpression(condition)
    }

    // Simple variable comparison
    const varValue = this.context.variables[variable]

    switch (operator) {
      case 'equals':
        return varValue === value
      case 'notEquals':
        return varValue !== value
      case 'contains':
        return String(varValue).includes(String(value))
      case 'greaterThan':
        return Number(varValue) > Number(value)
      case 'lessThan':
        return Number(varValue) < Number(value)
      default:
        return false
    }
  }

  /**
   * Execute an integration node
   */
  private async executeIntegration(node: WorkflowNode): Promise<any> {
    const { integrationType, action, params } = node.config

    try {
      const response = await fetch(`/api/integrations/${integrationType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          params,
          context: this.context,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Integration execution failed')
      }

      // Store result in context
      if (node.config.outputVariable) {
        this.context.variables[node.config.outputVariable] = data.result
      }

      return data.result
    } catch (error) {
      throw new Error(
        `Integration ${integrationType} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Transform data
   */
  private transformData(node: WorkflowNode): any {
    const { inputVariable, transformation, outputVariable } = node.config
    const inputData = this.context.variables[inputVariable]

    let result
    switch (transformation) {
      case 'json_parse':
        result = JSON.parse(inputData)
        break
      case 'json_stringify':
        result = JSON.stringify(inputData)
        break
      case 'uppercase':
        result = String(inputData).toUpperCase()
        break
      case 'lowercase':
        result = String(inputData).toLowerCase()
        break
      default:
        result = inputData
    }

    if (outputVariable) {
      this.context.variables[outputVariable] = result
    }

    return result
  }

  /**
   * Get the next node to execute
   */
  private getNextNode(node: WorkflowNode, result: any): string | null {
    if (node.type === 'condition') {
      // Conditional branching
      return result ? node.nextNodes[0] : node.nextNodes[1] || null
    }

    // Return first next node or null if none
    return node.nextNodes[0] || null
  }

  /**
   * Helper methods
   */
  private findNode(nodeId: string): WorkflowNode | undefined {
    return this.workflow.nodes.find(n => n.id === nodeId)
  }

  private getLastUserMessage(): string {
    const userMessages = this.context.history.filter(m => m.role === 'user')
    return userMessages[userMessages.length - 1]?.content || ''
  }

  private addMessageToContext(message: AgentMessage): void {
    this.context.history.push(message)
  }

  private extractResponseContent(response: any): string {
    if (response.message) return response.message
    if (response.result?.text) return response.result.text
    if (response.result?.message) return response.result.message
    if (typeof response.result === 'string') return response.result
    return JSON.stringify(response.result)
  }

  private evaluateExpression(expression: string): boolean {
    // Simple expression evaluation
    // In production, use a safe expression evaluator
    try {
      // Replace variables in expression
      let evaluatedExpression = expression
      for (const [key, value] of Object.entries(this.context.variables)) {
        evaluatedExpression = evaluatedExpression.replace(
          new RegExp(`\\$${key}`, 'g'),
          JSON.stringify(value)
        )
      }
      return eval(evaluatedExpression)
    } catch {
      return false
    }
  }

  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Create and execute a workflow
 */
export async function executeWorkflow(
  workflow: WorkflowDefinition,
  message: string,
  userId: string,
  sessionId?: string
): Promise<WorkflowExecution> {
  const context: WorkflowContext = {
    user_id: userId,
    session_id: sessionId || `session-${Date.now()}`,
    workflow_id: workflow.id,
    execution_id: '',
    variables: {},
    history: [],
  }

  const orchestrator = new WorkflowOrchestrator(workflow, context)
  const execution = await orchestrator.execute(message)

  // Save execution to history
  try {
    await fetch('/api/workflows/executions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ execution }),
    })
  } catch (error) {
    console.error('Failed to save execution history:', error)
    // Don't fail the workflow if history save fails
  }

  return execution
}
