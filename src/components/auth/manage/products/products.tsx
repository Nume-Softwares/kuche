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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { products } from '../../../../../data/products'
import { Settings, SquareChartGantt, Trash2 } from 'lucide-react'

export function Products() {
  function formatToBRL(number: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number)
  }

  return (
    <section className="flex flex-col gap-4">
      <FilterProducts />

      <div className="flex flex-wrap gap-6">
        {products.map((product, index) => (
          <Card key={index} className="w-[350px]">
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
                    src={product.image}
                    alt={product.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </AspectRatio>
              </div>

              <div className="mt-4">
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
              </div>

              <div className="mt-2 text-xl font-semibold">
                {formatToBRL(product.price)}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline">
                <SquareChartGantt />
                Detalhes
              </Button>
              <div className="flex gap-2">
                <Button variant={'secondary'}>
                  <Settings />
                </Button>
                <Button variant={'destructive'}>
                  <Trash2 />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
