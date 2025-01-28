'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ComponentPropsWithoutRef } from 'react'
import { signIn } from 'next-auth/react' // Certifique-se de usar o `signIn` correto do next-auth
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInFormType = z.infer<typeof signInFormSchema>

export function SignInForm({
  className,
  ...props
}: ComponentPropsWithoutRef<'form'>) {
  const router = useRouter()

  async function handleSignGoogle() {
    try {
      await signIn('google')
    } catch (error) {
      console.error('Erro ao fazer login com o Google:', error)
    }
  }

  const methods = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { handleSubmit, control } = methods

  async function handleSignInCredentials(data: SignInFormType) {
    try {
      const authRestaurant = await fetch('/api/auth/sign-in', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        method: 'POST',
      })

      const response = await authRestaurant.json()

      console.log('meu resposne', response)

      if (authRestaurant.status === 500) {
        return toast.error('Erro inesperado ao entrar no sistema')
      }

      if (authRestaurant.status === 401) {
        console.log('caiu aqui')
        return toast.error('Credenciais inválidas')
      }

      const { id, name, email } = response

      const result = await signIn('credentials', {
        id,
        name,
        email,
        redirect: false,
      })

      console.log('meu result', result)

      if (result?.error) {
        return
      } else {
        router.push('/dashboard')
        toast.success('Login bem-sucedido')
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('meu erro', JSON.parse(error.message))

        const { statusCode } = JSON.parse(error.message)
        if (statusCode === 401) {
          return toast.error('Credenciais invalidas!')
        }
      }
      toast.error('Erro inesperado ao fazer login com credenciais')
    }
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={handleSubmit(handleSignInCredentials)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Faça login na sua conta</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Insira seu e-mail para acessar.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Ou faça login com.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSignGoogle}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Faça login com o Google.
          </Button>
        </div>
      </form>
    </Form>
  )
}
