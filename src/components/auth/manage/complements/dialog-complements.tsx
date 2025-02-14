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

interface DialogComplementProps {
  complement: {
    id: string
    name: string
    isActive: boolean
  }
  trigger: 'STATUS' | 'DELETE'
}

interface DialogStatusRequest {
  isActive: boolean
}

export function DialogComplements({
  complement,
  trigger,
}: DialogComplementProps) {
  const queryClient = useQueryClient()
  const [isDialogComplementOpen, setIsDialogComplementOpen] =
    useState<boolean>(false)
  const { name, isActive } = complement

  const { mutateAsync: updateComplementStatus } = useMutation({
    mutationKey: ['complementStatus', complement],
    mutationFn: async (data: DialogStatusRequest) => {
      const response = await fetch(`/api/complements/${complement.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('meu resposneeeee', response)

      if (!response.ok) {
        throw new Error('Erro ao mudar o status do complemento')
      }

      toast.success(
        `Complemento ${data.isActive ? 'ativado' : 'desativado'} com sucesso!`,
      )

      queryClient.invalidateQueries({ queryKey: ['complements'] })
      setIsDialogComplementOpen(false)
    },
    onError: () => {
      toast.error('Erro ao mudar o status do complemento')
    },
  })

  const { mutateAsync: deleteComplement } = useMutation({
    mutationKey: ['deleteComplement', complement],
    mutationFn: async () => {
      const response = await fetch(`/api/complements/${complement.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar complemento')
      }

      toast.success('Complemento deletado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['complements'] })
      setIsDialogComplementOpen(false)
    },
    onError: () => {
      toast.error('Erro ao deletar o complemento')
    },
  })

  const handleConfirmAction = async () => {
    if (trigger === 'STATUS') {
      await updateComplementStatus({ isActive: !isActive })
    } else if (trigger === 'DELETE') {
      await deleteComplement()
    }
  }

  return (
    <Dialog
      open={isDialogComplementOpen}
      onOpenChange={setIsDialogComplementOpen}
    >
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
                ? 'Desativar complemento'
                : 'Ativar complemento'
              : 'Deletar complemento'}
          </DialogTitle>
          <DialogDescription>
            {trigger === 'STATUS'
              ? isActive
                ? `Tem certeza que deseja desativar o complemento ${name}? Ele não terá mais acesso ao sistema.`
                : `Tem certeza que deseja ativar o complemento ${name}? Ele terá acesso ao sistema novamente.`
              : `Tem certeza que deseja deletar o complemento ${name}? Essa ação é irreversível e todos os dados serão perdidos.`}
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
