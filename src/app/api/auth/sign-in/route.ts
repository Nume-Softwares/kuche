import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()

  const body = await request.json()

  const response = await fetch(`http://localhost:3333/restaurant/sign-in`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    method: 'POST',
  })

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
