"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth-context"

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState<string>("")
  const { login } = useAuth()
  const router = useRouter()

  const mockUsers = [
    { id: "admin", name: "Admin User", email: "admin@company.com", type: "システム管理者" },
    { id: "john", name: "John Doe", email: "john@company.com", type: "グループ管理者/一般ユーザー" },
    { id: "jane", name: "Jane Smith", email: "jane@company.com", type: "一般ユーザー" },
  ]

  const handleLogin = async (userId: string) => {
    await login(userId, "")

    if (userId === "admin") {
      router.push("/admin/settings")
    } else {
      router.push("/select-group")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LISA</h1>
          <p className="text-gray-600">組織の集合的知性プラットフォーム</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ユーザーを選択</label>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className={`w-full justify-start text-left h-auto py-3 ${
                    selectedUser === user.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{user.type}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Button className="w-full" disabled={!selectedUser} onClick={() => handleLogin(selectedUser)}>
            ログイン
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">デモ環境です。実際の認証は実装されていません。</p>
      </Card>
    </div>
  )
}
