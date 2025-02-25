'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ReactNode, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

interface Product {
  id: string
  name: string
  description: string
  imageUrl: string
  isActive: boolean
  price: number
  category: {
    id: string
    name: string
  }
  options: {
    id: string
    name: string
    price: number
  }[]
}

interface DialogDetailsProductProps {
  product: {
    id: string
    name: string
    description: string
    imageUrl: string
    isActive: boolean
    price: number
    categoryId: string
    options: {
      id: string
      name: string
      price: number
    }[]
  }
  children: ReactNode
}

export function DialogDetailsProduct({
  product,
  children,
}: DialogDetailsProductProps) {
  const [isDialogDetailsOpen, setIsDialogDetailsOpen] = useState<boolean>(false)

  const { data: getDetailsProductId } = useQuery({
    queryKey: ['product', product],
    queryFn: () =>
      fetch(`/api/products/${product}`)
        .then((res) => res.json())
        .then((data: Product) => data),
    enabled: !!product && isDialogDetailsOpen,
  })

  console.log('meu getDetailsProduct', getDetailsProductId)

  return (
    <Dialog open={isDialogDetailsOpen} onOpenChange={setIsDialogDetailsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {getDetailsProductId && getDetailsProductId.name}
          </DialogTitle>
          <DialogDescription>Detalhes do produto</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getDetailsProductId && getDetailsProductId.name}</span>
              <Badge
                variant={
                  getDetailsProductId && getDetailsProductId.isActive
                    ? 'default'
                    : 'secondary'
                }
              >
                {getDetailsProductId && getDetailsProductId.isActive
                  ? 'Ativo'
                  : 'Inativo'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibição da imagem do produto */}
            {getDetailsProductId && product.imageUrl && (
              <div className="h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={getDetailsProductId.imageUrl}
                  alt={getDetailsProductId.name}
                  className="size-full object-cover"
                />
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Descrição</p>
              <p>
                {(getDetailsProductId && getDetailsProductId.description) ||
                  'Nenhuma descrição disponível.'}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Preço</p>
              <p>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(
                  Number(getDetailsProductId && getDetailsProductId.price),
                )}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p>
                {(getDetailsProductId && getDetailsProductId.category?.name) ||
                  'Nenhuma categoria associada.'}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Complementos</p>
              {getDetailsProductId &&
              getDetailsProductId.options &&
              getDetailsProductId.options.length > 0 ? (
                <ul className="space-y-2">
                  {getDetailsProductId.options.map((option, key: number) => (
                    <li key={key} className="flex items-center justify-between">
                      <span>{option.name}</span>
                      <Badge variant="outline">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(option.price)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma opção disponível.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
