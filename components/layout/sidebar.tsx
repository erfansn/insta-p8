"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, LifeBuoy, LogOut, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountSwitcher } from "@/components/dashboard/AccountSwitcher"

const NAV = [
  { href: "/dashboard", label: "Home", icon: "/icons/home.svg" },
  { href: "/dashboard/automations", label: "Auto replies", icon: "/icons/journal.svg" },
  { href: "/dashboard/inbox", label: "Conversations", icon: "/icons/chat.svg" },
  { href: "/dashboard/ice-breakers", label: "Conversation starters", icon: "/icons/squads.svg" },
  { href: "/dashboard/analytics", label: "Insights", icon: "/icons/analytics.svg" },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  username?: string
  profilePic?: string | null
  onLogout?: () => void
  onNavigate?: () => void
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, username = "creator", profilePic, onLogout, onNavigate, collapsed = false, onToggle, ...props }: SidebarProps) {
  const pathname = usePathname()

  const itemClass = (active: boolean) => cn(
    "relative flex h-10 items-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    collapsed ? "justify-center px-0" : "gap-3 px-3",
    active ? "bg-sidebar-accent text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
  )

  return (
    <aside className={cn("flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground", className)} {...props}>
      <div className={cn("flex h-16 items-center border-b border-sidebar-border", collapsed ? "justify-center" : "px-3")}>
        <Link href="/dashboard" onClick={onNavigate} aria-label="insta-p8 home" className={cn("flex items-center gap-2.5 rounded-lg", !collapsed && "px-2")}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Zap className="size-4" /></span>
          {!collapsed && <span className="text-sm font-semibold tracking-tight">insta-p8</span>}
        </Link>
        {!collapsed && onToggle && <button onClick={onToggle} aria-label="Collapse sidebar" title="Collapse sidebar" className="ml-auto flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"><ChevronLeft className="size-4" /></button>}
      </div>

      {collapsed && onToggle && <div className="px-3 pt-3"><button onClick={onToggle} aria-label="Expand sidebar" title="Expand sidebar" className="flex size-10 w-full items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"><ChevronRight className="size-4" /></button></div>}

      <nav className="flex-1 space-y-1 px-3 py-3" aria-label="Dashboard navigation">
        {NAV.map(item => {
          const active = pathname === item.href
          return <Link key={item.href} href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} aria-label={collapsed ? item.label : undefined} title={collapsed ? item.label : undefined} className={itemClass(active)}>
            <img src={item.icon} alt="" className={cn("size-4 shrink-0 dark:invert", active && item.href === "/dashboard" && "dark:invert-0")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        })}

        <div className="my-3 h-px bg-sidebar-border" />

        <Link href="/dashboard/settings" onClick={onNavigate} aria-current={pathname === "/dashboard/settings" ? "page" : undefined} aria-label={collapsed ? "Preferences" : undefined} title={collapsed ? "Preferences" : undefined} className={itemClass(pathname === "/dashboard/settings")}>
          <img src="/icons/profile.svg" alt="" className="size-4 shrink-0 dark:invert" />
          {!collapsed && <span>Preferences</span>}
        </Link>
        <a href="https://t.me/instagramautomationp8" target="_blank" rel="noopener noreferrer" aria-label={collapsed ? "Help and support" : undefined} title={collapsed ? "Help and support" : undefined} className={itemClass(false)}>
          <LifeBuoy className="size-4 shrink-0" />
          {!collapsed && <span>Help and support</span>}
        </a>
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && <div className="flex items-center justify-between px-1"><span className="text-xs text-muted-foreground">Appearance</span><ThemeToggle className="h-7 w-14" /></div>}
        <AccountSwitcher collapsed={collapsed} showBadge />
      </div>
    </aside>
  )
}
