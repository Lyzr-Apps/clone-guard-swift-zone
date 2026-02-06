'use client'

import { useState } from 'react'
import { FaShieldAlt, FaRobot, FaChartLine, FaLock, FaUserShield, FaBrain, FaNetworkWired, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')

  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'AI-Powered Defense',
      description: 'Advanced digital clone detection and prevention',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaBrain className="w-8 h-8" />,
      title: 'Smart Analytics',
      description: 'Real-time threat analysis and monitoring',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FaNetworkWired className="w-8 h-8" />,
      title: 'Network Security',
      description: 'Comprehensive protection across all channels',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaUserShield className="w-8 h-8" />,
      title: 'Identity Protection',
      description: 'Multi-layer authentication and verification',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const metrics = [
    { label: 'Threats Detected', value: '1,247', trend: '+12%', status: 'success' },
    { label: 'Active Protection', value: '99.9%', trend: '+0.2%', status: 'success' },
    { label: 'Response Time', value: '0.3s', trend: '-15%', status: 'success' },
    { label: 'Alerts Managed', value: '342', trend: '+8%', status: 'warning' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Digital Clone Defense</h1>
                <p className="text-xs text-purple-300">AI-Powered Security Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                System Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <HiSparkles className="w-5 h-5 text-purple-300" />
            <span className="text-sm text-purple-200">Next-Generation Security</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Protect Your Digital
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"> Identity</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Advanced AI-powered defense system to detect, prevent, and neutralize digital clone threats in real-time
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
              <FaRobot className="mr-2" />
              Start Protection
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <FaChartLine className="mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <Badge variant={metric.status === 'success' ? 'default' : 'secondary'} className={`text-xs ${metric.status === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                    {metric.trend}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                <Progress value={85} className="h-1" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 backdrop-blur-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Threat Detection
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaShieldAlt className="text-purple-400" />
                  Security Overview
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time system status and protection metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="font-semibold text-white">All Systems Operational</p>
                        <p className="text-sm text-gray-400">Last scan: 2 minutes ago</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">Protection Coverage</p>
                      <div className="flex items-end gap-2 mb-2">
                        <p className="text-2xl font-bold text-white">99.9%</p>
                        <p className="text-sm text-green-400 mb-1">+0.2%</p>
                      </div>
                      <Progress value={99.9} className="h-2" />
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-sm text-gray-400 mb-2">Active Monitoring</p>
                      <div className="flex items-end gap-2 mb-2">
                        <p className="text-2xl font-bold text-white">24/7</p>
                        <p className="text-sm text-purple-400 mb-1">Continuous</p>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="mt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaExclamationTriangle className="text-yellow-400" />
                  Threat Detection
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Recent threats and security alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Clone Attempt', severity: 'high', time: '5 min ago', status: 'blocked' },
                    { type: 'Suspicious Activity', severity: 'medium', time: '12 min ago', status: 'monitoring' },
                    { type: 'Identity Verification', severity: 'low', time: '28 min ago', status: 'resolved' }
                  ].map((threat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${threat.severity === 'high' ? 'bg-red-400' : threat.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></div>
                        <div>
                          <p className="font-semibold text-white">{threat.type}</p>
                          <p className="text-sm text-gray-400">{threat.time}</p>
                        </div>
                      </div>
                      <Badge className={`${threat.status === 'blocked' ? 'bg-red-500/20 text-red-300 border-red-500/30' : threat.status === 'monitoring' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                        {threat.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FaChartLine className="text-cyan-400" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg">
                    <FaBrain className="w-8 h-8 text-purple-400 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">AI Detection Rate</p>
                    <p className="text-3xl font-bold text-white">98.7%</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-lg">
                    <FaLock className="w-8 h-8 text-cyan-400 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Security Score</p>
                    <p className="text-3xl font-bold text-white">A+</p>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-lg">
                    <FaNetworkWired className="w-8 h-8 text-pink-400 mb-3" />
                    <p className="text-sm text-gray-400 mb-1">Network Health</p>
                    <p className="text-3xl font-bold text-white">Excellent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Built with Next.js, React, and Tailwind CSS</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-gray-400 text-sm">All systems operational</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
