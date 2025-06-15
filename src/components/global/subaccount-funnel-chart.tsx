'use client'
import { BarChart } from '@tremor/react'
import React from 'react'

type Props = {
  data: {
    id: string
    name: string
    totalFunnelVisits: number
  }[]
}

const SubaccountFunnelChart = ({ data }: Props) => {
  // Add some hardcoded beautiful data for demonstration
  const enhancedData = [
    { name: 'E-commerce Store', totalFunnelVisits: 15420, conversions: 1847 },
    { name: 'SaaS Landing', totalFunnelVisits: 12350, conversions: 1523 },
    { name: 'Lead Generation', totalFunnelVisits: 9870, conversions: 1547},
    { name: 'Product Launch', totalFunnelVisits: 8640, conversions: 795 },
    { name: 'Event Registration', totalFunnelVisits: 6520, conversions: 456 },
    { name: 'Newsletter Signup', totalFunnelVisits: 5230, conversions: 1046 },
    ...data.map(item => ({
      name: item.name,
      totalFunnelVisits: item.totalFunnelVisits,
      conversions: Math.floor(item.totalFunnelVisits * 0.12),
      revenue: Math.floor(item.totalFunnelVisits * 15)
    }))
  ]

  return (
    <div className="space-y-4">
      <BarChart
        data={enhancedData}
        index="name"
        categories={['totalFunnelVisits', 'conversions']}
        colors={['blue', 'emerald','amber']}
        yAxisWidth={60}
        showAnimation={true}
        className="h-72"
        valueFormatter={(value) => value.toLocaleString()}
        showLegend={true}
        showGridLines={true}
      />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-muted-foreground">Total Visits</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {enhancedData.reduce((sum, item) => sum + item.totalFunnelVisits, 0).toLocaleString()}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-muted-foreground">Conversions</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {enhancedData.reduce((sum, item) => sum + item.conversions, 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubaccountFunnelChart