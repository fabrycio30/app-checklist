import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { inspections } = body

  if (!Array.isArray(inspections)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const results = []

  for (const inspection of inspections) {
    try {
      // Verifica se já existe (idempotência)
      const existing = await prisma.inspection.findUnique({
        where: { id: inspection.id }
      })

      if (existing) {
        results.push({ id: inspection.id, status: 'already_exists' })
        continue
      }

      await prisma.inspection.create({
        data: {
          id: inspection.id,
          equipmentId: inspection.equipmentId,
          templateId: inspection.templateId,
          userId: user.id, // Usa o ID do usuário logado (que fez o sync)
          status: 'COMPLETED', // Se veio do sync, está completa
          answers: inspection.answers,
          createdAt: new Date(inspection.createdAt),
          syncedAt: new Date(),
        }
      })
      results.push({ id: inspection.id, status: 'success' })
    } catch (error) {
      console.error('Error syncing inspection:', error)
      results.push({ id: inspection.id, status: 'error' })
    }
  }

  return NextResponse.json({ results })
}
