'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Send, Bot, Zap, Activity, Code, Database, Shield, TrendingUp } from 'lucide-react';

// Autonomous AI Agents
const autonomousAgents = [
  { id: 1, name: 'Code Optimizer', status: 'active', tasks: 12, efficiency: 94, color: 'bg-blue-500' },
  { id: 2, name: 'Security Guardian', status: 'active', tasks: 8, efficiency: 98, color: 'bg-red-500' },
  { id: 3, name: 'Performance Monitor', status: 'active', tasks: 15, efficiency: 89, color: 'bg-green-500' },
  { id: 4, name: 'UX Enhancer', status: 'active', tasks: 6, efficiency: 91, color: 'bg-purple-500' },
  { id: 5, name: 'Content Curator', status: 'active', tasks: 9, efficiency: 87, color: 'bg-yellow-500' },
  { id: 6, name: 'Integration Manager', status: 'active', tasks: 11, efficiency: 93, color: 'bg-indigo-500' }
];

// Multi-agent conversations
const agentMessages = [
  { agent: 'Project Manager', message: 'Initiating deployment workflow. @Developer, please prepare the staging environment.', timestamp: '2 min ago' },
  { agent: 'Developer', message: '@QA Agent, code is ready for testing. Running test suite now.', timestamp: '1 min ago' },
  { agent: 'QA Agent', message: 'All tests passing! @DevOps, ready for deployment.', timestamp: '30 sec ago' },
  { agent: 'DevOps', message: 'Deployment successful. @Security, please run security scan.', timestamp: 'Just now' }
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    activeAgents: 6,
    clusters: 3,
    deployments: 7,
    aiTasks: 61,
    systemLoad: 67,
    uptime: '2h 34m',
    credits: 1250
  });

  const [chatMessages, setChatMessages] = useState([
    { type: 'assistant', content: 'Welcome to OBL.DEV! Your autonomous AI development platform is ready. Try saying "deploy to staging" or "show system status"', timestamp: new Date() }
  ]);

  const [currentCommand, setCurrentCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [agentCollaboration, setAgentCollaboration] = useState(false);

  // Simulate live agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        aiTasks: prev.aiTasks + Math.floor(Math.random() * 3),
        systemLoad: 60 + Math.floor(Math.random() * 20)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle AI commands
  const handleCommand = async (command: string) => {
    if (!command.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, {
      type: 'user',
      content: command,
      timestamp: new Date()
    }]);

    // Simulate real responses based on command
    let response = '';
    if (command.toLowerCase().includes('deploy')) {
      response = '🚀 Deployment initiated! Docker containers are building. ETA: 90 seconds.';
      setMetrics(prev => ({ ...prev, deployments: prev.deployments + 1 }));
    } else if (command.toLowerCase().includes('status')) {
      response = `📊 System Status: ${metrics.activeAgents} agents active, ${metrics.clusters} clusters running, ${metrics.aiTasks} tasks processed today.`;
    } else if (command.toLowerCase().includes('agents') || command.toLowerCase().includes('collaborate')) {
      setAgentCollaboration(true);
      response = '🤖 Starting multi-agent collaboration session...';
    } else {
      response = '🧠 Processing your request with Claude AI...';
    }

    // Add AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    }, 1000);

    setCurrentCommand('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* AI Assistant Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">OBL.DEV</h1>
              <p className="text-gray-400 text-sm">Autonomous AI Development Platform</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* AI Command Interface */}
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Command your AI agents..."
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCommand(currentCommand)}
                  className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-64"
                />
                <Button
                  size="sm"
                  onClick={() => handleCommand(currentCommand)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.activeAgents}</div>
              <Badge variant="secondary" className="mt-2 text-green-400 bg-green-400/20">All Systems Operational</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Clusters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.clusters}</div>
              <div className="text-sm text-gray-400 mt-2">Running smoothly</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">AI Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics.aiTasks}</div>
              <div className="text-sm text-gray-400 mt-2">Processed today</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">OBL Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400">{metrics.credits}</div>
              <div className="text-sm text-gray-400 mt-2">Available balance</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
            <TabsTrigger value="chat">Multi-Agent Chat</TabsTrigger>
            <TabsTrigger value="store">OBL Store</TabsTrigger>
            <TabsTrigger value="workflows">Agent Workflows</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-orange-400" />
                  Autonomous AI Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {autonomousAgents.map(agent => (
                    <div key={agent.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-3 h-3 rounded-full ${agent.color} animate-pulse`}></div>
                        <div>
                          <h4 className="font-semibold text-white">{agent.name}</h4>
                          <p className="text-sm text-gray-400">Status: {agent.status}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Tasks</span>
                          <span className="text-white">{agent.tasks}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Efficiency</span>
                          <span className="text-green-400">{agent.efficiency}%</span>
                        </div>
                        <Progress value={agent.efficiency} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deploy Tab */}
          <TabsContent value="deploy">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Deployment Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleCommand('deploy to staging')}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Deploy Staging
                  </Button>
                  <Button 
                    onClick={() => handleCommand('deploy to production')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Deploy Production
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Recent Deployments</h4>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">deploy-{Date.now() - i * 1000}</span>
                          <span className="ml-2 text-gray-400">{i === 0 ? 'production' : i === 1 ? 'staging' : 'development'}</span>
                        </div>
                        <Badge variant="default" className="bg-green-500/20 text-green-400">Success</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Agent Chat */}
          <TabsContent value="chat">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  Multi-Agent Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto space-y-3 mb-4">
                  {agentCollaboration && agentMessages.map((msg, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-xs">
                        {msg.agent.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-orange-400">{msg.agent}</div>
                        <div className="text-white">{msg.message}</div>
                        <div className="text-xs text-gray-400">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-800'
                      }`}>
                        <div className="text-white text-sm">{msg.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Command your AI team..."
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommand(currentCommand)}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <Button onClick={() => handleCommand(currentCommand)} className="bg-orange-500 hover:bg-orange-600">
                    <Send size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OBL Store */}
          <TabsContent value="store">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>OBL Store - Component Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'AI Chat Widget', price: 50, rating: 4.8, downloads: 1200 },
                    { name: 'Dashboard Template', price: 75, rating: 4.9, downloads: 890 },
                    { name: 'Agent Workflow Builder', price: 100, rating: 5.0, downloads: 567 }
                  ].map((component, i) => (
                    <div key={i} className="p-4 bg-gray-800 rounded border border-gray-700">
                      <h4 className="font-semibold mb-2">{component.name}</h4>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-400 font-bold">{component.price} credits</span>
                        <Badge variant="secondary">⭐ {component.rating}</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{component.downloads} downloads</p>
                      <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600">
                        Purchase
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agent Workflows */}
          <TabsContent value="workflows">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Agent Workflow Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded border-l-4 border-orange-500">
                    <h4 className="font-semibold">Complete Deployment Pipeline</h4>
                    <p className="text-sm text-gray-400">Code Agent → Test Agent → Deploy Agent → Monitor Agent</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="mr-2">Active</Badge>
                      <span className="text-sm text-gray-400">Last run: 2 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-800 rounded border-l-4 border-blue-500">
                    <h4 className="font-semibold">Bug Detection & Fix</h4>
                    <p className="text-sm text-gray-400">Security Agent → Code Agent → GitHub Agent → Deploy Agent</p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="mr-2">Idle</Badge>
                      <span className="text-sm text-gray-400">Triggered on security alerts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation */}
          <TabsContent value="docs">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>OBL.DEV Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
                    <p className="text-gray-400">Learn how to use your autonomous AI development platform</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Voice Commands</h4>
                    <div className="bg-gray-800 p-3 rounded">
                      <code className="text-orange-400">"deploy to staging"</code> - Starts deployment process<br/>
                      <code className="text-orange-400">"show system status"</code> - Displays current metrics<br/>
                      <code className="text-orange-400">"start agent collaboration"</code> - Begins multi-agent session
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">AI Agents</h4>
                    <p className="text-gray-400">Your platform includes 6 autonomous agents working 24/7 to optimize performance, security, and user experience.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}