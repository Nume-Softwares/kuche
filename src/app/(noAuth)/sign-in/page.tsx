import { auth } from '@/auth'
import { SignInForm } from '@/components/sign-in/sign-in-form'
import { GalleryVerticalEnd } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Kuche
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 size-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
