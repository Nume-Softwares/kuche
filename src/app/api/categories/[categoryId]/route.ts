import { NextRequest, NextResponse } from 'next/server'
import { authenticatedFetch } from '../../auth/sign-in/route'
import { z, ZodError } from 'zod'

const getCategoryIdRestaurantSchema = z.string().uuid()

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } },
) {
  try {
    const { categoryId } = await params
    console.log('chegou aqui')
    getCategoryIdRestaurantSchema.parse(categoryId)
    console.log('passou aqui', categoryId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/categories/${categoryId}`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar categoria' },
        { status: response.status },
      )
    }

    const member = await response.json()
    return NextResponse.json(member, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID da categoria inválida' },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { categoryId: string } },
) {
  try {
    const { categoryId } = await params
    const body = await request.json()

    getCategoryIdRestaurantSchema.parse(categoryId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/categories/${categoryId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao atualizar membro' },
        { status: response.status },
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('Erro no Route Handler:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Membro não encontrado' },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { categoryId: string } },
) {
  try {
    const { categoryId } = await params

    getCategoryIdRestaurantSchema.parse(categoryId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/categories/${categoryId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao deletar categoria' },
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
