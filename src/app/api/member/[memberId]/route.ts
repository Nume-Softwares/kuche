import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { authenticatedFetch } from '../../auth/sign-in/route'

// Validação do memberId
const getMemberIdRestaurantSchema = z.string().uuid()

export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } },
) {
  try {
    const { memberId } = await params

    getMemberIdRestaurantSchema.parse(memberId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/${memberId}`,
      {
        method: 'GET',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar membro' },
        { status: response.status },
      )
    }

    const member = await response.json()
    return NextResponse.json(member)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'ID do membro inválido' },
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
  { params }: { params: { memberId: string } },
) {
  try {
    const { memberId } = await params
    const body = await request.json()

    getMemberIdRestaurantSchema.parse(memberId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/${memberId}`,
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
  { params }: { params: { memberId: string } },
) {
  try {
    const { memberId } = await params

    getMemberIdRestaurantSchema.parse(memberId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/${memberId}`,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao deletar membro' },
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
