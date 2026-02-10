import prisma from '@/lib/prisma'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'

// Helper para verificar NC
function getNCCount(answers: any): number {
  if (!answers || typeof answers !== 'object') return 0
  return Object.values(answers).filter((a: any) => a.value === 'NC').length
}

export default async function InspectionsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const { status } = await searchParams
  const showOnlyNC = status === 'NC'

  const inspections = await prisma.inspection.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      equipment: true,
      user: true,
      template: {
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  })

  // Filtragem em memória (devido à estrutura JSON)
  const filteredInspections = inspections.filter(inspection => {
    if (showOnlyNC) {
      return getNCCount(inspection.answers) > 0
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {showOnlyNC ? 'Não Conformidades' : 'Inspeções Realizadas'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {showOnlyNC 
              ? 'Listando apenas inspeções com problemas reportados' 
              : 'Histórico completo de inspeções da frota'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/inspections">
            <Button variant={showOnlyNC ? 'outline' : 'default'}>
              Todas
            </Button>
          </Link>
          <Link href="/admin/inspections?status=NC">
            <Button variant={showOnlyNC ? 'destructive' : 'outline'} className={showOnlyNC ? '' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Apenas NCs
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>NCs</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInspections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma inspeção encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInspections.map((inspection) => {
                  const ncCount = getNCCount(inspection.answers)
                  
                  return (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-medium">
                        {new Date(inspection.createdAt).toLocaleDateString()}
                        <span className="block text-xs text-muted-foreground">
                          {new Date(inspection.createdAt).toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{inspection.equipment.plate}</div>
                        <div className="text-xs text-muted-foreground">{inspection.equipment.model}</div>
                      </TableCell>
                      <TableCell>{inspection.user.email.split('@')[0]}</TableCell>
                      <TableCell>{inspection.template.name}</TableCell>
                      <TableCell>
                        {inspection.status === 'COMPLETED' ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Concluído</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {ncCount > 0 ? (
                          <Badge variant="destructive" className="flex w-fit items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {ncCount}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            <CheckCircle className="h-3 w-3 mr-1" /> OK
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <InspectionDetailsDialog inspection={inspection} />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function InspectionDetailsDialog({ inspection }: { inspection: any }) {
  const answers = inspection.answers as Record<string, any>
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4 text-slate-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes da Inspeção</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">Veículo:</span> {inspection.equipment.plate} - {inspection.equipment.model}
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Data:</span> {new Date(inspection.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Responsável:</span> {inspection.user.email}
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Template:</span> {inspection.template.name}
          </div>
        </div>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {inspection.template.questions.map((question: any) => {
              const answer = answers[question.id]
              const isNC = answer?.value === 'NC'
              
              return (
                <div key={question.id} className={`p-4 rounded-lg border ${isNC ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-slate-900">{question.text}</h4>
                    <Badge variant={isNC ? 'destructive' : 'outline'}>
                      {answer?.value || 'Sem resposta'}
                    </Badge>
                  </div>
                  
                  {answer?.comment && (
                    <div className="mt-2 text-sm text-slate-700 bg-white/50 p-2 rounded">
                      <span className="font-semibold">Obs:</span> {answer.comment}
                    </div>
                  )}

                  {answer?.photos && answer.photos.length > 0 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                      {answer.photos.map((photo: string, idx: number) => (
                        <div key={idx} className="relative h-24 w-24 shrink-0 rounded-md overflow-hidden border border-slate-200">
                          <Image 
                            src={photo} 
                            alt={`Foto ${idx + 1}`} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
