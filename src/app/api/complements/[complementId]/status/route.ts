import { authenticatedFetch } from '@/app/api/auth/sign-in/route'
import { NextRequest, NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

const getComplementIdRestaurantSchema = z.string().uuid()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { complementId: string } },
) {
  try {
    console.log('chegou aqui')

    const { complementId } = await params
    const body = await request.json()

    console.log('meu body', body)

    getComplementIdRestaurantSchema.parse(complementId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item-option/${complementId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    console.log('meu response', response)

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        {
          error:
            errorData.message || 'Erro ao atualizar o status do complemento',
        },
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
