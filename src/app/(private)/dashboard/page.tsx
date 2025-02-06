import { auth } from '@/auth'
import { CardData } from '@/components/auth/dashboard/card-data'
import { ChartInteractive } from '@/components/auth/dashboard/card-interactive'
import { ChartPie } from '@/components/auth/dashboard/chart-pie'

export default async function DashboardPage() {
  const session = await auth()

  console.log('meu session', session)

  return (
    <div className="flex flex-col gap-4 p-8 pt-4">
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Ínicio</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe os dados do seu restaurante com base nos pedidos
        </p>
      </header>
      <div className="flex gap-4">
        <CardData />
      </div>
      <div className="flex gap-4">
        {/* <ChartLinear /> */}
        <ChartPie />
        <ChartInteractive />
      </div>
    </div>
  )
}
