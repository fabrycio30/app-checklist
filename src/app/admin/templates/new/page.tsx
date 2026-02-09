import { TemplateBuilder } from '@/components/admin/template-builder'

export default function NewTemplatePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novo Template de Checklist</h1>
      <TemplateBuilder />
    </div>
  )
}
