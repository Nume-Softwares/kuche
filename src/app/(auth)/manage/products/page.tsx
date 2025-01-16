import { Products } from '@/components/auth/manage/products/products'

export default function ManageProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Produtos</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe os produtos criado
        </p>
      </header>
      <Products />
    </div>
  )
}
