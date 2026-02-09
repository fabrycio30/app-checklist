import { useEffect, useState } from 'react'
import { db, type LocalInspection } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true) // Assumindo true inicialmente, useEffect corrige
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => {
      setIsOnline(true)
      sync()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Tenta sincronizar ao carregar se estiver online
    if (navigator.onLine) {
      sync()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const sync = async () => {
    if (isSyncing) return
    setIsSyncing(true)
    
    try {
      // 1. PULL: Baixar Templates e Equipamentos
      const pullRes = await fetch('/api/sync/pull')
      if (pullRes.ok) {
        const { templates, equipments } = await pullRes.json()
        await db.templates.bulkPut(templates)
        await db.equipments.bulkPut(equipments)
        console.log('Dados baixados com sucesso')
      }

      // 2. PUSH: Enviar Inspeções Pendentes
      const pendingInspections = await db.inspections
        .where('synced')
        .equals(0)
        .toArray()

      if (pendingInspections.length > 0) {
        toast.info(`Sincronizando ${pendingInspections.length} inspeções...`)
        
        const supabase = createClient()
        
        // Processar cada inspeção (upload de fotos)
        const inspectionsToSend = await Promise.all(pendingInspections.map(async (inspection) => {
          const processedAnswers = { ...inspection.answers }
          
          // Iterar sobre as respostas para encontrar fotos (blobs) e fazer upload
          for (const key in processedAnswers) {
            const answer = processedAnswers[key]
            if (answer.photos && Array.isArray(answer.photos)) {
              const photoUrls = []
              for (const photo of answer.photos) {
                if (photo instanceof Blob || (typeof photo === 'string' && photo.startsWith('blob:'))) {
                  // Se for Blob ou URL de Blob, precisa de upload
                  // Nota: Se salvou URL de blob no Dexie, precisa recuperar o blob. 
                  // O Dexie suporta armazenar Blobs diretamente.
                  // Vou assumir que armazenamos Blobs ou Base64.
                  
                  // Simulação de upload (implementar lógica real de Storage aqui)
                  // const { data, error } = await supabase.storage.from('inspections').upload(...)
                  // photoUrls.push(data.path)
                  
                  // Para simplificar neste exemplo, vamos assumir que o upload é feito aqui
                  // e substituímos pelo URL público.
                  // Se falhar upload, lançar erro para não marcar como synced.
                  
                  // IMPLEMENTAÇÃO REAL DO UPLOAD:
                  const fileName = `${inspection.id}/${key}/${Date.now()}.jpg`
                  let fileToUpload = photo
                  
                  if (typeof photo === 'string' && photo.startsWith('blob:')) {
                     const blob = await fetch(photo).then(r => r.blob())
                     fileToUpload = blob
                  }

                  const { data, error } = await supabase.storage
                    .from('inspection-photos')
                    .upload(fileName, fileToUpload)

                  if (error) throw error
                  
                  const { data: { publicUrl } } = supabase.storage
                    .from('inspection-photos')
                    .getPublicUrl(fileName)
                    
                  photoUrls.push(publicUrl)
                } else {
                  // Já é URL
                  photoUrls.push(photo)
                }
              }
              processedAnswers[key].photos = photoUrls
            }
          }

          return {
            ...inspection,
            answers: processedAnswers
          }
        }))

        // Enviar para API
        const pushRes = await fetch('/api/sync/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inspections: inspectionsToSend })
        })

        if (pushRes.ok) {
          const { results } = await pushRes.json()
          
          // Marcar como sincronizado no Dexie
          for (const result of results) {
            if (result.status === 'success' || result.status === 'already_exists') {
              await db.inspections.update(result.id, { synced: 1 })
            }
          }
          toast.success('Sincronização concluída!')
        } else {
          toast.error('Erro ao enviar inspeções.')
        }
      }
    } catch (error: any) {
      console.error('Erro na sincronização:', error)
      if (error.message && error.message.includes('Bucket not found')) {
        toast.error('Erro: Bucket de fotos não encontrado no Supabase. Contate o admin.')
      } else {
        toast.error('Erro na sincronização.')
      }
    } finally {
      setIsSyncing(false)
    }
  }

  return { isOnline, isSyncing, sync }
}
