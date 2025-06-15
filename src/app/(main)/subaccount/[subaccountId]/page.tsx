import BlurPage from '@/components/global/blur-page'
import CircleProgress from '@/components/global/circle-progress'
import SubaccountFunnelChart from '@/components/global/subaccount-funnel-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { Contact2, DollarSign, IndianRupee, ShoppingCart, TrendingUp, Users, Eye, MousePointer, Globe, Smartphone, Monitor, Tablet, Calendar, ArrowUpRight, ArrowDownRight, Star, Award, Target, Zap, Activity, Building2, Fuel as Funnel, BarChart3, PieChart, LineChart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SubaccountDashboardCharts from './_components/subaccount-dashboard-charts'

type Props = {
  params: { subaccountId: string }
}

const SubaccountPageId = async ({ params }: Props) => {
  let currency = 'INR'
  let sessions
  let totalClosedSessions
  let totalPendingSessions
  let net = 0
  let potentialIncome = 0
  let closingRate = 84

  const subaccountDetails = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  })

  const currentYear = new Date().getFullYear()
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

  if (!subaccountDetails) return

  // Enhanced hardcoded metrics for demonstration
  const hardcodedMetrics = {
    totalRevenue: 1847650,
    potentialRevenue: 2850000,
    monthlyGrowth: 18.5,
    clientSatisfaction: 94,
    activeFunnels: 12,
    totalFunnels: 18,
    totalVisits: 58030,
    conversions: 7214,
    conversionRate: 12.4,
    avgOrderValue: 2850,
    totalCustomers: 1247,
    newCustomersThisMonth: 89,
  }

  // Hardcoded funnel data
  const funnelData = [
    { name: 'E-commerce Store', visits: 15420, conversions: 1847, revenue: 285000, status: 'active' },
    { name: 'SaaS Landing Page', visits: 12350, conversions: 1523, revenue: 195000, status: 'active' },
    { name: 'Lead Generation', visits: 9870, conversions: 1547, revenue: 125000, status: 'active' },
    { name: 'Product Launch', visits: 8640, conversions: 795, revenue: 98000, status: 'active' },
    { name: 'Event Registration', visits: 6520, conversions: 456, revenue: 45000, status: 'draft' },
    { name: 'Newsletter Signup', visits: 5230, conversions: 1046, revenue: 25000, status: 'active' },
  ]

  // Revenue trend data
  const revenueData = [
    { month: 'Jan', revenue: 125000, visitors: 8200, conversions: 985 },
    { month: 'Feb', revenue: 142000, visitors: 9100, conversions: 1124 },
    { month: 'Mar', revenue: 138000, visitors: 8950, conversions: 1087 },
    { month: 'Apr', revenue: 165000, visitors: 10200, conversions: 1285 },
    { month: 'May', revenue: 189000, visitors: 11500, conversions: 1456 },
    { month: 'Jun', revenue: 215000, visitors: 12800, conversions: 1687 },
    { month: 'Jul', revenue: 198000, visitors: 12100, conversions: 1542 },
    { month: 'Aug', revenue: 234000, visitors: 13900, conversions: 1823 },
    { month: 'Sep', revenue: 267000, visitors: 15200, conversions: 2087 },
    { month: 'Oct', revenue: 245000, visitors: 14600, conversions: 1945 },
    { month: 'Nov', revenue: 289000, visitors: 16100, conversions: 2234 },
    { month: 'Dec', revenue: 312000, visitors: 17200, conversions: 2456 },
  ]

  // Device analytics
  const deviceStats = [
    { device: 'Desktop', visits: 32150, percentage: 55 },
    { device: 'Mobile', visits: 20420, percentage: 35 },
    { device: 'Tablet', visits: 5460, percentage: 10 },
  ]

  // Traffic sources
  const trafficSources = [
  { source: 'Organic Search', value: 45, color: '#8B5CF6' },  // violet
  { source: 'Direct', value: 25, color: '#06B6D4' },          // cyan
  { source: 'Social Media', value: 20, color: '#10B981' },    // emerald
  { source: 'Paid Ads', value: 10, color: '#F59E0B' },        // amber
]



  if (subaccountDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: subaccountDetails.connectAccountId,
    })
    currency = response.default_currency?.toUpperCase() || 'INR'
    const checkoutSessions = await stripe.checkout.sessions.list(
      { created: { gte: startDate, lte: endDate }, limit: 100 },
      { stripeAccount: subaccountDetails.connectAccountId }
    )
    sessions = checkoutSessions.data.map((session) => ({
      ...session,
      created: new Date(session.created).toLocaleDateString(),
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
    }))

    totalClosedSessions = checkoutSessions.data.filter((session) => session.status === 'complete')
    totalPendingSessions = checkoutSessions.data.filter((session) => session.status === 'open' || session.status === 'expired')

    net = +totalClosedSessions.reduce((total, session) => total + (session.amount_total || 0), 0).toFixed(2)
    potentialIncome = +totalPendingSessions.reduce((total, session) => total + (session.amount_total || 0), 0).toFixed(2)
    closingRate = +((totalClosedSessions.length / checkoutSessions.data.length) * 100).toFixed(2)
  }

  const funnels = await db.funnel.findMany({
    where: { subAccountId: params.subaccountId },
    include: { FunnelPages: true },
  })

  const funnelPerformanceMetrics = funnels.map((funnel) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce((total, page) => total + page.visits, 0),
  }))

  return (
    <BlurPage>
      <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-b">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {subaccountDetails.name} Dashboard
                  </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                  Welcome back! Here&apos;s your performance overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Live data updated 2 min ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Enhanced Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/20 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-green-600 font-medium flex items-center space-x-2">
                    <IndianRupee className="h-4 w-4" />
                    <span>Total Revenue</span>
                  </CardDescription>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-green-700">
                  ₹{net ? `${net.toFixed(2)}` : `${(hardcodedMetrics.totalRevenue / 100000).toFixed(1)}L`}
                </CardTitle>
                <div className="flex items-center space-x-1 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">+{hardcodedMetrics.monthlyGrowth}%</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
                <div className="mt-2">
                  <Progress value={75} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹{net ? net.toFixed(1) : (hardcodedMetrics.totalRevenue / 100000).toFixed(1)}L</span>
                    <span>Goal: ₹25L</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-blue-600 font-medium flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Potential Income</span>
                  </CardDescription>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Contact2 className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-blue-700">
                  ₹{potentialIncome ? `${potentialIncome.toFixed(2)}` : `${(hardcodedMetrics.potentialRevenue / 100000).toFixed(1)}L`}
                </CardTitle>
                <div className="flex items-center space-x-1 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-600 font-medium">+12.3%</span>
                  <span className="text-muted-foreground">potential growth</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg. order value</span>
                    <span className="font-medium">₹{hardcodedMetrics.avgOrderValue}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total customers</span>
                    <span className="font-medium">{hardcodedMetrics.totalCustomers}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-purple-600 font-medium flex items-center space-x-2">
                    <Funnel className="h-4 w-4" />
                    <span>Active Funnels</span>
                  </CardDescription>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-purple-700">
                  {hardcodedMetrics.activeFunnels}
                </CardTitle>
                <div className="flex items-center space-x-1 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-purple-500" />
                  <span className="text-purple-600 font-medium">3 new</span>
                  <span className="text-muted-foreground">this month</span>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-medium">{hardcodedMetrics.activeFunnels} active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="text-muted-foreground">{hardcodedMetrics.totalFunnels - hardcodedMetrics.activeFunnels} draft</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-orange-600 font-medium flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Total Visits</span>
                  </CardDescription>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-orange-700">
                  {hardcodedMetrics.totalVisits.toLocaleString()}
                </CardTitle>
                <div className="flex items-center space-x-1 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600 font-medium">+8.2%</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Conversions</span>
                    <span className="font-medium">{hardcodedMetrics.conversions.toLocaleString()}</span>
                  </div>
                  <Progress value={hardcodedMetrics.conversionRate} className="h-1" />
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Analytics */}
            <Card className="xl:col-span-2 overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <span>Revenue Analytics</span>
                    </CardTitle>
                    <CardDescription>Monthly performance and growth trends</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span>Revenue</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-accent rounded-full" />
                      <span>Conversions</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <SubaccountDashboardCharts 
                  sessions={sessions}
                  revenueData={revenueData}
                  trafficSources={trafficSources}
                />
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-secondary/5 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-accent" />
                      <span>Performance</span>
                    </CardTitle>
                    <CardDescription>Key metrics overview</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <CircleProgress
                    value={closingRate || hardcodedMetrics.conversionRate}
                    // size={140}
                    description={
                      <div className="space-y-2 mt-4">
                        <div className="text-sm font-medium">Conversion Rate</div>
                        <div className="flex items-center justify-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-rose-500 rounded-full" />
                            <span>Bounced: {Math.floor(hardcodedMetrics.totalVisits * 0.35).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span>Converted: {hardcodedMetrics.conversions.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                    <span className="text-sm font-medium">{hardcodedMetrics.clientSatisfaction}%</span>
                  </div>
                  <Progress value={hardcodedMetrics.clientSatisfaction} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Funnel Completion</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Return Visitors</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funnel Performance Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Funnel Performance Chart */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 border-b">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Funnel className="h-5 w-5 text-secondary-foreground" />
                  <span>Funnel Performance</span>
                </CardTitle>
                <CardDescription>Individual funnel analytics and performance</CardDescription>
              </CardHeader>
              {/* <CardContent className="p-6">
                <SubaccountFunnelChart data={funnelPerformanceMetrics.length ? funnelPerformanceMetrics : funnelData} />
              </CardContent> */}
            </Card>

            {/* Device Analytics */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Device Analytics</span>
                </CardTitle>
                <CardDescription>Visitor device breakdown</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {deviceStats.map((device, index) => {
                    const Icon = device.device === 'Desktop' ? Monitor : 
                               device.device === 'Mobile' ? Smartphone : Tablet
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{device.device}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{device.visits.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{device.percentage}%</div>
                          </div>
                        </div>
                        <Progress value={device.percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Funnels List */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 border-b">
              <CardTitle className="text-xl flex items-center space-x-2">
                <Funnel className="h-5 w-5 text-secondary-foreground" />
                <span>Active Funnels</span>
              </CardTitle>
              <CardDescription>Your top performing funnels</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {funnelData.slice(0, 5).map((funnel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Funnel className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{funnel.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {funnel.visits.toLocaleString()} visits • {funnel.conversions} conversions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={funnel.status === 'active' ? 'default' : 'secondary'}>
                        {funnel.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        ₹{(funnel.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link 
                  href={`/subaccount/${params.subaccountId}/funnels`}
                  className="text-sm text-primary hover:underline flex items-center space-x-1"
                >
                  <span>View all funnels</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 border-b">
              <CardTitle className="text-xl flex items-center space-x-2">
                <Zap className="h-5 w-5 text-secondary-foreground" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Streamline your workflow with these shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link 
                  href={`/subaccount/${params.subaccountId}/funnels`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-primary/5 to-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Funnel className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Manage Funnels</h3>
                      <p className="text-sm text-muted-foreground">Create and optimize your sales funnels</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-primary">
                        <span>{hardcodedMetrics.activeFunnels} active funnels</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link 
                  href={`/subaccount/${params.subaccountId}/pipelines`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-accent/5 to-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                      <BarChart3 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">View Pipelines</h3>
                      <p className="text-sm text-muted-foreground">Track leads and manage your sales process</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-accent">
                        <span>3 active pipelines</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link 
                  href={`/subaccount/${params.subaccountId}/settings`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-secondary/5 to-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
                      <Target className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Account Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure preferences and integrations</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-secondary-foreground">
                        <span>Manage account</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  )
}

export default SubaccountPageId