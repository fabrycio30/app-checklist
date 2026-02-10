'use client'

import { useState } from 'react'
import { createEquipment } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export function EquipmentDialog() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      await createEquipment(formData)
      setOpen(false)
      toast.success('Equipamento criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar equipamento.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Novo Equipamento
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle>Adicionar Equipamento</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
