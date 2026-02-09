import prisma from '@/lib/prisma'
import { createEquipment } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default async function EquipmentsPage() {
  const equipments = await prisma.equipment.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Equipamentos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Novo Equipamento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Equipamento</DialogTitle>
            </DialogHeader>
            <form action={createEquipment} className="space-y-4">
              <div className="space-y-2">
                <Label>Placa</Label>
                <Input name="plate" required placeholder="ABC-1234" />
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input name="model" required placeholder="Caminhão Toco" />
              </div>
              <div className="space-y-2">
                <Label>Marca</Label>
                <Input name="brand" required placeholder="Mercedes" />
              </div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
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
            {equipments.map((eq) => (
              <TableRow key={eq.id}>
                <TableCell className="font-medium">{eq.plate}</TableCell>
                <TableCell>{eq.model}</TableCell>
                <TableCell>{eq.brand}</TableCell>
                <TableCell>{new Date(eq.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
