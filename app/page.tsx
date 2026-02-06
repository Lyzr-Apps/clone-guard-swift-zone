'use client'

import { useState } from 'react'
import {
  FaShieldAlt,
  FaRobot,
  FaChartLine,
  FaLock,
  FaUserShield,
  FaBrain,
  FaNetworkWired,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaPlus,
  FaMicrophone,
  FaPaperPlane,
  FaImage,
  FaFolder,
  FaClock,
  FaStar,
  FaEllipsisV,
  FaGithub,
  FaSlack
} from 'react-icons/fa'
import { HiSparkles, HiLightningBolt } from 'react-icons/hi'
import { MdDashboard, MdSettings, MdPeople } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  const [activeTab, setActiveTab] = useState('projects')
  const [inputMessage, setInputMessage] = useState('')
  const [workflowMessage, setWorkflowMessage] = useState('')
  const [workflowExecuting, setWorkflowExecuting] = useState(false)
  const [workflowResult, setWorkflowResult] = useState<any>(null)

  const projects = [
    {
      id: 1,
      name: 'Security Dashboard',
      category: 'Internal Tools',
      status: 'Active',
      lastEdited: '2 hours ago',
      color: 'from-blue-500 to-cyan-500',
      icon: <FaShieldAlt />
    },
    {
      id: 2,
      name: 'AI Clone Detector',
      category: 'Website',
      status: 'In Progress',
      lastEdited: '5 hours ago',
      color: 'from-purple-500 to-pink-500',
      icon: <FaBrain />
    },
    {
      id: 3,
      name: 'Threat Analytics',
      category: 'B2B App',
      status: 'Active',
      lastEdited: '1 day ago',
      color: 'from-green-500 to-emerald-500',
      icon: <FaChartLine />
    },
    {
      id: 4,
      name: 'Identity Verification',
      category: 'Consumer App',
      status: 'Draft',
      lastEdited: '3 days ago',
      color: 'from-orange-500 to-red-500',
      icon: <FaUserShield />
    }
  ]

  const recentActivity = [
    { action: 'Threat blocked', time: '2 min ago', type: 'success' },
    { action: 'New user verified', time: '5 min ago', type: 'info' },
    { action: 'System scan completed', time: '15 min ago', type: 'success' },
    { action: 'Alert triggered', time: '1 hour ago', type: 'warning' }
  ]

  const executeWorkflow = async () => {
    setWorkflowExecuting(true)
    setWorkflowResult(null)

    try {
      const workflow = {
        id: 'wf-001',
        name: 'Support Ticket Workflow',
        description: 'Multi-agent workflow for handling support tickets',
        agents: [
          {
            id: 'agent-1',
            name: 'Ticket Analyzer',
            description: 'Analyzes incoming support tickets',
            agent_id: process.env.NEXT_PUBLIC_AGENT_ID || '',
            type: 'specialist' as const,
            capabilities: ['ticket_analysis', 'sentiment_detection']
          }
        ],
        nodes: [
          {
            id: 'start',
            type: 'agent' as const,
            agent: {
              id: 'agent-1',
              name: 'Ticket Analyzer',
              description: 'Analyzes incoming support tickets',
              agent_id: process.env.NEXT_PUBLIC_AGENT_ID || '',
              type: 'specialist' as const,
              capabilities: ['ticket_analysis', 'sentiment_detection']
            },
            config: {},
            nextNodes: []
          }
        ],
        startNode: 'start',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }

      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow,
          message: workflowMessage,
          user_id: 'user-demo'
        }),
      })

      const data = await response.json()
      setWorkflowResult(data)
    } catch (error) {
      setWorkflowResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute workflow'
      })
    } finally {
      setWorkflowExecuting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfbf8] dark:bg-[#1c1c1c]">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#2a2a2a] border-r border-gray-200 dark:border-gray-800 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl">
              <FaShieldAlt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Agentlets</h1>
              <p className="text-xs text-gray-500">AI Platform</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'projects'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MdDashboard className="w-5 h-5" />
              <span className="font-medium">Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'chat'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <FaRobot className="w-5 h-5" />
              <span className="font-medium">AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('workflows')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'workflows'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <FaNetworkWired className="w-5 h-5" />
              <span className="font-medium">Workflows</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <FaChartLine className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'team'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MdPeople className="w-5 h-5" />
              <span className="font-medium">Team</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MdSettings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
              <p className="text-xs text-gray-500">admin@agentlets.ai</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Credits</p>
              <p className="text-sm font-bold text-purple-600 dark:text-purple-400">2,847</p>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 h-8">
              <HiLightningBolt className="mr-1" />
              Upgrade
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search projects, activity..."
                    className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <FaFilter className="w-3 h-3" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  All Systems Operational
                </Badge>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 gap-2">
                  <FaPlus className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          {activeTab === 'projects' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Projects</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage and monitor your AI security projects</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white text-xl`}>
                          {project.icon}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <FaEllipsisV />
                        </button>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{project.category}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={`${
                          project.status === 'Active' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                          project.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {project.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FaClock className="w-3 h-3" />
                          {project.lastEdited}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Latest updates from your projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          } animate-pulse`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      <FaPlus />
                      Create New Project
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <FaGithub />
                      Connect GitHub
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <FaSlack />
                      Connect Slack
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Assistant</h2>
                <p className="text-gray-600 dark:text-gray-400">Chat with your AI-powered security assistant</p>
              </div>

              <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800 h-[calc(100vh-300px)] flex flex-col">
                <CardContent className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0">
                        <FaRobot />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">AI Assistant</p>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-gray-900 dark:text-gray-100">Hello! I'm your AI security assistant. I can help you with threat detection, security analysis, and project management. How can I assist you today?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      Default
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      Chat Only
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      Agent Mode
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me anything about security, threats, or your projects..."
                        className="resize-none pr-24 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        rows={3}
                      />
                      <div className="absolute right-2 bottom-2 flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <FaImage className="w-4 h-4 text-gray-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <FaMicrophone className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 h-auto px-6">
                      <FaPaperPlane />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Attach up to 10 files of any type</p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'workflows' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agentic Workflows</h2>
                <p className="text-gray-600 dark:text-gray-400">Orchestrate multi-agent workflows and enterprise integrations</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        <FaNetworkWired className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Workflows</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                        <FaRobot className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Agents</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                        <FaCheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Executions Today</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Execute Workflow</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Test your multi-agent workflow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">
                          Workflow Message
                        </label>
                        <Textarea
                          value={workflowMessage}
                          onChange={(e) => setWorkflowMessage(e.target.value)}
                          placeholder="Enter your task or request..."
                          className="resize-none bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          rows={4}
                        />
                      </div>
                      <Button
                        onClick={executeWorkflow}
                        disabled={workflowExecuting || !workflowMessage.trim()}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                      >
                        {workflowExecuting ? (
                          <>
                            <HiLightningBolt className="mr-2 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <HiLightningBolt className="mr-2" />
                            Execute Workflow
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Workflow Result</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Execution status and response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!workflowResult ? (
                      <div className="text-center py-8 text-gray-400">
                        <FaNetworkWired className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No execution yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`${
                            workflowResult.success
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          }`}>
                            {workflowResult.success ? 'Success' : 'Failed'}
                          </Badge>
                          {workflowResult.execution?.status && (
                            <Badge variant="outline">
                              {workflowResult.execution.status}
                            </Badge>
                          )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                          <pre className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {JSON.stringify(workflowResult, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Enterprise Integrations</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">Connected services and APIs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <FaSlack className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Gmail</p>
                            <p className="text-xs text-gray-500">Email automation</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                          Ready
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <FaSlack className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Slack</p>
                            <p className="text-xs text-gray-500">Team messaging</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                          Ready
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <FaGithub className="w-5 h-5 text-gray-900 dark:text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
                            <p className="text-xs text-gray-500">Code management</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                          Ready
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-400">Performance metrics and security insights</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        <FaBrain className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">AI Detection Rate</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">98.7%</p>
                      </div>
                    </div>
                    <Progress value={98.7} className="h-2" />
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">+2.3% from last week</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                        <FaLock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Security Score</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">A+</p>
                      </div>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">Perfect score maintained</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                        <FaNetworkWired className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Network Health</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
                      </div>
                    </div>
                    <Progress value={99.9} className="h-2" />
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">+0.2% uptime</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <FaExclamationTriangle className="text-yellow-500" />
                    Threat Detection Log
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">Recent security alerts and incidents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Clone Attempt Blocked', severity: 'high', time: '5 min ago', status: 'Resolved' },
                      { type: 'Unusual Login Pattern', severity: 'medium', time: '12 min ago', status: 'Monitoring' },
                      { type: 'API Rate Limit Exceeded', severity: 'low', time: '28 min ago', status: 'Resolved' },
                      { type: 'Failed Authentication', severity: 'medium', time: '1 hour ago', status: 'Resolved' }
                    ].map((threat, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            threat.severity === 'high' ? 'bg-red-500' :
                            threat.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          } animate-pulse`}></div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{threat.type}</p>
                            <p className="text-sm text-gray-500">{threat.time}</p>
                          </div>
                        </div>
                        <Badge className={`${
                          threat.status === 'Resolved' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                          'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {threat.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Team Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your workspace members and permissions</p>
              </div>

              <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 dark:text-white">Team Members</CardTitle>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      <FaPlus className="mr-2" />
                      Invite Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Admin User', email: 'admin@agentlets.ai', role: 'Owner', avatar: 'A' },
                      { name: 'John Doe', email: 'john@agentlets.ai', role: 'Admin', avatar: 'J' },
                      { name: 'Sarah Smith', email: 'sarah@agentlets.ai', role: 'Editor', avatar: 'S' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your workspace preferences and integrations</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white text-lg">Integrations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <FaGithub className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">GitHub</span>
                      </div>
                      <Badge className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <FaSlack className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Slack</span>
                      </div>
                      <Button size="sm" variant="outline">Connect</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 bg-white dark:bg-[#2a2a2a] border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white text-lg">Workspace Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">Workspace Name</label>
                      <Input defaultValue="AI Security Platform" className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900 dark:text-white block mb-2">Default Project Visibility</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option>Workspace</option>
                        <option>Public</option>
                        <option>Restricted</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
