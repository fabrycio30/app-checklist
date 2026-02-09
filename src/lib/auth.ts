import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Buscar dados do usuário no Prisma para ter a role
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  })

  return dbUser
}

export async function requireAdmin() {
  const user = await getUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/login')
  }

  return user
}

export async function requireUser() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return user
}
