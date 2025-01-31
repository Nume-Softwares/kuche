import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/themes/theme-provider'
import { Toaster } from 'sonner'
import ReactQueryProviders from './reactQueryProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kuche',
  description: 'Gerenciamento de Restaurantes',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ptBR" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ReactQueryProviders>
          <Toaster richColors />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  )
}
