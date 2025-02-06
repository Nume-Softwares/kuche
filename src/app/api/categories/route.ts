const getCategoryIdRestaurantSchema = z.string().uuid()

export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } },
) {
  try {
    const { memberId } = await params

    getCategoryIdRestaurantSchema.parse(memberId)

    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/${memberId}`,
      {
        method: 'GET',
      },
    )

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
