import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import PomodoroBar from '@/components/PomodoroBar'
import { Button } from '@/components/ui/button'
import { Settings, LogOut } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const handlePomodoroComplete = async (focusMinutes: number, breakMinutes: number) => {
    if (!user) return
    
    try {
      await supabase.from('pomodoro_sessions').insert({
        user_id: user.id,
        focus_minutes: focusMinutes,
        break_minutes: breakMinutes,
        completed_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error saving pomodoro session:', error)
    }
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path.includes('/documents')) return 'Documents'
    if (path.includes('/tasks')) return 'Tasks'
    if (path.includes('/review')) return 'Review'
    if (path.includes('/calendar')) return 'Calendar'
    return 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-background">
      <PomodoroBar onSessionComplete={handlePomodoroComplete} />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="border-b border-border bg-card px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold text-foreground">
                    {getPageTitle()}
                  </h1>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.email?.split('@')[0]}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
              {children || <Outlet />}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}