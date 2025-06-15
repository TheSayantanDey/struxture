'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AreaChart } from '@tremor/react';

// Dynamically import ApexCharts (client-only)
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = {
  sessions?: Array<{
    created: string;
    amount_total: number;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
    visitors: number;
    conversions: number;
  }>;
  trafficSources: Array<{
    source: string;
    value: number;
    color: string;
  }>;
  funnelData?: Array<{
    name: string;
    visits: number;
    conversions: number;
    revenue: number;
    status: string;
  }>;
};

const SubaccountDashboardCharts = ({
  sessions,
  revenueData,
  trafficSources,
  funnelData = [],
}: Props) => {
  const valueFormatter = (value: number) =>
    sessions?.length ? `₹${value}` : `₹${(value / 1000).toFixed(0)}K`;

  const areaChartData = sessions?.length ? sessions : revenueData;
  const areaChartIndex = sessions?.length ? 'created' : 'month';
  const areaChartCategories = sessions?.length
    ? ['amount_total']
    : ['revenue', 'conversions'];

  // Pie Chart Data (Traffic Sources)
  const pieChartData = {
    series: trafficSources.map((item) => item.value),
    options: {
      chart: {
        type: 'pie' as const,
      },
      labels: trafficSources.map((item) => item.source),
      colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B'], // match source colors
      legend: {
        position: 'bottom',
      },
    },
  };

  // Funnel Chart Categories
  const funnelCategories = funnelData.map((item) => item.name);

  // Funnel Data Series
  const visitsSeries = [
    {
      name: 'Visits',
      data: funnelData.map((item) => item.visits),
    },
  ];
  const conversionsSeries = [
    {
      name: 'Conversions',
      data: funnelData.map((item) => item.conversions),
    },
  ];
  const revenueSeries = [
    {
      name: 'Revenue',
      data: funnelData.map((item) => item.revenue),
    },
  ];

  // Funnel Chart Options Template
  const createFunnelOptions = (title: string): ApexCharts.ApexOptions => ({
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    title: {
      text: title,
      align: 'center',
      style: { fontSize: '16px' },
    },
    xaxis: {
      categories: funnelCategories,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Area Chart */}
      <AreaChart
        data={areaChartData}
        index={areaChartIndex}
        categories={areaChartCategories}
        colors={['blue', 'emerald']}
        yAxisWidth={80}
        showAnimation={true}
        className="h-80"
        curveType="monotone"
        showGridLines={true}
        valueFormatter={valueFormatter}
      />

      {/* Traffic Sources - Apex Pie Chart */}
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-4">Traffic Sources</h4>
        <div className="flex items-center justify-center mb-6">
          {/* <div className="w-full max-w-md"> */}
            {/* <ApexChart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
              height={320}
            /> */}
          {/* </div> */}
        </div>
      </div>

      {/* Funnel Charts */}
      {funnelData.length > 0 && (
        <div className="space-y-10 mt-6">
          <div>
            <ApexChart
              options={createFunnelOptions('Visits')}
              series={visitsSeries}
              type="bar"
              height={300}
            />
          </div>
          <div>
            <ApexChart
              options={createFunnelOptions('Conversions')}
              series={conversionsSeries}
              type="bar"
              height={300}
            />
          </div>
          <div>
            <ApexChart
              options={createFunnelOptions('Revenue')}
              series={revenueSeries}
              type="bar"
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubaccountDashboardCharts;
