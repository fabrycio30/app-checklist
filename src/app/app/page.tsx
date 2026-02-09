'use client'

import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Buscar Veículo (Placa)</Label>
            <Input 
              placeholder="ABC-1234" 
              value={plateQuery}
              onChange={(e) => setPlateQuery(e.target.value)}
            />
            {plateQuery && equipments && equipments.length > 0 && (
              <div className="border rounded-md mt-2 max-h-40 overflow-y-auto">
                {equipments.map(eq => (
                  <div 
                    key={eq.id}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedEquipmentId === eq.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    onClick={() => {
                      setSelectedEquipmentId(eq.id)
                      setPlateQuery(eq.plate) // Preenche o input
                    }}
                  >
                    <div className="font-bold">{eq.plate}</div>
                    <div className="text-xs text-gray-500">{eq.model} - {eq.brand}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo de Inspeção</Label>
            <Select onValueChange={setSelectedTemplateId} value={selectedTemplateId}>
              <SelectTrigger>
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
            className="w-full h-12 text-lg" 
            disabled={!selectedEquipmentId || !selectedTemplateId}
            onClick={handleStart}
          >
            Iniciar Inspeção
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="font-semibold mb-2">Histórico Recente (Neste Dispositivo)</h2>
        {/* Lista de inspeções locais pendentes ou recentes */}
        <LocalInspectionsList />
      </div>
    </div>
  )
}

function LocalInspectionsList() {
  const inspections = useLiveQuery(() => 
    db.inspections.orderBy('createdAt').reverse().limit(5).toArray()
  )

  if (!inspections?.length) return <p className="text-sm text-gray-500">Nenhuma inspeção recente.</p>

  return (
    <div className="space-y-2">
      {inspections.map(insp => (
        <Card key={insp.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{new Date(insp.createdAt).toLocaleDateString()}</div>
              <div className="text-xs text-gray-500">
                {insp.status === 'completed' ? 'Concluído' : 'Rascunho'}
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${insp.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {insp.synced ? 'Sincronizado' : 'Pendente'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
