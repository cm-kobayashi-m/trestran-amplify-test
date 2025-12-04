"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const GoogleOAuthSettings = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "admin"}
        userName={user?.name || "Admin User"}
        userEmail={user?.email || "admin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="Google OAuth設定" subtitle="コネクターユーザーの認証設定" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="mb-6">
              <Link href="/admin/settings">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </Button>
              </Link>
            </div>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">コネクターユーザー認証</h2>
              <p className="text-gray-600 mb-6">
                OAuth認証を実行して、LISAがGoogle Driveにアクセスするための権限を取得します。
              </p>

              <div className="bg-gray-50 p-4 rounded mb-6">
                <p className="text-sm text-gray-600 mb-2">認証状態:</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-900 font-semibold">認証済み</span>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">
                OAuth認証を実行
              </button>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">接続情報</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">SAメールアドレス:</p>
                  <p className="text-gray-900 font-semibold">lisa-sa@company.iam.gserviceaccount.com</p>
                </div>
                <div>
                  <p className="text-gray-600">最終認証:</p>
                  <p className="text-gray-900">2025年11月27日 12:00</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GoogleOAuthSettings
