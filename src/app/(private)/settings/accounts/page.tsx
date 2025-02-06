import { TableMembers } from '@/components/auth/settings/member-access/table-members'

export default async function AccountSettingsPage() {
  return (
    <div className="flex h-[600px] flex-col gap-4 p-8">
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Perfis de Acesso</h1>
        <p className="text-sm text-muted-foreground">
          Crie ou gerencie seus usuários da plataforma
        </p>
      </header>
      <TableMembers />
    </div>
  )
}
