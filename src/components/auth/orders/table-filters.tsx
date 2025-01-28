'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CalendarIcon, X } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TableFilters() {
  const [date, setDate] = useState<Date>()

  const status = [
    {
      value: 1,
      label: 'Concluido',
      color: 'bg-green-500',
    },
    {
      value: 2,
      label: 'Cancelado',
      color: 'bg-red-500',
    },
    {
      value: 3,
      label: 'Pendente',
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date ? (
                format(date, 'PPP', { locale: ptBR })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecionar Status" />
          </SelectTrigger>
          <SelectContent>
            {status.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${option.color}`} />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline">
          {' '}
          <X /> Limpar Filtro
        </Button>
      </div>

      <div>
        <Input className="w-60" placeholder="Pesquisar Cliente" />
      </div>
    </div>
  )
}
