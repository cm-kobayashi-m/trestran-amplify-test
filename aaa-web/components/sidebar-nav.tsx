"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Briefcase, FileText, Users, Plus } from "lucide-react"

interface SidebarNavProps {
  userRole: "admin" | "group_admin" | "user"
}

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname()

  const navItems = {
    admin: [
      { icon: Users, label: "グループ管理", href: "/admin/settings/groups" },
      { icon: FileText, label: "L0プロンプト管理", href: "/admin/settings/l0-prompt" },
    ],
    group_admin: [
      { icon: Plus, label: "案件を作成", href: "/group-admin/projects/new" },
      { icon: FileText, label: "L1プロンプト管理", href: "/group-admin/prompts/l1" },
      { icon: FileText, label: "L2プロンプト管理", href: "/group-admin/prompts/l2" },
      { icon: Briefcase, label: "案件一覧", href: "/dashboard" },
    ],
    user: [{ icon: Briefcase, label: "案件一覧", href: "/dashboard" }],
  }

  const items = navItems[userRole] || []

  return (
    <nav className="flex flex-col gap-2 py-4">
      {items.map((item, index) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

        return (
          <Link key={index} href={item.href} className={cn("sidebar-nav-item", isActive && "active")}>
            <Icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
