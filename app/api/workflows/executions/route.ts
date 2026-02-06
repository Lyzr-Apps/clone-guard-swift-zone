import { NextRequest, NextResponse } from 'next/server'
import { WorkflowExecution } from '@/lib/types/workflow'

/**
 * Workflow Execution History API
 *
 * Track and retrieve workflow execution history
 */

// In-memory storage (replace with database in production)
const executions: Map<string, WorkflowExecution> = new Map()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const workflow_id = searchParams.get('workflow_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (id) {
      // Get specific execution
      const execution = executions.get(id)
      if (!execution) {
        return NextResponse.json(
          {
            success: false,
            error: 'Execution not found',
          },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        execution,
      })
    }

    // Get all executions with filters
    let executionList = Array.from(executions.values())

    if (workflow_id) {
      executionList = executionList.filter((e) => e.workflow_id === workflow_id)
    }

    if (status) {
      executionList = executionList.filter((e) => e.status === status)
    }

    // Sort by started date (newest first)
    executionList.sort((a, b) => new Date(b.started).getTime() - new Date(a.started).getTime())

    // Limit results
    executionList = executionList.slice(0, limit)

    return NextResponse.json({
      success: true,
      executions: executionList,
      total: executionList.length,
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
    const execution: WorkflowExecution = body.execution

    if (!execution || !execution.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid execution data',
        },
        { status: 400 }
      )
    }

    executions.set(execution.id, execution)

    return NextResponse.json({
      success: true,
      execution,
      message: 'Execution saved successfully',
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
    const workflow_id = searchParams.get('workflow_id')

    if (id) {
      // Delete specific execution
      const deleted = executions.delete(id)
      if (!deleted) {
        return NextResponse.json(
          {
            success: false,
            error: 'Execution not found',
          },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        message: 'Execution deleted successfully',
      })
    }

    if (workflow_id) {
      // Delete all executions for a workflow
      let deletedCount = 0
      for (const [key, execution] of executions.entries()) {
        if (execution.workflow_id === workflow_id) {
          executions.delete(key)
          deletedCount++
        }
      }
      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedCount} executions`,
        count: deletedCount,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Missing required parameter: id or workflow_id',
      },
      { status: 400 }
    )
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
