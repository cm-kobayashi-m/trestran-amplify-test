"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const GroupManagement = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "admin"}
        userName={user?.name || "Admin User"}
        userEmail={user?.email || "admin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="グループ管理" subtitle="組織内のグループを作成・管理" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <Link href="/admin/settings">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </Button>
              </Link>
            </div>

            <Link href="/admin/settings/groups/new">
              <Button variant="default">新しいグループを作成</Button>
            </Link>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">既存グループ</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">営業部</p>
                    <p className="text-sm text-gray-600">管理者: 田中太郎、佐藤花子</p>
                  </div>
                  <Link
                    href="/admin/settings/groups/1/edit"
                    className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    編集
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">エンジニアチーム</p>
                    <p className="text-sm text-gray-600">管理者: 鈴木一郎</p>
                  </div>
                  <Link
                    href="/admin/settings/groups/2/edit"
                    className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    編集
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GroupManagement
