import { TableComplements } from '@/components/auth/manage/complements/table-complements'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AccountSettingsPage() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')

  if (!jwt) {
    redirect('/sign-in')
  }

  return (
    <div className="flex h-[600px] flex-col gap-4 p-8">
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Perfis de Acesso</h1>
        <p className="text-sm text-muted-foreground">
          Crie ou gerencie seus usuários da plataforma
        </p>
      </header>
      <TableComplements />
    </div>
  )
}
