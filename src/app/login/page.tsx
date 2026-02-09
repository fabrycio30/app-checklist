import { LoginForm } from '@/components/auth/login-form'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="mb-8 flex flex-col items-center space-y-4">
        <Logo width={200} height={80} />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Portal de Inspeção
        </h1>
      </div>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Transul. Todos os direitos reservados.
      </p>
    </div>
  )
}
