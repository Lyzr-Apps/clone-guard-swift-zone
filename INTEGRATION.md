# Enterprise Workflow System - Integration Guide

## Overview

This Next.js application provides a complete enterprise workflow orchestration system with:

- Real-time workflow execution monitoring
- Multi-agent coordination with Lyzr AI agents
- Enterprise API integrations (Gmail, Slack, GitHub)
- OAuth token management
- Workflow history tracking

## System Architecture

### Backend Components

1. **Agent Configuration API** (`/api/agents/config`)
   - CRUD operations for agent configurations
   - Manages Lyzr agent IDs and capabilities

2. **Workflow Management API** (`/api/workflows`)
   - Create, read, update, delete workflow definitions
   - Define multi-step workflows with agents and integrations

3. **Workflow Execution API** (`/api/workflow/execute`)
   - Execute workflows with real Lyzr agent calls
   - Automatic execution history saving

4. **Workflow Monitoring API** (`/api/workflows/monitor`)
   - Real-time Server-Sent Events (SSE) for live updates
   - Progress tracking and status monitoring

5. **OAuth Token Management** (`/api/oauth/tokens`)
   - Store and retrieve OAuth tokens for integrations
   - Token expiration and refresh handling

6. **Enterprise Integrations**
   - Gmail API (`/api/integrations/gmail`)
   - Slack API (`/api/integrations/slack`)
   - GitHub API (`/api/integrations/github`)

### Frontend Components

1. **React Hooks**
   - `useWorkflow()` - Execute workflows
   - `useWorkflowHistory()` - Fetch execution history
   - `useWorkflowManagement()` - Manage workflow definitions
   - `useWorkflowMonitor()` - Real-time monitoring
   - `useWorkflowStatus()` - Status tracking

2. **UI Components**
   - `WorkflowMonitor` - Real-time execution display
   - Workflow dashboard components

## Environment Variables

Required environment variables in `.env.local`:

```bash
LYZR_API_KEY=your_lyzr_api_key_here
AGENT_ID=your_default_agent_id_here
NODE_ENV=development
```

## API Usage Examples

### 1. Execute a Workflow

```typescript
const { executeWorkflow, loading, error, execution } = useWorkflow()

const workflow: WorkflowDefinition = {
  id: 'wf-1',
  name: 'Customer Support Workflow',
  description: 'Handle customer inquiries',
  agents: [...],
  nodes: [...],
  startNode: 'node-1',
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
}

const result = await executeWorkflow(
  workflow,
  'How can I reset my password?',
  'user-123'
)
```

### 2. Monitor Workflow Execution

```typescript
import WorkflowMonitor from '@/components/WorkflowMonitor'

function MyComponent() {
  const [executionId, setExecutionId] = useState<string | null>(null)

  return (
    <WorkflowMonitor
      executionId={executionId}
      onComplete={(success) => {
        console.log('Workflow completed:', success)
      }}
    />
  )
}
```

### 3. Store OAuth Token

```typescript
const response = await fetch('/api/oauth/tokens', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user-123',
    integration: 'gmail',
    access_token: 'token_here',
    refresh_token: 'refresh_token_here',
    expires_in: 3600,
    scope: 'https://www.googleapis.com/auth/gmail.send',
  }),
})
```

### 4. Send Email via Gmail Integration

```typescript
const response = await fetch('/api/integrations/gmail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'send_email',
    params: {
      to: 'user@example.com',
      subject: 'Hello',
      body: 'This is a test email',
    },
    context: {
      user_id: 'user-123',
    },
  }),
})
```

## Real-Time Monitoring

The system uses Server-Sent Events (SSE) for real-time workflow monitoring:

### Event Types

1. **connected** - Initial connection established
2. **workflow_started** - Workflow execution begins
3. **node_started** - Individual node execution begins
4. **node_completed** - Node execution completes
5. **workflow_completed** - Workflow completes successfully
6. **workflow_failed** - Workflow encounters an error

### Monitoring Flow

```
Client ─┬─> EventSource('/api/workflows/monitor?execution_id=...')
        │
        └─> Receives updates:
            ├─ workflow_started
            ├─ node_started (agent 1)
            ├─ node_completed (agent 1)
            ├─ node_started (agent 2)
            ├─ node_completed (agent 2)
            └─ workflow_completed
```

## Integration Testing

### Development Mode
- All integrations work with simulated responses
- No OAuth tokens required
- Useful for testing workflows

### Production Mode
- Requires valid OAuth tokens
- Makes actual API calls to Gmail, Slack, GitHub
- Returns 401 if tokens not configured

## Security Notes

1. **OAuth Tokens**
   - Stored in memory (replace with encrypted database in production)
   - Never sent to client (only metadata)
   - Automatically checked for expiration

2. **API Keys**
   - Lyzr API key stored in environment variables
   - Never exposed to client

3. **Rate Limiting**
   - Should be implemented for production
   - Protect against abuse

## Deployment

1. Set environment variables:
   ```bash
   LYZR_API_KEY=your_key
   AGENT_ID=your_agent_id
   NODE_ENV=production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Future Enhancements

1. Replace in-memory storage with PostgreSQL/Prisma
2. Add workflow builder UI for visual workflow creation
3. Implement webhook support for external triggers
4. Add more enterprise integrations (Salesforce, Jira, etc.)
5. Implement workflow versioning
6. Add workflow analytics and reporting
7. Implement role-based access control (RBAC)
8. Add workflow templates library

## Support

For issues or questions, please refer to the project documentation or contact the development team.
