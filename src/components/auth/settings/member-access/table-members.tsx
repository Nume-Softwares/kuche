'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { TableFilters } from '../../manage/complements/table-filters'
import { useQuery } from '@tanstack/react-query'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ArchiveRestore, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { EditMember } from './edit-member'

interface Member {
  members: {
    id: string
    name: string
    email: string
    isActive: boolean
    role: {
      id: string
      name: string
    }
  }[]
  totalPages: number
}

export function TableMembers() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data: getMembers } = useQuery({
    queryKey: ['members', { currentPage }],
    queryFn: () =>
      fetch(`/api/members?page=${currentPage}`)
        .then((res) => res.json())
        .then((data: Member) => data),
  })

  function statusColor(status: boolean) {
    if (status) {
      return 'bg-green-500'
    } else {
      return 'bg-yellow-500'
    }
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (getMembers?.totalPages || 1)) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < (getMembers?.totalPages || 1)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const totalPages = getMembers?.totalPages ?? 1

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="h-full space-y-2.5">
        <TableFilters />

        <div className="flex h-full flex-col justify-between rounded-md border pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Identificador</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[120px]">Perfil</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[44px] text-center" />
                <TableHead className="w-[44px] text-center" />
                <TableHead className="w-[44px] text-center" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {getMembers &&
                getMembers.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="max-w-[180px] truncate">
                      {member.id}
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.role.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div
                          className={`size-2 rounded-full ${statusColor(
                            member.isActive,
                          )}`}
                        />
                        {member.isActive ? 'Ativo' : 'Inativo'}
                      </div>
                    </TableCell>

                    <TableCell className="px-1">
                      <EditMember memberId={member.id} />
                    </TableCell>
                    <TableCell className="px-1">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant={'outline'} className="size-9">
                            <ArchiveRestore className="size-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-full">
                          Arquivar Usuário
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="pl-1 pr-2">
                      <Button
                        variant={'outline'}
                        className="size-9 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

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

              {/* Exibir "..." se necessário */}
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
    </div>
  )
}
