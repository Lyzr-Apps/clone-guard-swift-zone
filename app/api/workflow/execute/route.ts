import { NextRequest, NextResponse } from 'next/server'
import { executeWorkflow } from '@/lib/workflow/orchestrator'
import { WorkflowDefinition } from '@/lib/types/workflow'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflow, message, user_id, session_id } = body

    if (!workflow || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'workflow and message are required',
        },
        { status: 400 }
      )
    }

    const workflowDefinition: WorkflowDefinition = workflow
    const userId = user_id || `user-${Date.now()}`

    const execution = await executeWorkflow(
      workflowDefinition,
      message,
      userId,
      session_id
    )

    return NextResponse.json({
      success: true,
      execution,
      timestamp: new Date().toISOString(),
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
