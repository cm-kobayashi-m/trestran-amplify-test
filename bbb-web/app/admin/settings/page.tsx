"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const AdminSettings = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "admin"}
        userName={user?.name || "Admin User"}
        userEmail={user?.email || "admin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header
          title="システム管理者"
          subtitle="Google OAuth設定、共有ドライブへの権限付与、グループ作成、L0プロンプト管理"
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Google OAuth設定</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">コネクターユーザー認証</p>
                    <p className="text-sm text-gray-600">OAuth認証の設定と実行</p>
                  </div>
                  <Link
                    href="/admin/settings/google-oauth"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    設定
                  </Link>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">グループ作成</h2>
              <div className="space-y-4">
                <Link href="/admin/settings/groups">
                  <Button variant="default" className="w-full">
                    グループ管理
                  </Button>
                </Link>
              </div>
            </section>

            {/* L0: コーポレートDNAプロンプト section */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">L0: コーポレートDNAプロンプト</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded border-l-4 border-blue-600">
                  <p className="font-semibold text-gray-900">現在のプロンプト</p>
                  <p className="text-sm text-gray-600 mt-2">組織のコーポレートDNAを定義するプロンプトです</p>
                </div>
                <Link
                  href="/admin/settings/l0-prompt"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  編集
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminSettings
