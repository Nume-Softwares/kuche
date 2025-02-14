import { NextRequest, NextResponse } from 'next/server'
import { authenticatedFetch } from '../../auth/sign-in/route'
import { z, ZodError } from 'zod'

const getComplementIdRestaurantSchema = z.string().uuid()

export async function GET(
  request: NextRequest,
  { params }: { params: { complementId: string } },
) {
  try {
    const { complementId } = await params
    getComplementIdRestaurantSchema.parse(complementId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item-option/${complementId}`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar complemento' },
        { status: response.status },
      )
    }

    const complement = await response.json()

    console.log('meu data', complement)

    return NextResponse.json(complement, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID do Complemento inválido' },
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
  { params }: { params: { complementId: string } },
) {
  try {
    const { complementId } = await params
    const body = await request.json()

    getComplementIdRestaurantSchema.parse(complementId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item-option/${complementId}`,
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
  { params }: { params: { complementId: string } },
) {
  try {
    const { complementId } = await params

    getComplementIdRestaurantSchema.parse(complementId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item-option/${complementId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao deletar complemento' },
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
