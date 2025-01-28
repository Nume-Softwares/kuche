import { auth } from '@/auth'
import { SearchCommand } from '@/components/auth/search-command'
import { AppSidebar } from '@/components/auth/siderbar/sidebarMain'
import { ModeToggle } from '@/components/themes/mode-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Bell } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SearchCommand />

      <main className="w-full">
        <header className="flex justify-between px-8 pt-4">
          <SidebarTrigger className="size-8 border bg-white dark:bg-zinc-950 dark:hover:bg-neutral-800" />

          <div className="flex gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger className="relative flex size-8 items-center justify-center rounded-md border hover:bg-zinc-100">
                <Bell className="size-4" />
                <span className="absolute right-0 top-0 flex size-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  32
                </span>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {children}
      </main>
    </SidebarProvider>
  )
}
