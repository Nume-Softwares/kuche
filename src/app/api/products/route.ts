import { NextRequest, NextResponse } from 'next/server'
import { authenticatedFetch } from '../auth/sign-in/route'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const page = searchParams.get('page')
  const search = searchParams.get('search')

  const response = await authenticatedFetch(
    `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }/restaurant/menu-item?page=${page}&search=${search || ''}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()

  return new Response(JSON.stringify(data), { status: response.status })
}

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const response = await authenticatedFetch(
      'http://localhost:3333/restaurant/menu-item',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    console.log('meu response', response)

    if (!response.ok) {
      throw new Error('Erro ao criar o produto no backend')
    }

    return NextResponse.json({ message: 'Produto criado com sucesso!' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar o produto' },
      { status: 500 },
    )
  }
}
