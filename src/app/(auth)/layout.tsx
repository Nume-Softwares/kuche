import { AppSidebar } from '@/components/auth/siderbar/sidebarMain'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
