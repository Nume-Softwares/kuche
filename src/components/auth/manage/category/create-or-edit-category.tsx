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

interface Category {
  categoryId: string
  name: string
}

const fetchCategory = async (
  categoryId?: string,
): Promise<Category | undefined> => {
  if (!categoryId) return

  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar membro')
  }

  const data: Category = await response.json()
  return data
}

const editCategoryFormSchema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
})

type EditCategoryFormType = z.infer<typeof editCategoryFormSchema>

interface EditCategoryProps {
  categoryId?: string
  children: ReactNode
}

export function CreateOrEditCategory({
  categoryId,
  children,
}: EditCategoryProps) {
  const queryClient = useQueryClient()

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)

  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategory(categoryId),
    enabled: isSheetOpen && !!categoryId,
  })

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: async (data: EditCategoryFormType) => {
      const response = await fetch(`/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return toast.error('Erro ao criar categoria')
      }

      toast.success('Categoria criada com sucesso')

      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      return
    },

    onSuccess: () => setIsSheetOpen(false),
  })

  const { mutateAsync: editCategory } = useMutation({
    mutationFn: async (data: EditCategoryFormType) => {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return toast.error('Erro ao editar categoria')
      }

      toast.success('Categoria editada com sucesso')

      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      return
    },

    onSuccess: () => setIsSheetOpen(false),
  })

  const form = useForm<EditCategoryFormType>({
    resolver: zodResolver(editCategoryFormSchema),
    defaultValues: {
      name: '',
    },
  })

  const { handleSubmit, control, reset } = form

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      })
    }
  }, [category, reset])

  async function onSubmit(data: EditCategoryFormType) {
    if (categoryId) {
      await editCategory(data)
    } else {
      await createCategory(data)
    }
  }

  const isEditMode = !!categoryId
  const isLoading = isEditMode ? isCategoryLoading : false

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger className="flex items-center justify-center" asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          {categoryId ? (
            <SheetTitle className="text-2xl font-bold">
              Editar Categoria
            </SheetTitle>
          ) : (
            <SheetTitle className="text-2xl font-bold">
              Criar Categoria
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
                        placeholder="Nome da Categoria"
                        {...field}
                        className="w-full rounded-lg border border-gray-300 p-2"
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
