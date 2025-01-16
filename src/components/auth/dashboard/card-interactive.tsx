'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
const chartData = [
  { date: '2024-04-01', desktop: 7, mobile: 4 },
  { date: '2024-04-02', desktop: 8, mobile: 5 },
  { date: '2024-04-03', desktop: 12, mobile: 7 },
  { date: '2024-04-04', desktop: 10, mobile: 12 },
  { date: '2024-04-05', desktop: 11, mobile: 13 },
  { date: '2024-04-06', desktop: 14, mobile: 15 },
  { date: '2024-04-07', desktop: 5, mobile: 12 },
  { date: '2024-04-08', desktop: 8, mobile: 3 },
  { date: '2024-04-09', desktop: 12, mobile: 6 },
  { date: '2024-04-10', desktop: 13, mobile: 8 },
  { date: '2024-04-11', desktop: 9, mobile: 9 },
  { date: '2024-04-12', desktop: 16, mobile: 10 },
  { date: '2024-04-13', desktop: 8, mobile: 14 },
  { date: '2024-04-14', desktop: 4, mobile: 19 },
  { date: '2024-04-15', desktop: 2, mobile: 12 },
  { date: '2024-04-16', desktop: 8, mobile: 3 },
  { date: '2024-04-17', desktop: 13, mobile: 6 },
  { date: '2024-04-18', desktop: 12, mobile: 8 },
  { date: '2024-04-19', desktop: 10, mobile: 12 },
  { date: '2024-04-20', desktop: 15, mobile: 15 },
  { date: '2024-04-21', desktop: 5, mobile: 11 },
  { date: '2024-04-22', desktop: 7, mobile: 2 },
  { date: '2024-04-23', desktop: 4, mobile: 5 },
  { date: '2024-04-24', desktop: 10, mobile: 4 },
  { date: '2024-04-25', desktop: 12, mobile: 8 },
  { date: '2024-04-26', desktop: 11, mobile: 13 },
  { date: '2024-04-27', desktop: 9, mobile: 6 },
  { date: '2024-04-28', desktop: 6, mobile: 7 },
  { date: '2024-04-29', desktop: 3, mobile: 12 },
  { date: '2024-04-30', desktop: 6, mobile: 1 },
]

const chartConfig = {
  views: {
    label: 'Pedidos',
  },
  desktop: {
    label: 'Mês Atual',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mês Passado',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function ChartInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('desktop')

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [],
  )

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            Gráfico representa o total de pedidos em 4 semanas em comparação ao
            mês passado
          </CardDescription>
        </div>
        <div className="flex">
          {['desktop', 'mobile'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
