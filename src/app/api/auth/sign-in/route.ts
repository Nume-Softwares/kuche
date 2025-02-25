import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  const body = await request.json()

  const additionalRestaurantId = {
    restaurantId: process.env.RESTAURANT_ID,
  }

  const mergedBody = {
    ...body,
    ...additionalRestaurantId,
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/sign-in`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mergedBody),
      method: 'POST',
    },
  )

  const data = await response.json()

  // Verificação de erro do backend
  if (response.status === 500) {
    return Response.json(
      {
        message: 'Erro interno no sistema',
      },
      { status: 500 },
    )
  }

  if (response.status === 401) {
    return Response.json(
      {
        message: 'Credenciais inválidas',
      },
      { status: 401 },
    )
  }

  const { id, name, email, access_token } = data

  cookieStore.set('jwt', access_token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return Response.json(
    { id, name, email },
    {
      status: 200,
    },
  )
}

// Função para fazer requisições autenticadas
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')

  if (!jwt) {
    redirect('/sign-in')
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${jwt.value}`,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}
