'use client'

import { useActionState } from 'react'
import { login } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const initialState = {
  error: '',
}

export function LoginForm() {
  // @ts-ignore - useActionState types can be tricky with server actions returning different shapes
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Entre com seu email e senha para acessar o sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
