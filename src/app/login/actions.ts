'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Erro Supabase:', error)
    return { error: error.message }
  }

  // Verificar Role no Banco de Dados
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    // Se o usuário não existir no banco (mas existir no Auth), algo está errado ou precisa ser criado.
    // Por enquanto, vamos assumir que deve existir.
    return { error: 'Usuário não encontrado no sistema.' }
  }

  revalidatePath('/', 'layout')
  
  if (user.role === 'ADMIN') {
    redirect('/admin')
  } else {
    redirect('/app')
  }
}
