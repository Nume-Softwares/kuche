'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'
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
import { EditMember } from './edit-member'
import { useRouter, useSearchParams } from 'next/navigation'
import { DialogMember } from './dialog-member'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export interface Member {
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string | null>('')

  useEffect(() => {
    const page = searchParams.get('page')
    const search = searchParams.get('search')

    if (!page) {
      router.replace(
        `/settings/accounts?page=${currentPage}&search=${searchTerm}`,
      )
    } else {
      setCurrentPage(Number(page))
    }

    if (search) {
      setSearchTerm(search)
    }
  }, [searchParams, router])

  useEffect(() => {
    router.push(`/settings/accounts?page=${currentPage}`)
  }, [currentPage, router])

  const { data: getMembers } = useQuery({
    queryKey: ['members', { currentPage, searchTerm }],
    queryFn: () =>
      fetch(`/api/members?page=${currentPage}&search=${searchTerm}`)
        .then((res) => res.json())
        .then((data: Member) => data),
  })

  useEffect(() => {
    const page = searchParams.get('page')

    if (!page) return
    if (!getMembers) return

    if (Number(page) > getMembers?.totalPages) {
      router.replace(`/settings/accounts?page=${getMembers?.totalPages}`)
    }
  }, [getMembers])

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

  function changeSearchTerm(term: string) {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="h-full space-y-2.5">
        <TableFilters
          changeSearchTerm={changeSearchTerm}
          searchTerm={searchTerm}
        />

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
                        <HoverCardTrigger>
                          <DialogMember member={member} trigger="STATUS" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-full">
                          {member.isActive
                            ? 'Desativar Usuário'
                            : 'Ativar Usuário'}
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="pl-1 pr-2">
                      <DialogMember member={member} trigger="DELETE" />
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
