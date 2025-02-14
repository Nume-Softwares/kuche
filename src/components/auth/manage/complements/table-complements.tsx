'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Pencil, Plus } from 'lucide-react'
import { TableFiltersComplements } from './table-filters-complements'
import { CreateOrEditComplement } from './create-or-edit-complement'
import { formmatedPrice } from '@/utils/formattedPrice'
import { DialogComplements } from './dialog-complements'

export interface Complements {
  complements: {
    id: string
    name: string
    price: number
    isActive: boolean
  }[]
  totalPages: number
}

export function TableComplements() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string | null>('')

  useEffect(() => {
    const page = searchParams.get('page')
    const search = searchParams.get('search')

    if (!page) {
      router.replace(
        `/manage/complements?page=${currentPage}&search=${searchTerm}`,
      )
    } else {
      setCurrentPage(Number(page))
    }

    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams, router])

  useEffect(() => {
    router.push(`/manage/complements?page=${currentPage}`)
  }, [currentPage, router])

  const { data: getComplements } = useQuery({
    queryKey: ['complements', { currentPage, searchTerm }],
    queryFn: () =>
      fetch(`/api/complements?page=${currentPage}&search=${searchTerm}`)
        .then((res) => res.json())
        .then((data: Complements) => data),
  })

  useEffect(() => {
    const page = searchParams.get('page')

    if (!page) return
    if (!getComplements) return

    if (Number(page) > getComplements?.totalPages) {
      router.replace(`/manage/complements?page=${getComplements?.totalPages}`)
    }
  }, [getComplements])

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (getComplements?.totalPages || 1)) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < (getComplements?.totalPages || 1)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const totalPages = getComplements?.totalPages ?? 1

  function statusColor(status: boolean) {
    if (status) {
      return 'bg-green-500'
    } else {
      return 'bg-yellow-500'
    }
  }

  function changeSearchTerm(term: string) {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2.5">
        <div className="flex justify-between">
          <CreateOrEditComplement>
            <Button>
              <Plus className="size-4" />
              Criar Complemento
            </Button>
          </CreateOrEditComplement>
          <TableFiltersComplements
            changeSearchTerm={changeSearchTerm}
            searchTerm={searchTerm}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Identificador</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[80px]">Preço</TableHead>
                <TableHead className="w-[44px] text-center" />
                <TableHead className="w-[44px] text-center" />
                <TableHead className="w-[44px] text-center" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {getComplements ? (
                getComplements.totalPages > 0 ? (
                  getComplements.complements.map((complement) => (
                    <TableRow key={complement.id}>
                      <TableCell className="max-w-[180px] truncate">
                        {complement.id}
                      </TableCell>
                      <TableCell>{complement.name}</TableCell>
                      <TableCell>{formmatedPrice(complement.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div
                            className={`size-2 rounded-full ${statusColor(
                              complement.isActive,
                            )}`}
                          />
                          {complement.isActive ? 'Ativo' : 'Inativo'}
                        </div>
                      </TableCell>
                      <TableCell className="px-1">
                        <CreateOrEditComplement complementId={complement.id}>
                          <Button variant={'outline'} className="size-9">
                            <Pencil className="size-4" />
                          </Button>
                        </CreateOrEditComplement>
                      </TableCell>
                      <TableCell className="px-1">
                        <DialogComplements
                          complement={complement}
                          trigger="STATUS"
                        />
                      </TableCell>
                      <TableCell className="pl-1 pr-2">
                        <DialogComplements
                          complement={complement}
                          trigger="DELETE"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      Nenhum complemento encontrado.
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>Carregando...</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousPage} />
            </PaginationItem>

            {/* Gerar os links das páginas */}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? 'bg-zinc-200' : ''}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext onClick={handleNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
