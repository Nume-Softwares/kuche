import { authenticatedFetch } from '../../auth/sign-in/route'

export async function GET() {
  const response = await authenticatedFetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/all-menu-item-option`,
    {
      method: 'GET',
    },
  )

  const data = await response.json()

  return new Response(JSON.stringify(data), { status: response.status })
}
