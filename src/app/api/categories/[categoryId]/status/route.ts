import { authenticatedFetch } from '@/app/api/auth/sign-in/route'
import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

const getCategoryIdRestaurantSchema = z.string().uuid()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { categoryId: string } },
) {
  try {
    const { categoryId } = await params
    const body = await request.json()

    console.log('cade????')

    getCategoryIdRestaurantSchema.parse(categoryId)

    console.log('passou aqui')

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/categories/${categoryId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )
    console.log('chegou', response)

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        {
          error: errorData.message || 'Erro ao atualizar o status da categoria',
        },
        { status: response.status },
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('Erro no Route Handler:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    )
  }
}
