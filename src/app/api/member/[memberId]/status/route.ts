import { authenticatedFetch } from '@/app/api/auth/sign-in/route'
import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

const getMemberIdRestaurantSchema = z.string().uuid()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { memberId: string } },
) {
  try {
    const { memberId } = await params
    const body = await request.json()

    getMemberIdRestaurantSchema.parse(memberId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/members/${memberId}/status`,
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
        { error: errorData.message || 'Erro ao atualizar o status do membro' },
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
