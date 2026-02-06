import { NextRequest, NextResponse } from 'next/server'
import { WorkflowDefinition } from '@/lib/types/workflow'

/**
 * Workflow Management API
 *
 * CRUD operations for workflow definitions
 */

// In-memory storage (replace with database in production)
const workflows: Map<string, WorkflowDefinition> = new Map()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get specific workflow
      const workflow = workflows.get(id)
      if (!workflow) {
        return NextResponse.json(
          {
            success: false,
            error: 'Workflow not found',
          },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        workflow,
      })
    }

    // Get all workflows
    const workflowList = Array.from(workflows.values())
    return NextResponse.json({
      success: true,
      workflows: workflowList,
      total: workflowList.length,
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
    const { name, description, agents, nodes, startNode } = body

    if (!name || !nodes || !startNode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, nodes, startNode',
        },
        { status: 400 }
      )
    }

    const id = `wf-${Date.now()}`
    const newWorkflow: WorkflowDefinition = {
      id,
      name,
      description: description || '',
      agents: agents || [],
      nodes,
      startNode,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }

    workflows.set(id, newWorkflow)

    return NextResponse.json({
      success: true,
      workflow: newWorkflow,
      message: 'Workflow created successfully',
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
    const { id, name, description, agents, nodes, startNode } = body

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: id',
        },
        { status: 400 }
      )
    }

    const existingWorkflow = workflows.get(id)
    if (!existingWorkflow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow not found',
        },
        { status: 404 }
      )
    }

    const updatedWorkflow: WorkflowDefinition = {
      ...existingWorkflow,
      name: name || existingWorkflow.name,
      description: description || existingWorkflow.description,
      agents: agents || existingWorkflow.agents,
      nodes: nodes || existingWorkflow.nodes,
      startNode: startNode || existingWorkflow.startNode,
      updated: new Date().toISOString(),
    }

    workflows.set(id, updatedWorkflow)

    return NextResponse.json({
      success: true,
      workflow: updatedWorkflow,
      message: 'Workflow updated successfully',
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

    const deleted = workflows.delete(id)
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully',
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
