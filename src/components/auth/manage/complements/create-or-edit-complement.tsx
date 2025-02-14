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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { formmatedPrice } from '@/utils/formattedPrice'

interface Complement {
  complementId: string
  name: string
  price: number
}

const fetchComplement = async (
  complementId?: string,
): Promise<Complement | undefined> => {
  if (!complementId) return

  const response = await fetch(`/api/complements/${complementId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar complemento')
  }

  const data: Complement = await response.json()
  return data
}

const editComplementFormSchema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
  price: z.string().nonempty({ message: 'Campo obrigatório' }),
})

type EditComplementFormType = z.infer<typeof editComplementFormSchema>

interface EditComplementProps {
  complementId?: string
  children: ReactNode
}

export function CreateOrEditComplement({
  complementId,
  children,
}: EditComplementProps) {
  const queryClient = useQueryClient()

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)

  const { data: complement, isLoading: isComplementLoading } = useQuery({
    queryKey: ['complement', complementId],
    queryFn: () => fetchComplement(complementId),
    enabled: isSheetOpen && !!complementId,
  })

  const { mutateAsync: createComplement } = useMutation({
    mutationFn: async (data: EditComplementFormType) => {
      const priceAsNumber = parseFloat(
        data.price.replace('R$', '').replace('.', '').replace(',', '.'),
      )

      const response = await fetch(`/api/complements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, price: priceAsNumber }),
      })

      if (!response.ok) {
        return toast.error('Erro ao criar complemento')
      }

      toast.success('Complemento criado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['complements'] })
      return
    },
    onSuccess: () => setIsSheetOpen(false),
  })

  const { mutateAsync: editComplement } = useMutation({
    mutationFn: async (data: EditComplementFormType) => {
      const priceAsNumber = parseFloat(
        data.price.replace('R$', '').replace('.', '').replace(',', '.'),
      )

      const response = await fetch(`/api/complements/${complementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, price: priceAsNumber }),
      })

      if (!response.ok) {
        return toast.error('Erro ao editar complemento')
      }

      toast.success('Complemento editado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['complements'] })
      return
    },
    onSuccess: () => setIsSheetOpen(false),
  })

  const form = useForm<EditComplementFormType>({
    resolver: zodResolver(editComplementFormSchema),
    defaultValues: {
      name: '',
      price: '',
    },
  })

  const { handleSubmit, control, reset, setValue } = form

  useEffect(() => {
    if (complement) {
      reset({
        name: complement.name,
        price: formmatedPrice(complement.price),
      })
    }
  }, [complement, reset])

  async function onSubmit(data: EditComplementFormType) {
    if (complementId) {
      await editComplement(data)
    } else {
      await createComplement(data)
    }
  }

  const isEditMode = !!complementId
  const isLoading = isEditMode ? isComplementLoading : false

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="flex items-center justify-center" asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          {complementId ? (
            <SheetTitle className="text-2xl font-bold">
              Editar Complemento
            </SheetTitle>
          ) : (
            <SheetTitle className="text-2xl font-bold">
              Criar Complemento
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
              <Skeleton className="mt-14 h-9 w-full" />
            ) : (
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do Complemento"
                        {...field}
                        className="w-full rounded-lg border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            )}

            {/* Campo Preço */}
            {isLoading && isEditMode ? (
              <Skeleton className="mt-14 h-9 w-full" />
            ) : (
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Preço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Valor do complemento"
                        className="w-full rounded-lg border border-gray-300 p-2"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                          const numberValue = value.replace(/\D/g, '')
                          const formattedValue = new Intl.NumberFormat(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          ).format(Number(numberValue) / 100)
                          setValue('price', formattedValue)
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
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
