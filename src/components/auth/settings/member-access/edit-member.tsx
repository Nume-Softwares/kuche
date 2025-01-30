'use client'

import { useState } from 'react'
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
import { useQuery } from '@tanstack/react-query'

const fetchMember = async (memberId: string) => {
  const response = await fetch(`/api/member/${memberId}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar membro')
  }
  return response.json()
}

const editMemberFormSchema = z.object({
  memberId: z.string().uuid(),
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
  email: z.string().email({ message: 'Necessário um e-mail válido' }),
  currentPassword: z
    .string()
    .min(1, { message: 'Insira a senha atual' })
    .optional(),
  newPassword: z
    .string()
    .min(6, { message: 'Minímo de 6 caracteres' })
    .optional(),
  roleId: z.string().uuid({ message: 'Selecione um cargo válido' }),
})

type EditMemberFormType = z.infer<typeof editMemberFormSchema>

interface EdutMemberPorps {
  memberId: string
}

export function EditMember({ memberId }: EdutMemberPorps) {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false)

  const { data, error, isLoading } = useQuery({
    queryKey: ['member', memberId],
    queryFn: () => fetchMember(memberId as string),
    enabled: isSheetOpen && !!memberId,
  })

  console.log('meu data', data)

  const form = useForm<EditMemberFormType>({
    resolver: zodResolver(editMemberFormSchema),
    defaultValues: {
      memberId: '',
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      roleId: '',
    },
  })

  const { handleSubmit, control } = form

  function onSubmit(data: EditMemberFormType) {
    console.log(data)
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Nome */}
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

            {/* Campo Email */}
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

            {/* Campo Cargo */}
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Cargo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-lg border border-gray-300 p-2">
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-lg border border-gray-300">
                      <SelectItem value="m@example.com">Cargo 1</SelectItem>
                      <SelectItem value="m@google.com">Cargo 2</SelectItem>
                      <SelectItem value="m@support.com">Cargo 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Switch para ativar/desativar a mudança de senha */}
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
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:w-auto"
              >
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
