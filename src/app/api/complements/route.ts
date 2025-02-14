import { NextRequest, NextResponse } from 'next/server'
import { authenticatedFetch } from '../auth/sign-in/route'
import { ZodError } from 'zod'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const page = searchParams.get('page')
  const search = searchParams.get('search')

  const response = await authenticatedFetch(
    `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }/restaurant/menu-item-option?page=${page}&search=${search || ''}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()

  return new Response(JSON.stringify(data), { status: response.status })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/menu-item-option`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      return NextResponse.json(
        { error: errorData.message || 'Erro ao criar complemento' },
        { status: response.status },
      )
    }

    return new NextResponse(null, { status: 201 })
  } catch (error) {
    console.log('Erro no Route Handler:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Erro ao criar complemento' },
        { status: 404 },
      )
    }
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 },
    )
  }
}
