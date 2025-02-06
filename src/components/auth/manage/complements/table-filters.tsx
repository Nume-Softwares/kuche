'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react' // Adicionar o useState

interface TableFiltersProps {
  searchTerm: string | null
  changeSearchTerm: (term: string) => void
}

export function TableFilters({
  searchTerm,
  changeSearchTerm,
}: TableFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '')

  function handleSearch() {
    changeSearchTerm(localSearchTerm)
  }

  return (
    <div className="flex justify-between">
      <div className="flex gap-1">
        <Button variant={'outline'} className="w-9" onClick={handleSearch}>
          <Search className="size-4" />
        </Button>
        <Input
          className="w-60"
          placeholder="Pesquisar Cliente"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
