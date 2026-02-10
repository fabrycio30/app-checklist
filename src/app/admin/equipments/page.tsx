import prisma from '@/lib/prisma'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EquipmentDialog } from '@/components/admin/equipment-dialog'

export default async function EquipmentsPage() {
  const equipments = await prisma.equipment.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Gerenciar Equipamentos</h1>
        <EquipmentDialog />
      </div>

      <div className="border rounded-md shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum equipamento cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              equipments.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.plate}</TableCell>
                  <TableCell>{eq.model}</TableCell>
                  <TableCell>{eq.brand}</TableCell>
                  <TableCell>{new Date(eq.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
