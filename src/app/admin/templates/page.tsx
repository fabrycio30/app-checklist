import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function TemplatesPage() {
  const templates = await prisma.checklistTemplate.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { questions: true } } }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Templates de Checklist</h1>
        <Link href="/admin/templates/new">
          <Button>Novo Template</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Perguntas</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t._count.questions}</TableCell>
                <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
