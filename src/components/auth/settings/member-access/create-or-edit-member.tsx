'use client'

import { ReactNode, useEffect, useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { UserPen, UserRoundPlus } from 'lucide-react'

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

const fetchMember = async (memberId?: string): Promise<Member | undefined> => {
  if (!memberId) return

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

const createOrEditMemberFormSchema = z
  .object({
    name: z.string().nonempty({ message: 'Campo obrigatório' }),
    email: z.string().email({ message: 'Necessário um e-mail válido' }),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    roleId: z.string().uuid({ message: 'Selecione um cargo válido' }),
  })
  .refine(
    (data) => {
      if (!data.currentPassword && !data.newPassword) return true
      return data.newPassword === data.confirmPassword
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    },
  )

type CreateOrEditMemberFormType = z.infer<typeof createOrEditMemberFormSchema>

interface CreateOrEditMembeProps {
  memberId?: string
  children: ReactNode
}

export function CreateOrEditMember({
  memberId,
  children,
}: CreateOrEditMembeProps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false)

  const { data: member, isLoading: isMemberLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => fetchMember(memberId),
    enabled: isSheetOpen && !!memberId,
  })

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    enabled: isSheetOpen,
  })

  const { mutateAsync: createMember } = useMutation({
    mutationFn: async (data: CreateOrEditMemberFormType) => {
      const response = await fetch(`/api/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return toast.error('Erro ao cadastrar membro')
      }

      toast.success('Membro cadastrado com sucesso')

      return
    },

    onSuccess: () => setIsSheetOpen(false),
  })

  const { mutateAsync: editMember } = useMutation({
    mutationFn: async (data: CreateOrEditMemberFormType) => {
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

  const form = useForm<CreateOrEditMemberFormType>({
    resolver: zodResolver(createOrEditMemberFormSchema),
    defaultValues: {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
        confirmPassword: '',
        roleId: member.role.id,
      })
    }
    if (!isSheetOpen) {
      reset()
    }
  }, [member, roles, reset, isSheetOpen])

  async function onSubmit(data: CreateOrEditMemberFormType) {
    if (memberId) {
      await editMember(data)
    } else {
      const { name, email, roleId, currentPassword: password } = data

      const formatedData = {
        name,
        email,
        password,
        roleId,
      }

      await createMember(formatedData)
    }
  }

  const isEditMode = !!memberId
  const isLoading = isEditMode ? isMemberLoading || isRolesLoading : false

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="flex items-center justify-center" asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          {memberId ? (
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
              <UserPen className="size-6" />
              Editar Usuário
            </SheetTitle>
          ) : (
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
              <UserRoundPlus className="size-6" />
              Novo Usuário
            </SheetTitle>
          )}
          <SheetDescription className="text-sm text-muted-foreground">
            Após o salvamento do formulário a ação não poderá ser desfeita.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${isLoading ? 'space-y-14' : 'space-y-6'}`}
          >
            {/* Campo Nome */}
            {isLoading && isEditMode ? (
              <Skeleton className="h-9 w-full" />
            ) : (
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
            )}

            {/* Campo Email */}
            {isLoading && isEditMode ? (
              <Skeleton className="h-9 w-full" />
            ) : (
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
            )}

            {/* Campo Cargo */}
            {isLoading && isEditMode ? (
              <Skeleton className="h-9 w-full" />
            ) : (
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
                        {roles?.map((role) => (
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
            )}

            {/* Switch para ativar/desativar a mudança de senha (apenas no modo de edição) */}
            {isEditMode && (
              <>
                {isLoading ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
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
                )}
              </>
            )}

            {/* Campos de senha (condicionais) */}
            {(isPasswordChangeEnabled || !isEditMode) && (
              <div className="space-y-4">
                {/* Campo Senha (apenas no modo de criação ou se o switch estiver ativado) */}
                <FormField
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {isEditMode ? 'Nova Senha' : 'Senha'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            isEditMode
                              ? 'Digite sua nova senha'
                              : 'Digite sua senha'
                          }
                          {...field}
                          className="w-full rounded-lg border border-gray-300 p-2"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Campo Confirmar Senha (apenas no modo de criação ou se o switch estiver ativado) */}
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {isEditMode
                          ? 'Confirmar Nova Senha'
                          : 'Confirmar Senha'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={
                            isEditMode
                              ? 'Confirme sua nova senha'
                              : 'Confirme sua senha'
                          }
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
            {!isLoading && (
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
