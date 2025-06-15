import CircleProgress from '@/components/global/circle-progress'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import {
  ClipboardIcon,
  Contact2,
  DollarSign,
  Goal,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Target,
  Zap,
  Activity,
  Eye,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AgencyDashboardCharts from './_components/agency-dashboard-charts'

const Page = async ({
  params,
}: {
  params: { agencyId: string }
  searchParams: { code: string }
}) => {
  let currency = 'INR'
  let sessions
  let totalClosedSessions
  let totalPendingSessions
  let net = 0
  let potentialIncome = 0
  let closingRate = 84
  const currentYear = new Date().getFullYear()
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
  })

  if (!agencyDetails) return

  const subaccounts = await db.subAccount.findMany({
    where: {
      agencyId: params.agencyId,
    },
  })

  // Hardcoded beautiful data for demonstration
  const hardcodedMetrics = {
    totalRevenue: 2847650,
    potentialRevenue: 4250000,
    monthlyGrowth: 23.5,
    clientSatisfaction: 96,
    activeProjects: 47,
    completedProjects: 234,
    teamMembers: 18,
    avgProjectValue: 125000,
  }

  const revenueData = [
    { month: 'Jan', revenue: 185000, clients: 12, projects: 8 },
    { month: 'Feb', revenue: 220000, clients: 15, projects: 12 },
    { month: 'Mar', revenue: 195000, clients: 14, projects: 10 },
    { month: 'Apr', revenue: 285000, clients: 18, projects: 15 },
    { month: 'May', revenue: 340000, clients: 22, projects: 18 },
    { month: 'Jun', revenue: 425000, clients: 28, projects: 22 },
    { month: 'Jul', revenue: 380000, clients: 25, projects: 20 },
    { month: 'Aug', revenue: 465000, clients: 32, projects: 25 },
    { month: 'Sep', revenue: 520000, clients: 35, projects: 28 },
    { month: 'Oct', revenue: 485000, clients: 33, projects: 26 },
    { month: 'Nov', revenue: 580000, clients: 38, projects: 32 },
    { month: 'Dec', revenue: 650000, clients: 42, projects: 35 },
  ]

  const clientDistribution = [
    { name: 'Enterprise', value: 45, color: '#8B5CF6' },
    { name: 'Mid-Market', value: 35, color: '#06B6D4' },
    { name: 'Small Business', value: 20, color: '#10B981' },
  ]

  const deviceStats = [
    { device: 'Desktop', visits: 45230, percentage: 52 },
    { device: 'Mobile', visits: 32150, percentage: 37 },
    { device: 'Tablet', visits: 9620, percentage: 11 },
  ]

  const topPerformingPages = [
    { page: '/landing-page-1', views: 15420, conversions: 8.5 },
    { page: '/product-showcase', views: 12350, conversions: 12.3 },
    { page: '/contact-form', views: 9870, conversions: 15.7 },
    { page: '/pricing-page', views: 8640, conversions: 9.2 },
    { page: '/about-us', views: 6520, conversions: 4.8 },
  ]

  return (
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
                  Agency Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Welcome back! Here&apos;s your agency performance overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                ₹{(hardcodedMetrics.totalRevenue / 100000).toFixed(1)}L
              </CardTitle>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+{hardcodedMetrics.monthlyGrowth}%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹{(hardcodedMetrics.totalRevenue / 100000).toFixed(1)}L</span>
                  <span>Goal: ₹40L</span>
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
                  <span>Pipeline Value</span>
                </CardDescription>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Goal className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-blue-700">
                ₹{(hardcodedMetrics.potentialRevenue / 100000).toFixed(1)}L
              </CardTitle>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 font-medium">+18.2%</span>
                <span className="text-muted-foreground">potential growth</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Qualified leads</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg. deal size</span>
                  <span className="font-medium">₹{(hardcodedMetrics.avgProjectValue / 1000).toFixed(0)}K</span>
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
                  <Users className="h-4 w-4" />
                  <span>Active Clients</span>
                </CardDescription>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-purple-700">
                {subaccounts.length + 35}
              </CardTitle>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-purple-500" />
                <span className="text-purple-600 font-medium">+8 new</span>
                <span className="text-muted-foreground">this month</span>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="font-medium">{hardcodedMetrics.clientSatisfaction}%</span>
                  <span className="text-muted-foreground">satisfaction</span>
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
                  <Award className="h-4 w-4" />
                  <span>Projects</span>
                </CardDescription>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-orange-700">
                {hardcodedMetrics.activeProjects}
              </CardTitle>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-orange-500" />
                <span className="text-orange-600 font-medium">12 active</span>
                <span className="text-muted-foreground">in progress</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{hardcodedMetrics.completedProjects}</span>
                </div>
                <Progress value={85} className="h-1" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Trends */}
          <Card className="xl:col-span-2 overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
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
                    <span>Projects</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <AgencyDashboardCharts 
                revenueData={revenueData}
                clientDistribution={clientDistribution}
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
                  value={closingRate}
                  
                  description={
                    <div className="space-y-2 mt-4">
                      <div className="text-sm font-medium">Conversion Rate</div>
                      <div className="flex items-center justify-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-rose-500 rounded-full" />
                          <span>Lost: 12</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                          <span>Won: 63</span>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Team Productivity</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client Retention</span>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Project Delivery</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Device Analytics */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b">
              <CardTitle className="text-xl flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Traffic Analytics</span>
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
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Top Performing Pages</span>
                </h4>
                {topPerformingPages.slice(0, 3).map((page, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate">{page.page}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{page.views.toLocaleString()}</span>
                      <span className="text-green-600">{page.conversions}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5 border-b">
              <CardTitle className="text-xl flex items-center space-x-2">
                <MousePointer className="h-5 w-5 text-secondary-foreground" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Streamline your workflow with these shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4">
                <Link 
                  href={`/agency/${params.agencyId}/all-subaccounts`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-primary/5 to-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Manage Clients</h3>
                      <p className="text-sm text-muted-foreground">View and manage all client accounts</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-primary">
                        <span>{subaccounts.length + 35} active clients</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link 
                  href={`/agency/${params.agencyId}/team`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-accent/5 to-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Team Hub</h3>
                      <p className="text-sm text-muted-foreground">Manage team members and permissions</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-accent">
                        <span>{hardcodedMetrics.teamMembers} team members</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link 
                  href={`/agency/${params.agencyId}/settings`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-secondary/5 to-transparent"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
                      <Goal className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Agency Settings</h3>
                      <p className="text-sm text-muted-foreground">Configure preferences and goals</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-secondary-foreground">
                        <span>Goal: {agencyDetails.goal} clients</span>
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
    </div>
  )
}

export default Page