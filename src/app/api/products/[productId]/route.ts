import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { authenticatedFetch } from '../../auth/sign-in/route'

const getProductIdRestaurantSchema = z.string().uuid()

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const { productId } = await params

    getProductIdRestaurantSchema.parse(productId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item/${productId}`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar detalhes do produto' },
        { status: response.status },
      )
    }

    const member = await response.json()
    return NextResponse.json(member)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
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
  { params }: { params: { productId: string } },
) {
  try {
    const { productId } = await params
    const body = await request.json()

    getProductIdRestaurantSchema.parse(productId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item/${productId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    console.log('meu resposne', response)

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao atualizar complemento' },
        { status: response.status },
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('Erro no Route Handler:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Complemento não encontrado' },
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
  { params }: { params: { productId: string } },
) {
  try {
    const { productId } = await params

    getProductIdRestaurantSchema.parse(productId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item/${productId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao deletar produto' },
        { status: response.status },
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('Erro no Route Handler:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    )
  }
}
