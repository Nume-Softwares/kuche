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
import { DialogCategory } from './dialog-category'
import { CreateOrEditCategory } from './create-or-edit-category'
import { Button } from '@/components/ui/button'
import { Pencil, Plus } from 'lucide-react'
import { TableFiltersCategories } from './table-filters-categories'

export interface Categories {
  categories: {
    id: string
    name: string
    isActive: boolean
    totalMenuItems: number
  }[]
  totalPages: number
}

export function TableCategory() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string | null>('')

  useEffect(() => {
    const page = searchParams.get('page')
    const search = searchParams.get('search')

    if (!page) {
      router.replace(
        `/manage/category?page=${currentPage}&search=${searchTerm}`,
      )
    } else {
      setCurrentPage(Number(page))
    }

    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams, router])

  useEffect(() => {
    router.push(`/manage/category?page=${currentPage}`)
  }, [currentPage, router])

  const { data: getCategories } = useQuery({
    queryKey: ['categories', { currentPage, searchTerm }],
    queryFn: () =>
      fetch(`/api/categories?page=${currentPage}&search=${searchTerm}`)
        .then((res) => res.json())
        .then((data: Categories) => data),
  })

  useEffect(() => {
    const page = searchParams.get('page')

    if (!page) return
    if (!getCategories) return

    if (Number(page) > getCategories?.totalPages) {
      router.replace(`/manage/category?page=${getCategories?.totalPages}`)
    }
  }, [getCategories])

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (getCategories?.totalPages || 1)) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < (getCategories?.totalPages || 1)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const totalPages = getCategories?.totalPages ?? 1

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
          <CreateOrEditCategory>
            <Button>
              <Plus className="size-4" />
              Criar Categoria
            </Button>
          </CreateOrEditCategory>
          <TableFiltersCategories
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
                <TableHead className="w-[120px]">Qntd</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[44px] text-center" />
                <TableHead className="w-[44px] text-center" />
                <TableHead className="w-[44px] text-center" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {getCategories ? (
                getCategories.totalPages > 0 ? (
                  getCategories.categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="max-w-[180px] truncate">
                        {category.id}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.totalMenuItems}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div
                            className={`size-2 rounded-full ${statusColor(
                              category.isActive,
                            )}`}
                          />
                          {category.isActive ? 'Ativo' : 'Inativo'}
                        </div>
                      </TableCell>
                      <TableCell className="px-1">
                        <CreateOrEditCategory categoryId={category.id}>
                          <Button variant={'outline'} className="size-9">
                            <Pencil className="size-4" />
                          </Button>
                        </CreateOrEditCategory>
                      </TableCell>
                      <TableCell className="px-1">
                        <DialogCategory category={category} trigger="STATUS" />
                      </TableCell>
                      <TableCell className="pl-1 pr-2">
                        <DialogCategory category={category} trigger="DELETE" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7}>
                      Nenhuma categoria encontrada.
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
