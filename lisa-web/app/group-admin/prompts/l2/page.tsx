"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"

const L2PromptPage = () => {
  const { user } = useAuth()

  const documentTypes = [
    {
      id: "hearing-sheet",
      name: "ヒアリングシート用",
      description: "顧客ヒアリングシート生成用のプロンプト",
    },
    {
      id: "proposal",
      name: "提案書用",
      description: "営業提案書生成用のプロンプト",
    },
    {
      id: "quotation",
      name: "見積書用",
      description: "見積書生成用のプロンプト",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "group_admin"}
        userName={user?.name || "Group Admin"}
        userEmail={user?.email || "groupadmin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="L2: プレイブックプロンプト" subtitle="ドキュメント種類ごとのプロンプト管理" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <Link href="/group-admin/projects">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </Button>
              </Link>
            </div>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">ドキュメント種類別プロンプト</h2>
              <div className="space-y-4">
                {documentTypes.map((docType) => (
                  <Link
                    key={docType.id}
                    href={`/group-admin/prompts/l2/${docType.id}`}
                    className="block p-4 border border-gray-200 rounded hover:bg-gray-50 transition"
                  >
                    <h3 className="font-semibold text-gray-900">{docType.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{docType.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default L2PromptPage
