'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowRightFromLine,
  CircleX,
  MessageSquareText,
  ReceiptText,
  Settings,
} from 'lucide-react'
import { TableFilters } from './table-filters'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useState } from 'react'
import { orders } from '../../../../data/orders'
import { details } from '../../../../data/details'

export function TableOrders() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  function statusColor(status: string) {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-500'
      case 'Concluido':
        return 'bg-green-500'
      case 'Cancelado':
        return 'bg-red-500'
      default:
        return 'bg-gray-400'
    }
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage)

  const currentOrders = orders.slice(
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
                <TableHead className="w-[40px]" />
                <TableHead className="w-[180px]">Identificador</TableHead>
                <TableHead className="w-[180px]">Realizado há</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="w-[140px] text-center">
                  Total do pedido
                </TableHead>
                <TableHead className="w-[80px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex w-full justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <ReceiptText className="size-4 cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="mb-2">
                              Pedido - #689
                            </DialogTitle>
                            <DialogDescription className="space-y-2">
                              <div className="flex items-center gap-1">
                                Nome do Cliente: {details.customer}
                              </div>
                              <div className="flex items-center gap-1">
                                Contato: {details.phoneNumber}
                              </div>
                              <div className="flex items-center gap-1">
                                Pedido realizado em: {details.date}
                              </div>
                              <div className="flex items-center gap-1">
                                Status do Pedido:{' '}
                                <div
                                  className={`size-2 rounded-full ${statusColor(
                                    details.status,
                                  )}`}
                                />
                                {details.status}
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <Card>
                            <CardHeader className="pb-4">
                              <CardTitle className="text-sm">
                                Endereço de entrega
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                              <div className="flex space-x-2 text-xs text-zinc-800">
                                <div>Endereço:</div>
                                <span>{details.address.street}</span>
                              </div>
                              <div className="flex space-x-2 text-xs text-zinc-800">
                                <div>Número:</div>
                                <span>{details.address.number}</span>
                              </div>
                              <div className="flex space-x-2 text-xs text-zinc-800">
                                <div>Bairro:</div>
                                <span>{details.address.neighborhood}</span>
                              </div>
                              <div className="flex space-x-2 text-xs text-zinc-800">
                                <div>CEP:</div>
                                <span>{details.address.zipcode}</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="max-h-[150px] overflow-auto">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-sm">
                                Observação
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                              <div className="flex text-xs text-zinc-800">
                                {details.observation}
                              </div>
                            </CardContent>
                          </Card>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Qntd</TableHead>
                                <TableHead className="w-full">Item</TableHead>
                                <TableHead className="min-w-[100px]" />
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {details.orders.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.product}</TableCell>

                                  <TableCell className="text-end">
                                    {item.price}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={2}>Total</TableCell>
                                <TableCell className="text-right">
                                  {details.total_price}
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>

                          <div className="flex w-full gap-2">
                            <Button variant={'outline'} className="w-full">
                              Cancelar Pedido
                            </Button>
                            <Button className="w-full">Concluir Pedido</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate">
                    {order.id}
                  </TableCell>
                  <TableCell>{order.created_at}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div
                        className={`size-2 rounded-full ${statusColor(
                          order.status,
                        )}`}
                      />
                      {order.status}
                    </div>
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-center">
                    {order.total_price}
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
                            <MessageSquareText className="size-4" /> Entrar em
                            contato
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CircleX className="size-4" />
                            Cancelar Pedido
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowRightFromLine /> Alterar Status
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
