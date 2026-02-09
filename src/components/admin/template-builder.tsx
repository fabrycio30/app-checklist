'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTemplate } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type QuestionDraft = {
  text: string
  type: 'TEXT' | 'DROPDOWN' | 'OK_NA_NC' | 'PHOTO'
  options: string[] // Para dropdown, separado por vírgula no input
}

export function TemplateBuilder() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<QuestionDraft[]>([])

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'TEXT', options: [] }])
  }

  const removeQuestion = (index: number) => {
    const newQ = [...questions]
    newQ.splice(index, 1)
    setQuestions(newQ)
  }

  const updateQuestion = (index: number, field: keyof QuestionDraft, value: any) => {
    const newQ = [...questions]
    // @ts-ignore
    newQ[index][field] = value
    setQuestions(newQ)
  }

  const handleSubmit = async () => {
    if (!name) return toast.error('Nome do template é obrigatório')
    if (questions.length === 0) return toast.error('Adicione pelo menos uma pergunta')

    try {
      await createTemplate({ name, description, questions })
      toast.success('Template criado com sucesso')
      router.push('/admin/templates')
    } catch (error) {
      toast.error('Erro ao criar template')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/templates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Template</h1>
          <p className="text-sm text-muted-foreground">Configure as perguntas do checklist</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do Template</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Inspeção Diária Caminhão" />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição opcional" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <Card key={index} className="border-none shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <CardContent className="pt-6 space-y-4 pl-6">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-slate-800">Pergunta {index + 1}</h3>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Texto da Pergunta</Label>
                  <Input 
                    value={q.text} 
                    onChange={e => updateQuestion(index, 'text', e.target.value)} 
                    placeholder="Ex: Verificar óleo do motor"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Resposta</Label>
                  <Select 
                    value={q.type} 
                    onValueChange={val => updateQuestion(index, 'type', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Texto Livre</SelectItem>
                      <SelectItem value="OK_NA_NC">Conformidade (OK / N/A / N/C)</SelectItem>
                      <SelectItem value="PHOTO">Foto Obrigatória</SelectItem>
                      <SelectItem value="DROPDOWN">Seleção (Dropdown)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {q.type === 'DROPDOWN' && (
                <div className="space-y-2">
                  <Label>Opções (separadas por vírgula)</Label>
                  <Input 
                    placeholder="Opção 1, Opção 2, Opção 3"
                    value={q.options.join(', ')}
                    onChange={e => updateQuestion(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button variant="outline" onClick={addQuestion} className="w-full sm:w-auto border-dashed border-2 h-12">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Pergunta
        </Button>
        <div className="flex-1"></div>
        <Button onClick={handleSubmit} className="w-full sm:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
          <Save className="mr-2 h-4 w-4" /> Salvar Template
        </Button>
      </div>
    </div>
  )
}
