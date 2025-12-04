"use client"

import { SidebarNav } from "./sidebar-nav"
import { LogOut, Building2, ChevronDown } from "lucide-react"
import { useAuth } from "./auth-context"
import { useRouter } from "next/navigation"

interface SidebarProps {
  userRole: "admin" | "group_admin" | "user"
  userName: string
  userEmail: string
  groupName?: string
}

export function Sidebar({ userRole, userName, userEmail, groupName }: SidebarProps) {
  const { logout, clearSelectedGroup } = useAuth()
  const router = useRouter()

  const roleLabel = {
    admin: "システム管理者",
    group_admin: "グループ管理者",
    user: "ユーザー",
  }[userRole]

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleGroupChange = () => {
    clearSelectedGroup()
    router.push("/select-group")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold">L</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">LISA</h1>
            <p className="text-xs text-gray-500">Intelligence Platform</p>
          </div>
        </div>
      </div>

      {groupName && (
        <button
          onClick={handleGroupChange}
          className="px-6 py-3 border-b border-gray-200 bg-blue-50 hover:bg-blue-100 transition-colors w-full text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-semibold">現在のグループ</p>
                <p className="text-sm text-gray-900 font-medium truncate">{groupName}</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0" />
          </div>
        </button>
      )}

      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <p className="text-xs font-semibold text-gray-900 mb-3">システムヘルス</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">API接続状態:</span>
            <span className="text-xs text-green-600 font-semibold">正常</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Google Drive接続:</span>
            <span className="text-xs text-green-600 font-semibold">正常</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <SidebarNav userRole={userRole} />
      </div>

      {/* User Info Section */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
        <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        <p className="text-xs text-yellow-600 mt-2 font-medium">{roleLabel}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>v1.0.0</p>
      </div>
    </aside>
  )
}
