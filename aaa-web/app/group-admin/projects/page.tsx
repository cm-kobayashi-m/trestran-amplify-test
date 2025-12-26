"use client"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"

const Page = () => {
  const { user, selectedGroup } = useAuth()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={selectedGroup?.role || "group_admin"}
        userName={user?.name || "Group Admin"}
        userEmail={user?.email || "groupadmin@company.com"}
        groupName={selectedGroup?.name}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="グループ管理者" subtitle="案件管理・プロンプト管理" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">管理機能</h2>
              <div className="grid grid-cols-3 gap-4">
                <Link
                  href="/group-admin/projects/new"
                  className="p-4 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 text-center"
                >
                  案件を作成
                </Link>
                <Link
                  href="/group-admin/prompts/l1"
                  className="p-4 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 text-center"
                >
                  L1プロンプト管理
                </Link>
                <Link
                  href="/group-admin/prompts/l2"
                  className="p-4 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 text-center"
                >
                  L2プロンプト管理
                </Link>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">案件一覧</h2>
              <p className="text-gray-600 mb-4">案件の検索と詳細情報を確認できます</p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
              >
                案件一覧を表示
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Page
