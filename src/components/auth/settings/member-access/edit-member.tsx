'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserPen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface Member {
  email: string
  id: string
  isActive: boolean
  name: string
  role: {
    id: string
    name: string
  }
}

interface Roles {
  id: string
  name: string
}

const fetchMember = async (memberId: string): Promise<Member> => {
  const response = await fetch(`/api/member/${memberId}`)

  if (!response.ok) {
    throw new Error('Erro ao buscar membro')
  }

  const data: Member = await response.json()
  return data
}

const fetchRoles = async (): Promise<Roles[]> => {
  const response = await fetch(`/api/roles`)

  if (!response.ok) {
    throw new Error('Erro ao buscar cargos')
  }

  const data: Roles[] = await response.json()
  return data
}

const editMemberFormSchema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
  email: z.string().email({ message: 'Necessário um e-mail válido' }),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  roleId: z.string().uuid({ message: 'Selecione um cargo válido' }),
})

type EditMemberFormType = z.infer<typeof editMemberFormSchema>

interface EditMemberProps {
  memberId: string
}

export function EditMember({ memberId }: EditMemberProps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false)

  const { data: member } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => fetchMember(memberId),
    enabled: isSheetOpen && !!memberId,
  })

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    enabled: isSheetOpen && !!memberId,
  })

  const { mutateAsync: editMember } = useMutation({
    mutationFn: async (data: EditMemberFormType) => {
      const response = await fetch(`/api/member/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return toast.error('Erro ao editar membro')
      }

      toast.success('Membro editado com sucesso')

      return
    },

    onSuccess: () => setIsSheetOpen(false),
  })

  const form = useForm<EditMemberFormType>({
    resolver: zodResolver(editMemberFormSchema),
    defaultValues: {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      roleId: '',
    },
  })

  const { handleSubmit, control, reset } = form

  useEffect(() => {
    if (member && roles) {
      reset({
        name: member.name,
        email: member.email,
        currentPassword: '',
        newPassword: '',
        roleId: member.role.id,
      })
    }
  }, [member, roles, reset])

  async function onSubmit(data: EditMemberFormType) {
    await editMember(data)
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="flex items-center justify-center" asChild>
        <Button variant={'outline'} className="size-9">
          <UserPen className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Editar Usuário</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Após o salvamento do formulário a ação não poderá ser desfeita.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${member && roles ? 'space-y-6' : 'space-y-14'}`}
          >
            {/* Campo Nome */}
            {member && roles ? (
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do Usuário"
                        {...field}
                        className="w-full rounded-lg border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ) : (
              <Skeleton className="mt-14 h-9 w-full" />
            )}

            {/* Campo Email */}
            {member && roles ? (
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="exemplo@email.com"
                        {...field}
                        className="w-full rounded-lg border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ) : (
              <Skeleton className="mt-28 h-9 w-full" />
            )}

            {/* Campo Cargo */}
            {member && roles ? (
              <FormField
                control={control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Cargo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      key={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full rounded-lg border border-gray-300 p-2">
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-lg border border-gray-300">
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            ) : (
              <Skeleton className="h-9 w-full" />
            )}

            {/* Switch para ativar/desativar a mudança de senha */}
            {member && roles ? (
              <FormItem className="flex items-center justify-between rounded-lg border border-gray-300 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium">
                    Alterar senha?
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={isPasswordChangeEnabled}
                    onCheckedChange={setIsPasswordChangeEnabled}
                    className="data-[state=checked]:bg-primary"
                  />
                </FormControl>
              </FormItem>
            ) : (
              <Skeleton className="h-9 w-full" />
            )}

            {/* Campos de senha (condicionais) */}
            {isPasswordChangeEnabled && (
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Senha Atual
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Digite sua senha atual"
                          {...field}
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nova Senha
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Digite sua nova senha"
                          {...field}
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Botão de submit */}
            {member && roles && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:w-auto"
                >
                  Salvar
                </Button>
              </div>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
