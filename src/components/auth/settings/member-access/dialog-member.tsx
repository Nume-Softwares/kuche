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

interface DialogMemberProps {
  member: {
    id: string
    name: string
    email: string
    isActive: boolean
    role: {
      id: string
      name: string
    }
  }
  trigger: 'STATUS' | 'DELETE'
}

interface DialogStatusRequest {
  isActive: boolean
}

export function DialogMember({ member, trigger }: DialogMemberProps) {
  const queryClient = useQueryClient()
  const [isDialogMemberOpen, setIsDialogMemberOpen] = useState<boolean>(false)
  const { name, isActive } = member

  const { mutateAsync: updateStatusMember } = useMutation({
    mutationKey: ['memberStatus', member],
    mutationFn: async (data: DialogStatusRequest) => {
      const response = await fetch(`/api/member/${member.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao mudar o status do membro')
      }

      toast.success(
        `Membro ${data.isActive ? 'ativado' : 'desativado'} com sucesso!`,
      )

      queryClient.invalidateQueries({ queryKey: ['members'] })
      setIsDialogMemberOpen(false)
    },
    onError: () => {
      toast.error('Erro ao mudar o status do membro')
    },
  })

  const { mutateAsync: deleteMember } = useMutation({
    mutationKey: ['deleteMember', member],
    mutationFn: async () => {
      const response = await fetch(`/api/member/${member.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar o membro')
      }

      toast.success('Membro deletado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['members'] })
      setIsDialogMemberOpen(false)
    },
    onError: () => {
      toast.error('Erro ao deletar o membro')
    },
  })

  const handleConfirmAction = async () => {
    if (trigger === 'STATUS') {
      await updateStatusMember({ isActive: !isActive })
    } else if (trigger === 'DELETE') {
      await deleteMember()
    }
  }

  return (
    <Dialog open={isDialogMemberOpen} onOpenChange={setIsDialogMemberOpen}>
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
                ? 'Desativar usuário'
                : 'Ativar usuário'
              : 'Deletar usuário'}
          </DialogTitle>
          <DialogDescription>
            {trigger === 'STATUS'
              ? isActive
                ? `Tem certeza que deseja desativar o usuário ${name}? Ele não terá mais acesso ao sistema.`
                : `Tem certeza que deseja ativar o usuário ${name}? Ele terá acesso ao sistema novamente.`
              : `Tem certeza que deseja deletar o usuário ${name}? Essa ação é irreversível e todos os dados serão perdidos.`}
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
