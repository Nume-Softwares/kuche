import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { formmatedPrice } from '@/utils/formattedPrice'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ImageUp,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface CategoryActive {
  id: string
  name: string
}

interface Complements {
  price: number
  name: string
  id: string
}

// Esquema de validação usando Zod
const formSchema = z.object({
  name: z.string().min(1, 'O nome do produto é obrigatório'),
  description: z.string().min(1, 'A descrição do produto é obrigatória'),
  price: z.number().min(0, 'O preço deve ser maior ou igual a 0'),
  categoryId: z.string().min(1, 'A categoria do produto é obrigatória'),
  imageBase64: z.string().min(1, 'A imagem do produto é obrigatória'),
  complementIds: z.array(z.string()).optional(),
})

type FormCreateOrEditProductType = z.infer<typeof formSchema>

interface CreateOrEditProductProps {
  children: ReactNode
  product?: {
    id: string
    name: string
    description: string
    imageUrl: string
    isActive: boolean
    price: number
    categoryId: string
    options: {
      id: string
      name: string
      price: number
    }[]
  }
}

export function CreateOrEditProduct({
  children,
  product,
}: CreateOrEditProductProps) {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [searchComplement, setSearchComplement] = useState<string>('')
  const [isAnotherCreatingProduct, setIsAnotherCreatingProduct] =
    useState<boolean>(false)

  console.log('meu product', product)

  const { mutateAsync: editProduct } = useMutation({
    mutationFn: async (data: FormCreateOrEditProductType) => {
      const response = await fetch(`/api/products/${product?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return toast.error('Erro ao editar produto')
      }

      toast.success('Produto editado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      return
    },
    onSuccess: () => setIsDialogOpen(false),
  })

  const { mutateAsync: createProduct } = useMutation({
    mutationFn: async (data: FormCreateOrEditProductType) => {
      const response = await fetch(`/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        return toast.error('Erro ao cadastrar produto')
      }

      toast.success('Produto criado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      return
    },
  })

  const { data: categoryActives } = useQuery({
    queryKey: ['categoryActives'],
    queryFn: () =>
      fetch(`/api/categories/actives`)
        .then((res) => res.json())
        .then((data: CategoryActive[]) => data),
    refetchOnWindowFocus: false,
  })

  const { data: complementsActive } = useQuery({
    queryKey: ['complementsActive'],
    queryFn: () =>
      fetch(`/api/complements/all`)
        .then((res) => res.json())
        .then((data: Complements[]) => data),
    refetchOnWindowFocus: false,
  })

  const form = useForm<FormCreateOrEditProductType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageBase64: '',
      complementIds: [],
    },
  })

  const { handleSubmit, control, setValue, reset, watch, trigger } = form
  const selectedComplementIds = watch('complementIds', [])

  console.log('meu selected', selectedComplementIds)

  useEffect(() => {
    if (!isDialogOpen) {
      reset()
      setPreviewImage(null)
      setCurrentStep(1)
    }
  }, [isDialogOpen])

  useEffect(() => {
    if (product) {
      const complementIds = product.options.map((option) => option.id)

      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        imageBase64: product.imageUrl,
        complementIds: complementIds,
      })
      setPreviewImage(product.imageUrl)

      if (complementIds.length > 0) {
        setValue('complementIds', complementIds)
      }
    }
  }, [product, reset, setValue])
  const onSubmit = async (values: FormCreateOrEditProductType) => {
    if (currentStep !== 2) return

    if (product) {
      await editProduct(values)
    } else {
      await createProduct(values).then(() => {
        if (isAnotherCreatingProduct) {
          setIsAnotherCreatingProduct(false)
          reset()
          setPreviewImage(null)
          setCurrentStep(1)
          return
        }

        setIsDialogOpen(false)
      })
    }
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setValue('imageBase64', base64.split(',')[1])
        setPreviewImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangeImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleComplementClick = (complementId: string) => {
    const currentIds = selectedComplementIds || []
    const newIds = currentIds.includes(complementId)
      ? currentIds.filter((id) => id !== complementId)
      : [...currentIds, complementId]
    setValue('complementIds', newIds)
  }

  const handleNextStep = async () => {
    let isValid = false
    if (currentStep === 1) {
      isValid = await trigger(['name', 'description', 'price', 'categoryId'])
    } else if (currentStep === 2) {
      isValid = await trigger(['imageBase64'])
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleCreateAnotherProduct = async () => {
    setIsAnotherCreatingProduct(true)
    await handleSubmit(onSubmit)()
  }

  const filteredComplements = complementsActive?.filter((complement) =>
    complement.name.toLowerCase().includes(searchComplement.toLowerCase()),
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Criar Novo Produto'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Atualize as informações do item no menu do seu restaurante.'
              : 'Adicione um novo item ao menu do seu restaurante.'}
          </DialogDescription>
        </DialogHeader>

        {/* Stepper para indicar a etapa atual */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {[1, 2].map((step) => (
            <div
              key={step}
              className={`flex size-8 items-center justify-center rounded-full ${
                currentStep === step
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="imageBase64"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          {previewImage ? (
                            <div className="relative max-h-80">
                              <Card className="max-h-80 overflow-hidden">
                                <AspectRatio
                                  ratio={16 / 9}
                                  className="max-h-80"
                                >
                                  <Image
                                    src={previewImage}
                                    alt="Pré-visualização da imagem"
                                    className="max-h-80 rounded-lg object-cover"
                                    fill
                                  />
                                </AspectRatio>
                              </Card>
                              <Button
                                type="button"
                                variant="outline"
                                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white/90"
                                onClick={handleChangeImageClick}
                              >
                                <RotateCcw /> Alterar Imagem
                              </Button>
                            </div>
                          ) : (
                            <div className="flex h-80 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
                              <label
                                htmlFor="imageUpload"
                                className="flex h-80 w-full cursor-pointer flex-col items-center justify-center gap-1 text-center text-muted-foreground"
                              >
                                <ImageUp /> Clique para adicionar uma imagem
                                <div />
                              </label>
                            </div>
                          )}
                          <Input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            ref={fileInputRef}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome do produto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite a descrição do produto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-medium">
                          Preço
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o preço do produto"
                            className="w-full rounded-lg border border-gray-300 p-2"
                            value={
                              field.value ? formmatedPrice(field.value) : ''
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/\D/g, '')
                              const numericValue = Number(rawValue) / 100

                              field.onChange(numericValue)
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-between">
                        <FormLabel>Selecionar Categoria</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={`
                                justify-between
                                ${!field.value && 'text-muted-foreground'}
                              `}
                              >
                                {field.value
                                  ? categoryActives &&
                                    categoryActives.find(
                                      (category) => category.id === field.value,
                                    )?.name
                                  : 'Selecione a categoria'}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Pesquisar Categoria"
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Categoria não encontrada
                                </CommandEmpty>
                                <CommandGroup>
                                  {categoryActives &&
                                    categoryActives.map((category) => (
                                      <CommandItem
                                        value={category.id}
                                        key={category.id}
                                        onSelect={() => {
                                          setValue('categoryId', category.id)
                                        }}
                                      >
                                        {category.name}
                                        <Check
                                          className={`
                                        ml-auto
                                        ${
                                          category.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        }
                                      `}
                                        />
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Seleção de Complementos */}
            {currentStep === 2 && (
              <FormField
                control={form.control}
                name="complementIds"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Selecionar Complementos</FormLabel>
                    <Input
                      placeholder="Pesquisar complementos..."
                      value={searchComplement}
                      onChange={(e) => setSearchComplement(e.target.value)}
                      className="mb-4"
                    />
                    <div className="grid grid-cols-1 gap-2">
                      {filteredComplements &&
                        filteredComplements.map((complement) => (
                          <Card
                            key={complement.id}
                            className={`cursor-pointer p-4 transition-colors ${
                              selectedComplementIds &&
                              selectedComplementIds.includes(complement.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-muted'
                            }`}
                            onClick={() => handleComplementClick(complement.id)}
                          >
                            <div className="flex items-center justify-between">
                              <span>{complement.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {formmatedPrice(complement.price)}
                              </span>
                            </div>
                          </Card>
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Navegação entre os steps */}
            <DialogFooter className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    <ChevronLeft className="mr-2 size-4" /> Voltar
                  </Button>
                )}
              </div>
              <div>
                {currentStep < 2 ? (
                  <Button type="button" onClick={handleNextStep}>
                    Próximo <ChevronRight className="ml-2 size-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={() => handleSubmit(onSubmit)()}
                    >
                      {product ? 'Editar Produto' : 'Criar Produto'}
                    </Button>
                    {!product && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCreateAnotherProduct}
                        className="ml-2"
                      >
                        Criar mais um produto
                      </Button>
                    )}
                  </>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
