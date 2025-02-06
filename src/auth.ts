import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { cookies } from 'next/headers'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        id: {},
        name: {},
        email: {},
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.name) {
          return null
        }

        const user = {
          name: credentials.name as string,
          email: credentials.email as string,
        }

        return user
      },
    }),
    Google,
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Verifica se o login foi feito com o Google
      if (account?.provider === 'google') {
        try {
          // Chama o endpoint do backend para verificar o e-mail e obter o token JWT
          const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/restaurant/member/google`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                restaurantId: process.env.RESTAURANT_ID,
              }),
            },
          )

          if (!backendResponse.ok) {
            return '/sign-in?status=google_failed'
          }

          const { access_token } = await backendResponse.json()

          const cookieStore = await cookies()

          cookieStore.set('jwt', access_token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/',
          })

          return '/sign-in?status=true'
        } catch (error) {
          console.log('Erro ao fazer login com o Google:', error)
          return false
        }
      }

      return true
    },

    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})
