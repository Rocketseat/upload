'use client'

import { dayjs } from '@nivo/dayjs'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import Chart from 'react-apexcharts'
import { violet } from 'tailwindcss/colors'

interface WebhookEventsChartProps {
  data: {
    date: string
    amount: number
  }[]
}

export default function WebhookEventsChart({ data }: WebhookEventsChartProps) {
  const { resolvedTheme } = useTheme()

  const chartData = useMemo(() => {
    const dates = []
    const values = []

    const sevenDaysAgo = dayjs().subtract(7, 'days')

    for (let i = 1; i <= 7; i++) {
      const refDate = sevenDaysAgo.add(i, 'day').startOf('day')
      const refDateFormatted = refDate.format('YYYY-MM-DD')

      const amountOnDate = data.find((item) => item.date === refDateFormatted)

      dates.push(refDate.format('MMMM D'))
      values.push(amountOnDate ? amountOnDate.amount : 0)
    }

    return { dates, values }
  }, [data])

  return (
    <Chart
      type="area"
      width={140}
      height={24}
      options={{
        chart: {
          id: 'webhook-events-amount-chart',
          toolbar: {
            show: false,
          },
          parentHeightOffset: 0,
          sparkline: {
            enabled: true,
          },
        },
        grid: {
          show: false,
          padding: {
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
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
        colors: [violet[400]],
        stroke: {
          curve: 'smooth',
          width: 2,
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
          categories: chartData.dates,
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
          name: 'Events',
          data: chartData.values,
        },
      ]}
    />
  )
}
