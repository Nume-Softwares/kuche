import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')

  const url = new URL(request.url)
  const searchParams = url.searchParams

  const page = searchParams.get('page')

  console.log('meu page', page)

  if (!jwt) {
    redirect('/sign-in')
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/members?page=${page}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt.value}`,
      },
      method: 'GET',
    },
  )

  console.log('meu resposne', response)

  const data = await response.json()

  return new Response(JSON.stringify(data), { status: response.status })
}
