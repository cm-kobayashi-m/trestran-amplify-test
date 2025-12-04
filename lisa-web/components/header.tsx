"use client"

import { Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { selectedGroup } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        {selectedGroup && (
          <p className="text-xs text-blue-600 mt-2">
            {selectedGroup.name} - {selectedGroup.role === "group_admin" ? "グループ管理者" : "一般ユーザー"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
