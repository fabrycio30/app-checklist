'use client'

import { useOfflineSync } from '@/hooks/use-offline-sync'
import { Wifi, WifiOff, RefreshCw, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOnline, isSyncing, sync } = useOfflineSync()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center container mx-auto max-w-md">
          <Logo width={100} height={35} />
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium">
              {isSyncing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  <span className="text-blue-500">Sync...</span>
                </>
              ) : isOnline ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-red-600">Offline</span>
                </>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => sync()}
              disabled={isSyncing || !isOnline}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </Button>

            <form action="/auth/signout" method="post">
               <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                 <LogOut className="h-4 w-4" />
               </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="p-4 container mx-auto max-w-md">
        {children}
      </main>
    </div>
  )
}
