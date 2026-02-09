import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const templates = await prisma.checklistTemplate.findMany({
    include: {
      questions: {
        orderBy: { order: 'asc' }
      }
    }
  })

  const equipments = await prisma.equipment.findMany()

  return NextResponse.json({
    templates,
    equipments
  })
}
