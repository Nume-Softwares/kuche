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

interface DialogCategoryProps {
  category: {
    id: string
    name: string
    isActive: boolean
    totalMenuItems: number
  }
  trigger: 'STATUS' | 'DELETE'
}

interface DialogStatusRequest {
  isActive: boolean
}

export function DialogCategory({ category, trigger }: DialogCategoryProps) {
  const queryClient = useQueryClient()
  const [isDialogCategoryOpen, setIsDialogCategoryOpen] =
    useState<boolean>(false)
  const { name, isActive } = category

  const { mutateAsync: updateStatusCategory } = useMutation({
    mutationKey: ['categoryStatus', category],
    mutationFn: async (data: DialogStatusRequest) => {
      const response = await fetch(`/api/categories/${category.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao mudar o status da categoria')
      }

      toast.success(
        `Categoria ${data.isActive ? 'ativado' : 'desativado'} com sucesso!`,
      )

      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsDialogCategoryOpen(false)
    },
    onError: () => {
      toast.error('Erro ao mudar o status da categoria')
    },
  })

  const { mutateAsync: deleteCategory } = useMutation({
    mutationKey: ['deleteCategory', category],
    mutationFn: async () => {
      const response = await fetch(`/api/categories/${category.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar o membro')
      }

      toast.success('Membro deletado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsDialogCategoryOpen(false)
    },
    onError: () => {
      toast.error('Erro ao deletar o membro')
    },
  })

  const handleConfirmAction = async () => {
    if (trigger === 'STATUS') {
      await updateStatusCategory({ isActive: !isActive })
    } else if (trigger === 'DELETE') {
      await deleteCategory()
    }
  }

  return (
    <Dialog open={isDialogCategoryOpen} onOpenChange={setIsDialogCategoryOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="size-9">
          {trigger === 'STATUS' ? (
            <ArchiveRestore className="size-4" />
          ) : (
            <Trash2 className="size-4 text-red-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {trigger === 'STATUS'
              ? isActive
                ? 'Desativar categoria'
                : 'Ativar categoria'
              : 'Deletar categoria'}
          </DialogTitle>
          <DialogDescription>
            {trigger === 'STATUS'
              ? isActive
                ? `Tem certeza que deseja desativar a categoria ${name}? Ele não terá mais acesso ao sistema.`
                : `Tem certeza que deseja ativar a categoria ${name}? Ele terá acesso ao sistema novamente.`
              : `Tem certeza que deseja deletar a categoria ${name}? Essa ação é irreversível e todos os dados serão perdidos.`}
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
