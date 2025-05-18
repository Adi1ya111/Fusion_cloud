"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, BarChart3, Settings, AlertCircle, Users, Terminal, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-lg font-bold text-blue-600">Fusion Cloud</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="md:hidden text-blue-600">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <nav className="mt-6 px-4 space-y-1">
        <NavItem icon={Shield} label="Dashboard" href="/dashboard" active={pathname === "/dashboard"} />
        <NavItem icon={AlertCircle} label="Alerts" href="/dashboard/alerts" active={pathname === "/dashboard/alerts"} />
        <NavItem
          icon={BarChart3}
          label="Analytics"
          href="/dashboard/analytics"
          active={pathname === "/dashboard/analytics"}
        />
        <NavItem icon={Terminal} label="Logs" href="/dashboard/logs" active={pathname === "/dashboard/logs"} />
        <NavItem icon={Users} label="Users" href="/dashboard/users" active={pathname === "/dashboard/users"} />
        <NavItem
          icon={Settings}
          label="Settings"
          href="/dashboard/settings"
          active={pathname === "/dashboard/settings"}
        />
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="rounded-lg bg-gray-100 p-4">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="ml-2 text-sm text-gray-700">System Status: Online</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">Last scan: {new Date().toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
}

function NavItem({ icon: Icon, label, href, active }: NavItemProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50",
          active && "bg-blue-50 text-blue-600 font-medium",
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </Link>
  )
}
