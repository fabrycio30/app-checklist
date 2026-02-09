'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Truck,
  FileText,
  ClipboardCheck,
  Settings,
  LogOut,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/equipments', icon: Truck, label: 'Equipamentos' },
  { href: '/admin/templates', icon: FileText, label: 'Templates' },
  { href: '/admin/inspections', icon: ClipboardCheck, label: 'Inspeções' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center px-6 border-b border-slate-800/50">
            <Logo variant="white" width={120} height={40} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Footer / User / Logout */}
          <div className="border-t border-slate-800/50 p-4">
            <div className="mb-4 px-2">
              <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Conta</p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sair do Sistema
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
