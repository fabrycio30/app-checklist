import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, Truck, FileCheck, AlertTriangle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const equipmentsCount = await prisma.equipment.count()
  const templatesCount = await prisma.checklistTemplate.count()
  const inspectionsCount = await prisma.inspection.count()
  
  const today = new Date()
  today.setHours(0,0,0,0)
  const inspectionsToday = await prisma.inspection.count({
    where: { createdAt: { gte: today } }
  })

  const stats = [
    {
      title: 'Total Inspeções',
      value: inspectionsCount,
      subtext: `${inspectionsToday} realizadas hoje`,
      icon: ClipboardList,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      link: '/admin/inspections'
    },
    {
      title: 'Equipamentos Ativos',
      value: equipmentsCount,
      subtext: 'Frota cadastrada',
      icon: Truck,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      link: '/admin/equipments'
    },
    {
      title: 'Templates',
      value: templatesCount,
      subtext: 'Modelos de checklist',
      icon: FileCheck,
      color: 'text-green-600',
      bg: 'bg-green-100',
      link: '/admin/templates'
    },
    {
      title: 'Não Conformidades',
      value: 0,
      subtext: 'Requer atenção imediata',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      link: '/admin/inspections?status=NC'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                </div>
                <Link href={stat.link} className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Ver todos <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Inspeções Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed bg-slate-50">
              <p className="text-sm text-muted-foreground">Nenhuma inspeção recente encontrada</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Manutenções Programadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed bg-slate-50">
              <p className="text-sm text-muted-foreground">Nenhuma manutenção programada</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
