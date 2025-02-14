'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { ArchiveRestore, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'

interface DialogProductProps {
  product: {
    id: string
    name: string
    description: string
    imageUrl: string
    isActive: boolean
    price: number
    categoryId: string
  }
  trigger: 'STATUS' | 'DELETE'
}

interface DialogStatusRequest {
  isActive: boolean
}

export function DialogProducts({ product, trigger }: DialogProductProps) {
  const queryClient = useQueryClient()
  const [isDialogProductOpen, setIsDialogProductOpen] = useState<boolean>(false)
  const { name, isActive } = product

  const { mutateAsync: updateProductStatus } = useMutation({
    mutationKey: ['productStatus', product],
    mutationFn: async (data: DialogStatusRequest) => {
      const response = await fetch(`/api/products/${product.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao mudar o status do produto')
      }

      toast.success(
        `Produto ${data.isActive ? 'ativado' : 'desativado'} com sucesso!`,
      )

      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsDialogProductOpen(false)
    },
    onError: () => {
      toast.error('Erro ao mudar o status do produto')
    },
  })

  const { mutateAsync: deleteProduct } = useMutation({
    mutationKey: ['deleteProduct', product],
    mutationFn: async () => {
      const response = await fetch(`/api/products/${product.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar produto')
      }

      toast.success('Produto deletado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsDialogProductOpen(false)
    },
    onError: () => {
      toast.error('Erro ao deletar o produto')
    },
  })

  const handleConfirmAction = async () => {
    if (trigger === 'STATUS') {
      await updateProductStatus({ isActive: !isActive })
    } else if (trigger === 'DELETE') {
      await deleteProduct()
    }
  }

  return (
    <Dialog open={isDialogProductOpen} onOpenChange={setIsDialogProductOpen}>
      <DialogTrigger asChild>
        <Button
          variant={trigger === 'DELETE' ? 'destructive' : 'outline'}
          className="size-9"
        >
          {trigger === 'STATUS' ? (
            <ArchiveRestore className="size-4" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {trigger === 'STATUS'
              ? isActive
                ? 'Desativar produto'
                : 'Ativar produto'
              : 'Deletar produto'}
          </DialogTitle>
          <DialogDescription>
            {trigger === 'STATUS'
              ? isActive
                ? `Tem certeza que deseja desativar o produto ${name}? Ele não terá mais acesso ao sistema.`
                : `Tem certeza que deseja ativar o produto ${name}? Ele terá acesso ao sistema novamente.`
              : `Tem certeza que deseja deletar o produto ${name}? Essa ação é irreversível e todos os dados serão perdidos.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant={trigger === 'DELETE' ? 'destructive' : 'default'}
            onClick={handleConfirmAction}
          >
            {trigger === 'STATUS'
              ? isActive
                ? 'Desativar'
                : 'Ativar'
              : 'Deletar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
