'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play } from 'lucide-react'

export default function AppHome() {
  const router = useRouter()
  const [plateQuery, setPlateQuery] = useState('')
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  const equipments = useLiveQuery(
    () => db.equipments
      .where('plate')
      .startsWithIgnoreCase(plateQuery)
      .limit(10)
      .toArray(),
    [plateQuery]
  )

  const templates = useLiveQuery(() => db.templates.toArray())

  const handleStart = () => {
    if (selectedEquipmentId && selectedTemplateId) {
      router.push(`/app/inspection/${selectedTemplateId}/${selectedEquipmentId}`)
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card className="border-none shadow-md bg-white dark:bg-slate-950">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Nova Inspeção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 relative">
            <Label className="text-slate-600 dark:text-slate-400">Buscar Veículo (Placa)</Label>
            <Input 
              placeholder="Digite a placa..." 
              value={plateQuery}
              onChange={(e) => {
                setPlateQuery(e.target.value)
                if (e.target.value === '') setSelectedEquipmentId('')
              }}
              className="h-12 text-lg uppercase bg-white dark:bg-slate-900"
            />
            {plateQuery && equipments && equipments.length > 0 && !selectedEquipmentId && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 border rounded-md bg-white dark:bg-slate-900 shadow-lg max-h-60 overflow-y-auto">
                {equipments.map(eq => (
                  <div 
                    key={eq.id}
                    className="p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 border-b last:border-b-0 transition-colors"
                    onClick={() => {
                      setSelectedEquipmentId(eq.id)
                      setPlateQuery(eq.plate)
                    }}
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-100">{eq.plate}</div>
                    <div className="text-xs text-slate-500">{eq.model} - {eq.brand}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Tipo de Inspeção</Label>
            <Select onValueChange={setSelectedTemplateId} value={selectedTemplateId}>
              <SelectTrigger className="h-12 bg-white dark:bg-slate-900">
                <SelectValue placeholder="Selecione um checklist" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none mt-4" 
            disabled={!selectedEquipmentId || !selectedTemplateId}
            onClick={handleStart}
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            Iniciar Inspeção
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4 px-1">Histórico Recente</h2>
        <LocalInspectionsList />
      </div>
    </div>
  )
}

function LocalInspectionsList() {
  const inspections = useLiveQuery(() => 
    db.inspections.orderBy('createdAt').reverse().limit(5).toArray()
  )

  if (!inspections?.length) return (
    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
      <p className="text-sm text-slate-500">Nenhuma inspeção recente neste dispositivo.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {inspections.map(insp => (
        <Card key={insp.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-950">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {new Date(insp.createdAt).toLocaleDateString()}
                <span className="text-xs text-slate-400 ml-2">
                  {new Date(insp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-xs font-medium mt-1">
                {insp.status === 'completed' ? (
                  <span className="text-green-600">Concluído</span>
                ) : (
                  <span className="text-amber-600">Rascunho</span>
                )}
              </div>
            </div>
            <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              insp.synced 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {insp.synced ? 'Sincronizado' : 'Pendente'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
