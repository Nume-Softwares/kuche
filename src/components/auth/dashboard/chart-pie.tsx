'use client'

import { TrendingUp } from 'lucide-react'
import { LabelList, Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
]

const chartConfig = {
  visitors: {
    label: 'Pedidos',
  },
  chrome: {
    label: 'Pizza',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Hamburguer',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Drinks',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Massas',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Outros',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function ChartPie() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Maiores pedidos por cartegoria</CardTitle>
        <CardDescription>Mês de Outubro</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          A venda de pizzas aumentaram 5% neste mês{' '}
          <TrendingUp className="size-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Dados referente ao mês passado
        </div>
      </CardFooter>
    </Card>
  )
}
