'use client'

import { AreaChart } from '@tremor/react'
import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ApexCharts (client-only)
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type Props = {
  revenueData: Array<{
    month: string
    revenue: number
    clients: number
    projects: number
  }>
  clientDistribution: Array<{
    name: string
    value: number
    color: string
  }>
}

const AgencyDashboardCharts = ({ revenueData, clientDistribution }: Props) => {
  const valueFormatter = (value: number) => `₹${(value / 1000).toFixed(0)}K`

  // ApexChart config for Client Distribution Pie
  const pieChartData = {
    series: clientDistribution.map((item) => item.value),
    options: {
      chart: {
        type: 'pie',
      },
      labels: clientDistribution.map((item) => item.name),
      colors: clientDistribution.map((item) => item.color),
      legend: {
        position: 'bottom',
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* AreaChart for Revenue & Projects */}
      <AreaChart
        data={revenueData}
        index="month"
        categories={['revenue', 'projects']}
        colors={['primary', 'accent']}
        yAxisWidth={80}
        showAnimation={true}
        className="h-80"
        curveType="monotone"
        showGridLines={true}
        valueFormatter={valueFormatter}
      />

      {/* Client Distribution Pie Chart */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-4">Client Distribution</h4>
        <div className="flex items-center justify-center mb-6">
          {/* <div className="w-full max-w-md">
            <ApexChart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
              height={300}
            />
          </div> */}
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {clientDistribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AgencyDashboardCharts
