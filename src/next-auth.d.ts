// next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface User {
    providerAccountId?: string // Adiciona o campo providerAccountId ao tipo User
    provider?: string // Adiciona o campo provider ao tipo User
  }

  interface Session {
    user: User // Sobrescreve o tipo user na sessão para incluir os novos campos
  }
}
