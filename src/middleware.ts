import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

const publicRoutes = [
  {
    path: '/sign-in',
    whenAuthenticated: 'redirect',
  },
  {
    path: '/sign-up',
    whenAuthenticated: 'redirect',
  },
  {
    path: '/',
    whenAuthenticated: 'next',
  },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find((route) => route.path === path)
  const authToken = request.cookies.get('jwt')

  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'

    return NextResponse.redirect(redirectUrl)
  }

  if (authToken && !publicRoute) {
    // Checar se o JWT está EXPIRADO

    const session = auth()

    if (!session) {
      // Caso esteja, redireciona para sign-in
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
