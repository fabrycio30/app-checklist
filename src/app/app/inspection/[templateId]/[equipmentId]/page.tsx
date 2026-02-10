'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db, type LocalInspection } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { QuestionCard, type AnswerValue } from '@/components/inspection/question-card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

export default function InspectionPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.templateId as string
  const equipmentId = params.equipmentId as string
  
  const [inspectionId, setInspectionId] = useState<string>('')
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})

  const template = useLiveQuery(() => db.templates.get(templateId), [templateId])
  const equipment = useLiveQuery(() => db.equipments.get(equipmentId), [equipmentId])

  // Inicializar ou carregar rascunho
  useEffect(() => {
    const loadDraft = async () => {
      // Verifica se já existe um rascunho para este equipamento e template
      // Simplificação: cria um novo sempre, mas idealmente buscaria 'draft' existente
      const existing = await db.inspections
        .where({ equipmentId, templateId, status: 'draft' })
        .first()

      if (existing) {
        setInspectionId(existing.id)
        setAnswers(existing.answers)
      } else {
        const newId = uuidv4()
        setInspectionId(newId)
        await db.inspections.add({
          id: newId,
          equipmentId,
          templateId,
          answers: {},
          status: 'draft',
          createdAt: new Date().toISOString(),
          synced: 0
        })
      }
    }
    loadDraft()
  }, [equipmentId, templateId])

  const handleAnswerChange = async (questionId: string, val: AnswerValue) => {
    const newAnswers = { ...answers, [questionId]: val }
    setAnswers(newAnswers)
    
    if (inspectionId) {
      await db.inspections.update(inspectionId, { answers: newAnswers })
    }
  }

  const validate = () => {
    if (!template) return false
    
    for (const q of template.questions) {
      const ans = answers[q.id]
      
      // Validação básica: tem resposta?
      // Se for PHOTO, a validação de 'value' não se aplica, checa fotos
      if (q.type === 'PHOTO') {
        if (!ans || !ans.photos || ans.photos.length === 0) {
          toast.error(`A pergunta "${q.text}" requer foto obrigatória.`)
          return false
        }
      } else {
        if (!ans || !ans.value) {
          toast.error(`A pergunta "${q.text}" é obrigatória.`)
          return false
        }
      }

      // Validação NC
      if (ans.value === 'NC') {
        if (!ans.comment) {
          toast.error(`Comentário obrigatório para "${q.text}".`)
          return false
        }
        if (!ans.photos || ans.photos.length === 0) {
          toast.error(`Foto obrigatória para "${q.text}".`)
          return false
        }
      }
    }
    return true
  }

  const handleFinish = async () => {
    console.log('Tentando finalizar inspeção...', { answers, template })
    
    if (!validate()) {
      console.log('Validação falhou')
      return
    }

    if (confirm('Deseja finalizar a inspeção?')) {
      try {
        await db.inspections.update(inspectionId, { status: 'completed' })
        toast.success('Inspeção concluída! Sincronização iniciará se houver conexão.')
        router.push('/app')
      } catch (error) {
        console.error('Erro ao salvar inspeção:', error)
        toast.error('Erro ao salvar inspeção localmente.')
      }
    }
  }

  if (!template || !equipment) return <div className="p-4">Carregando... (Se demorar, faça um Sync na Home)</div>

  return (
    <div className="pb-20">
      <div className="bg-white p-4 mb-4 shadow-sm sticky top-16 z-10">
        <h2 className="font-bold text-lg">{equipment.plate} - {equipment.model}</h2>
        <p className="text-sm text-gray-500">{template.name}</p>
      </div>

      <div className="space-y-4">
        {template.questions?.map((q: any) => (
          <QuestionCard 
            key={q.id} 
            question={q} 
            answer={answers[q.id]}
            onChange={(val) => handleAnswerChange(q.id, val)}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-20">
        <Button 
          size="lg" 
          className="w-full h-12 text-lg font-medium shadow-md bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={(e) => {
            console.log('Botão clicado!')
            handleFinish()
          }}
        >
          Finalizar Inspeção
        </Button>
      </div>
    </div>
  )
}
