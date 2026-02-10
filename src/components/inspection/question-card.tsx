'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Check, X, Minus } from 'lucide-react'

export type AnswerValue = {
  value: string // 'OK' | 'NA' | 'NC' | text value
  comment?: string
  photos?: (Blob | string)[]
}

interface QuestionCardProps {
  question: any
  answer?: AnswerValue
  onChange: (val: AnswerValue) => void
}

export function QuestionCard({ question, answer, onChange }: QuestionCardProps) {
  const [localAnswer, setLocalAnswer] = useState<AnswerValue>(answer || { value: '' })

  useEffect(() => {
    if (answer) setLocalAnswer(answer)
  }, [answer])

  const handleChange = (updates: Partial<AnswerValue>) => {
    const newVal = { ...localAnswer, ...updates }
    setLocalAnswer(newVal)
    onChange(newVal)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files)
      // Adiciona aos existentes
      const currentPhotos = localAnswer.photos || []
      handleChange({ photos: [...currentPhotos, ...newPhotos] })
    }
  }

  const renderInput = () => {
    switch (question.type) {
      case 'TEXT':
        return (
          <Input 
            value={localAnswer.value} 
            onChange={(e) => handleChange({ value: e.target.value })}
            placeholder="Sua resposta..."
          />
        )
      case 'DROPDOWN':
        return (
          <select 
            className="w-full p-2 border rounded"
            value={localAnswer.value}
            onChange={(e) => handleChange({ value: e.target.value })}
          >
            <option value="">Selecione...</option>
            {question.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )
      case 'OK_NA_NC':
        return (
          <div className="flex gap-2">
            <Button 
              type="button"
              variant={localAnswer.value === 'OK' ? 'default' : 'outline'}
              className={localAnswer.value === 'OK' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => handleChange({ value: 'OK' })}
            >
              <Check className="mr-1 h-4 w-4" /> OK
            </Button>
            <Button 
              type="button"
              variant={localAnswer.value === 'NA' ? 'default' : 'outline'}
              className={localAnswer.value === 'NA' ? 'bg-gray-600 hover:bg-gray-700' : ''}
              onClick={() => handleChange({ value: 'NA' })}
            >
              <Minus className="mr-1 h-4 w-4" /> N/A
            </Button>
            <Button 
              type="button"
              variant={localAnswer.value === 'NC' ? 'destructive' : 'outline'}
              onClick={() => handleChange({ value: 'NC' })}
            >
              <X className="mr-1 h-4 w-4" /> N/C
            </Button>
          </div>
        )
      case 'PHOTO':
        const hasPhotos = localAnswer.photos && localAnswer.photos.length > 0
        return (
          <div>
            <Label className="block mb-2">Foto Obrigatória</Label>
            
            {hasPhotos && (
              <div className="flex flex-wrap gap-2 mb-3">
                {localAnswer.photos?.map((p, i) => (
                  <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                    {/* Se p for string (url) exibe, se for Blob cria url temporaria */}
                    {typeof p === 'string' ? (
                        <img src={p} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                    ) : (
                        <img src={URL.createObjectURL(p)} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button variant="outline" className="w-full h-12 border-dashed border-2" onClick={() => document.getElementById(`file-${question.id}`)?.click()}>
              <Camera className="mr-2 h-4 w-4" /> 
              {hasPhotos ? 'Adicionar Mais Fotos' : 'Tirar Foto'}
            </Button>
            <Input 
              id={`file-${question.id}`}
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden"
              onChange={handleFileChange} 
            />
            {!hasPhotos && (
               <p className="text-xs text-muted-foreground mt-1">Nenhuma foto selecionada.</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const isNC = localAnswer.value === 'NC'

  return (
    <Card className={`mb-4 bg-white dark:bg-slate-950 shadow-sm ${isNC ? 'border-red-500 border-2' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderInput()}

        {/* Lógica NC: Texto e Foto Obrigatórios */}
        {isNC && (
          <div className="space-y-4 pt-4 border-t">
            <div className="bg-red-50 p-3 rounded text-sm text-red-800 font-medium">
              Não Conformidade detectada. Por favor, descreva o problema e anexe fotos.
            </div>
            
            <div className="space-y-2">
              <Label>Descrição do Problema (Obrigatório)</Label>
              <Textarea 
                value={localAnswer.comment || ''}
                onChange={(e) => handleChange({ comment: e.target.value })}
                placeholder="Descreva o que está errado..."
                className={!localAnswer.comment ? 'border-red-300' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label>Fotos (Obrigatório)</Label>
              {localAnswer.photos && localAnswer.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {localAnswer.photos.map((p, i) => (
                    <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                      {typeof p === 'string' ? (
                          <img src={p} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                      ) : (
                          <img src={URL.createObjectURL(p)} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full h-12 border-dashed border-2" onClick={() => document.getElementById(`file-nc-${question.id}`)?.click()}>
                <Camera className="mr-2 h-4 w-4" /> 
                {localAnswer.photos && localAnswer.photos.length > 0 ? 'Adicionar Mais Fotos' : 'Adicionar Foto'}
              </Button>
              <Input 
                id={`file-nc-${question.id}`}
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden"
                onChange={handleFileChange} 
              />
              {(!localAnswer.photos || localAnswer.photos.length === 0) && (
                <p className="text-xs text-red-500">Pelo menos uma foto é necessária.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
