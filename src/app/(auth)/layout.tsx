import { SearchCommand } from '@/components/auth/search-command'
import { AppSidebar } from '@/components/auth/siderbar/sidebarMain'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SearchCommand />

      <main className="w-full">{children}</main>
    </SidebarProvider>
  )
}
