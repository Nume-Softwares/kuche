import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { authenticatedFetch } from '../../auth/sign-in/route'

// Validação do memberId
const getMemberIdRestaurantSchema = z.string().uuid()

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    console.log('chegou aqui')

    // Acessa o memberId de params
    const { memberId } = params

    // Valida o memberId
    getMemberIdRestaurantSchema.parse(memberId)

    // Faz a requisição ao backend NestJS
    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/${memberId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: request.headers.get('Authorization') || '', // Passa o token de autenticação
        },
      },
    )

    console.log('meu response', response)

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
    console.error('Erro no Route Handler:', error)

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
