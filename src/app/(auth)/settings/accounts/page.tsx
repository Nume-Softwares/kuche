import { TableComplements } from '@/components/auth/manage/complements/table-complements'

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
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
