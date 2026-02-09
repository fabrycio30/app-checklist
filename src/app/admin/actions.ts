'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function createEquipment(formData: FormData) {
  await requireAdmin()

  const plate = formData.get('plate') as string
  const model = formData.get('model') as string
  const brand = formData.get('brand') as string

  await prisma.equipment.create({
    data: { plate, model, brand }
  })

  revalidatePath('/admin/equipments')
}

export async function createTemplate(data: any) {
  await requireAdmin()
  
  // Data vem como JSON pois é complexo (nested questions)
  const { name, description, questions } = data

  await prisma.checklistTemplate.create({
    data: {
      name,
      description,
      questions: {
        create: questions.map((q: any, index: number) => ({
          text: q.text,
          type: q.type,
          options: q.options || [],
          order: index
        }))
      }
    }
  })

  revalidatePath('/admin/templates')
}
