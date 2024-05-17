'use client'

import { useTheme } from 'next-themes'
import Chart from 'react-apexcharts'
import { teal } from 'tailwindcss/colors'

interface ViewsCountChartProps {
  dates: string[]
  views: number[]
}

export default function ViewsCountChart({
  dates,
  views,
}: ViewsCountChartProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Chart
      type="area"
      width="100%"
      height={76}
      options={{
        chart: {
          id: 'webhook-events-amount-chart',
          toolbar: {
            show: false,
          },
          parentHeightOffset: 0,
          sparkline: {
            enabled: false,
          },
        },
        grid: {
          show: false,
          padding: {
            left: -9,
            right: -1,
            bottom: -8,
            top: -20,
          },
        },
        tooltip: {
          // enabled: false,
          theme: resolvedTheme,
          style: {
            fontFamily: 'Inter',
            fontSize: '11px',
          },
          y: {
            formatter: (value) => Math.round(value).toString(),
          },
        },
        colors: [teal[400]],
        stroke: {
          curve: 'smooth',
          width: 2,
          lineCap: 'butt',
        },
        fill: {
          gradient:
            resolvedTheme === 'light'
              ? {
                  opacityFrom: 0.8,
                  opacityTo: 0.4,
                }
              : {
                  opacityFrom: 0.4,
                  opacityTo: 0.1,
                },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          categories: dates,
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      }}
      series={[
        {
          name: 'Views',
          data: views,
        },
      ]}
    />
  )
}
