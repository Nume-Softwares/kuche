import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

export function CardData() {
  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            Faturamento Mensal
          </CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-2xl font-bold tracking-tight">R$ 1232,90</span>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 dark:text-emerald-400">+13%</span>{' '}
            em relação ao mês passado
          </p>
        </CardFooter>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">
            Cancelamentos Mensal
          </CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-1">
          <span className="text-2xl font-bold tracking-tight">6</span>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 dark:text-emerald-400">+4%</span>{' '}
            em relação ao mês passado
          </p>
        </CardFooter>
      </Card>
    </>
  )
}
