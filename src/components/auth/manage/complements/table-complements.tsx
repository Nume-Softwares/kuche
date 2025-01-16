'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArchiveRestore, ScanSearch, Settings, Trash2 } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useState } from 'react'
import { category } from '../../../../../data/category'
import { TableFilters } from './table-filters'

export function TableComplements() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  function statusColor(status: boolean) {
    if (status) {
      return 'bg-green-500'
    } else {
      return 'bg-yellow-500'
    }
  }

  const totalPages = Math.ceil(category.length / itemsPerPage)

  const currentOrders = category.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2.5">
        <TableFilters />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Identificador</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[120px]">Qntd</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[80px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentOrders.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="max-w-[180px] truncate">
                    {category.id}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.qntdItems}</TableCell>
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
                  <TableCell>
                    <div className="flex w-full justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Settings className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <ArchiveRestore className="size-4" /> Arquivar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ScanSearch className="size-4" />
                            Visualizar Items
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
