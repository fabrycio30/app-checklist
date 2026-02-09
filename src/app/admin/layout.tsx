import { requireAdmin } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out w-full">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
