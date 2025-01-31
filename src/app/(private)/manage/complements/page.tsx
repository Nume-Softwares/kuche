export default function ComplementsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Complementos</h1>
        <p className="text-sm text-muted-foreground">
          Crie ou gerencie seus complementos
        </p>
      </header>
      <TableComplements />
    </div>
  )
}
