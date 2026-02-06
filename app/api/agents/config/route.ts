import { NextRequest, NextResponse } from 'next/server'

/**
 * Agent Configuration API
 *
 * Manages agent configurations for workflows
 */

interface AgentConfig {
  id: string
  name: string
  description: string
  agent_id: string
  type: 'coordinator' | 'specialist' | 'integration'
  capabilities: string[]
  integrations?: string[]
  status: 'active' | 'inactive'
  created: string
  updated: string
}

// In-memory storage (replace with database in production)
const agentConfigs: Map<string, AgentConfig> = new Map()

// Initialize with default agent
if (agentConfigs.size === 0) {
  const defaultAgent: AgentConfig = {
    id: 'agent-default',
    name: 'General Assistant',
    description: 'Multi-purpose AI assistant for various tasks',
    agent_id: process.env.LYZR_AGENT_ID || process.env.AGENT_ID || '',
    type: 'coordinator',
    capabilities: ['general_assistance', 'task_coordination', 'data_analysis'],
    status: 'active',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  }
  agentConfigs.set(defaultAgent.id, defaultAgent)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get specific agent
      const agent = agentConfigs.get(id)
      if (!agent) {
        return NextResponse.json(
          {
            success: false,
            error: 'Agent not found',
          },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        agent,
      })
    }

    // Get all agents
    const agents = Array.from(agentConfigs.values())
    return NextResponse.json({
      success: true,
      agents,
      total: agents.length,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, agent_id, type, capabilities, integrations } = body

    if (!name || !agent_id || !type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, agent_id, type',
        },
        { status: 400 }
      )
    }

    const id = `agent-${Date.now()}`
    const newAgent: AgentConfig = {
      id,
      name,
      description: description || '',
      agent_id,
      type,
      capabilities: capabilities || [],
      integrations: integrations || [],
      status: 'active',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }

    agentConfigs.set(id, newAgent)

    return NextResponse.json({
      success: true,
      agent: newAgent,
      message: 'Agent configuration created successfully',
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, agent_id, type, capabilities, integrations, status } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: id',
        },
        { status: 400 }
      )
    }

    const existingAgent = agentConfigs.get(id)
    if (!existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Agent not found',
        },
        { status: 404 }
      )
    }

    const updatedAgent: AgentConfig = {
      ...existingAgent,
      name: name || existingAgent.name,
      description: description || existingAgent.description,
      agent_id: agent_id || existingAgent.agent_id,
      type: type || existingAgent.type,
      capabilities: capabilities || existingAgent.capabilities,
      integrations: integrations || existingAgent.integrations,
      status: status || existingAgent.status,
      updated: new Date().toISOString(),
    }

    agentConfigs.set(id, updatedAgent)

    return NextResponse.json({
      success: true,
      agent: updatedAgent,
      message: 'Agent configuration updated successfully',
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: id',
        },
        { status: 400 }
      )
    }

    const deleted = agentConfigs.delete(id)
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Agent not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Agent configuration deleted successfully',
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
