const fetchRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  route: string,
  bodyObject?: unknown,
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyObject ? JSON.stringify(bodyObject) : undefined,
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}${route}`,
    options,
  )

  if (
    response.status === 204 ||
    response.headers.get('Content-Length') === '0'
  ) {
    return {} as T
  }

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(
      JSON.stringify({ statusCode: response.status, message: errorMessage }),
    )
  }

  return (await response.json()) as T
}

export const fetchApi = {
  get: <T>(route: string) => fetchRequest<T>('GET', route),
  post: <T>(route: string, bodyObject: unknown) =>
    fetchRequest<T>('POST', route, bodyObject),
  put: <T>(route: string, bodyObject: unknown) =>
    fetchRequest<T>('PUT', route, bodyObject),
  patch: <T>(route: string, bodyObject: unknown) =>
    fetchRequest<T>('PATCH', route, bodyObject),
  delete: <T>(route: string) => fetchRequest<T>('DELETE', route),
}
