'use client'

import { Bell, Search, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'

export function AdminHeader() {
  const pathname = usePathname()
  
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Painel de Controle'
    if (pathname.includes('/equipments')) return 'Gestão de Equipamentos'
    if (pathname.includes('/templates')) return 'Templates de Checklist'
    if (pathname.includes('/inspections')) return 'Inspeções Realizadas'
    return 'Admin'
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center gap-4 border-b bg-white px-6 shadow-sm dark:bg-slate-950 dark:border-slate-800">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden md:block whitespace-nowrap">
          {getPageTitle()}
        </h1>
        
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full bg-slate-50 pl-9 md:w-[300px] lg:w-[400px] dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 dark:text-slate-400">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        
        <div className="flex items-center gap-3 border-l pl-4 dark:border-slate-800">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
