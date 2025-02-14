'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Croissant,
  IceCreamCone,
  Martini,
  Pizza,
  Plus,
  Soup,
  X,
} from 'lucide-react'
import { CreateOrEditProduct } from './create-or-edit-product'

export function FilterProducts() {
  const status = [
    {
      value: 1,
      label: 'Pizzas',
      icon: <Pizza className="size-4" />,
    },
    {
      value: 2,
      label: 'Hamburgueres',
      icon: <Croissant className="size-4" />,
    },
    {
      value: 3,
      label: 'Sobremesas',
      icon: <IceCreamCone className="size-4" />,
    },
    {
      value: 4,
      label: 'Massas',
      icon: <Soup className="size-4" />,
    },
    {
      value: 5,
      label: 'Drinks',
      icon: <Martini className="size-4" />,
    },
  ]

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div>
          <Input className="w-60" placeholder="Pesquisar Produto" />
        </div>

        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecionar Categoria" />
          </SelectTrigger>
          <SelectContent>
            {status.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2 rounded-lg border px-1">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Produto Habilitado</Label>
        </div>

        <Button variant="outline">
          <X /> Limpar Filtro
        </Button>
      </div>

      <div>
        <CreateOrEditProduct>
          <Button>
            <Plus />
            Criar Produto
          </Button>
        </CreateOrEditProduct>
      </div>
    </div>
  )
}
