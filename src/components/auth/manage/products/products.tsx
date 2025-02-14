'use client'

import Image from 'next/image'

import { AspectRatio } from '@/components/ui/aspect-ratio'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { FilterProducts } from './filtersProduct'

import { Badge } from '@/components/ui/badge'
import { Pencil, SquareChartGantt } from 'lucide-react'
import { formmatedPrice } from '@/utils/formattedPrice'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreateOrEditProduct } from './create-or-edit-product'
import { DialogProducts } from './dialog-products'
import { DialogDetailsProduct } from './dialog-details-product-id'

export interface MenuItems {
  menuItems: {
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
  }[]
  totalPages: number
}
export function Products() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string | null>('')

  useEffect(() => {
    const page = searchParams.get('page')
    const search = searchParams.get('search')

    if (!page) {
      router.replace(
        `/manage/products?page=${currentPage}&search=${searchTerm}`,
      )
    } else {
      setCurrentPage(Number(page))
    }

    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams, router])

  useEffect(() => {
    router.push(`/manage/products?page=${currentPage}`)
  }, [currentPage, router])

  const { data: getComplements } = useQuery({
    queryKey: ['products', { currentPage, searchTerm }],
    queryFn: () =>
      fetch(`/api/products?page=${currentPage}&search=${searchTerm}`)
        .then((res) => res.json())
        .then((data: MenuItems) => data),
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const page = searchParams.get('page')

    if (!page) return
    if (!getComplements) return

    if (Number(page) > getComplements?.totalPages) {
      router.replace(`/manage/complements?page=${getComplements?.totalPages}`)
    }
  }, [getComplements])

  // const handlePageChange = (page: number) => {
  //   if (page > 0 && page <= (getComplements?.totalPages || 1)) {
  //     setCurrentPage(page)
  //   }
  // }

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1)
  //   }
  // }

  // const handleNextPage = () => {
  //   if (currentPage < (getComplements?.totalPages || 1)) {
  //     setCurrentPage(currentPage + 1)
  //   }
  // }

  // const totalPages = getComplements?.totalPages ?? 1

  // function changeSearchTerm(term: string) {
  //   setSearchTerm(term)
  //   setCurrentPage(1)
  // }

  return (
    <section className="flex flex-col gap-4">
      <FilterProducts />

      <div className="flex flex-wrap gap-6">
        {getComplements?.menuItems.map((product) => (
          <Card key={product.id} className="w-[350px]">
            <CardHeader>
              <CardTitle className="flex justify-between">
                {product.name}
                <Badge variant={'secondary'} className="flex gap-1">
                  <div
                    className={`size-2 rounded-full ${
                      product.isActive ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  {product.isActive ? 'Habilitado' : 'Desabilitado'}
                </Badge>
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
              <div className="mx-auto w-[300px]">
                <AspectRatio ratio={16 / 9} className="rounded-md bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              </div>

              {/* <div className="mt-4">
                <Carousel
                  opts={{
                    align: 'start',
                  }}
                  className="relative w-full max-w-lg"
                >
                  <CarouselContent className="flex">
                    {product.items.map((item) => (
                      <div key={item.id} className="pl-4">
                        <CarouselItem className="w-full shrink-0 grow-0 pl-0">
                          <Badge
                            variant="outline"
                            className="select-none whitespace-nowrap text-sm"
                          >
                            {item.label}
                          </Badge>
                        </CarouselItem>
                      </div>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div> */}

              <div className="mt-2 text-xl font-semibold">
                {formmatedPrice(product.price)}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <DialogDetailsProduct product={product}>
                <Button variant="outline">
                  <SquareChartGantt />
                  Detalhes
                </Button>
              </DialogDetailsProduct>
              <div className="flex gap-2">
                <CreateOrEditProduct product={product}>
                  <Button variant={'secondary'} className="size-9">
                    <Pencil />
                  </Button>
                </CreateOrEditProduct>

                <DialogProducts trigger="STATUS" product={product} />

                <DialogProducts trigger="DELETE" product={product} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
