import { useState } from "react"
import { BookOpen, Brain, Calendar, LayoutDashboard, Settings, LogOut, CheckSquare, CreditCard, BarChart3, Timer } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Documents", url: "/dashboard/documents", icon: BookOpen },
  { title: "Tasks", url: "/dashboard/tasks", icon: CheckSquare },
  { title: "Flashcards", url: "/dashboard/flashcards", icon: CreditCard },
  { title: "Focus Timer", url: "/dashboard/focus", icon: Timer },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Review", url: "/dashboard/review", icon: Brain },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const { signOut } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard"
    }
    return currentPath.startsWith(path)
  }

  const getNavCls = ({ isActive: active }: { isActive: boolean }) =>
    active ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50"

  const handleSignOut = async () => {
    await signOut()
  }

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-primary p-1 rounded">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-semibold font-heading">Zenith</h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/dashboard"} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}