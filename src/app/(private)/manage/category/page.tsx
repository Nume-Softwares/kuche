import { TableCategory } from '@/components/auth/manage/category/table-category'

export default function CategoryPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Categorias</h1>
        <p className="text-sm text-muted-foreground">
          Crie ou gerencie suas categorias
        </p>
      </header>
      <TableCategory />
    </div>
  )
}
