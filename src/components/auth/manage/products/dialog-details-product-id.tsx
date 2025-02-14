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

interface DialogDetailsProductProps {
  product: {
    id: string
    name: string
    description: string
    imageUrl: string
    isActive: boolean
    price: number
    category?: {
      id: string
      name: string
    }
    options?: {
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
    queryKey: ['product', product.id],
    queryFn: () =>
      fetch(`/api/products/${product.id}`)
        .then((res) => res.json())
        .then((data) => data),
    enabled: !!product && isDialogDetailsOpen,
  })

  console.log('meu getDetailsProduct', getDetailsProductId)

  return (
    <Dialog open={isDialogDetailsOpen} onOpenChange={setIsDialogDetailsOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Detalhes do produto</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{product.name}</span>
              <Badge variant={product.isActive ? 'default' : 'secondary'}>
                {product.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exibição da imagem do produto */}
            {product.imageUrl && (
              <div className="h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Descrição</p>
              <p>{product.description || 'Nenhuma descrição disponível.'}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Preço</p>
              <p>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(Number(product.price))}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Categoria</p>
              <p>{product.category?.name || 'Nenhuma categoria associada.'}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Complementos</p>
              {product.options && product.options.length > 0 ? (
                <ul className="space-y-2">
                  {product.options.map((option, key: number) => (
                    <li key={key} className="flex items-center gap-2">
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
          <DialogClose>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
