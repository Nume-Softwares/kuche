import { NextRequest } from 'next/server'
import { authenticatedFetch } from '../auth/sign-in/route'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const page = searchParams.get('page')
  const search = searchParams.get('search')

  const response = await authenticatedFetch(
    `${
      process.env.NEXT_PUBLIC_BASE_API_URL
    }/restaurant/categories?page=${page}&search=${search || ''}`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()

  return new Response(JSON.stringify(data), { status: response.status })
}
