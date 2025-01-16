'use client'

import { Input } from '@/components/ui/input'

export function TableFilters() {
  return (
    <div className="flex justify-between">
      <div>
        <Input className="w-60" placeholder="Pesquisar Cliente" />
      </div>
    </div>
  )
}
