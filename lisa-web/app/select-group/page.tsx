"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Building2, ChevronRight } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function SelectGroupPage() {
  const { user, selectedGroup, selectGroup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    if (user.isSystemAdmin) {
      router.push("/admin/settings")
      return
    }

    if (selectedGroup) {
      if (selectedGroup.role === "group_admin") {
        router.push("/group-admin/projects")
      } else {
        router.push("/dashboard")
      }
    }
  }, [user, selectedGroup, router])

  const handleGroupSelect = (groupId: string) => {
    selectGroup(groupId)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">ログインしてください</p>
      </div>
    )
  }

  if (user.groups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <p className="text-gray-600">所属しているグループがありません</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            ログイン画面に戻る
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">グループを選択</h1>
          <p className="text-gray-600">{user.name}さん、どのグループでLISAを使用しますか？</p>
        </div>

        <div className="space-y-3">
          {user.groups.map((group) => (
            <Card
              key={group.id}
              className="p-6 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-blue-500"
              onClick={() => handleGroupSelect(group.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">
                      {group.role === "group_admin" ? "グループ管理者" : "一般ユーザー"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            グループが見つかりませんか？
            <button className="text-blue-600 hover:underline ml-1">管理者に問い合わせる</button>
          </p>
        </div>
      </div>
    </div>
  )
}
