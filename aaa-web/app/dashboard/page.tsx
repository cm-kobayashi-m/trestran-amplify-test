"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

type ProjectStatus = "ACTIVE" | "CLOSED" | "ARCHIVED"

const DashboardPage = () => {
  const { user, selectedGroup } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>("ACTIVE")

  const projects = [
    {
      id: "proj-001",
      name: "Acme Corp 営業提案書",
      createdBy: "田中太郎",
      createdDate: "2025-11-20",
      status: "ACTIVE" as ProjectStatus,
      tags: ["DWH", "ETL", "Redshift"],
    },
    {
      id: "proj-002",
      name: "TechStart エンジニアリング提案",
      createdBy: "鈴木花子",
      createdDate: "2025-11-18",
      status: "ACTIVE" as ProjectStatus,
      tags: ["ELT", "BigQuery"],
    },
    {
      id: "proj-003",
      name: "Global Solutions 事業計画書",
      createdBy: "佐藤次郎",
      createdDate: "2025-11-15",
      status: "CLOSED" as ProjectStatus,
      tags: ["分析", "レポート"],
    },
  ]

  const filteredProjects = projects.filter(
    (project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()) && project.status === statusFilter,
  )

  const getStatusBadgeColor = (status: ProjectStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700"
      case "CLOSED":
        return "bg-gray-100 text-gray-700"
      case "ARCHIVED":
        return "bg-blue-100 text-blue-700"
    }
  }

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case "ACTIVE":
        return "進行中"
      case "CLOSED":
        return "完了"
      case "ARCHIVED":
        return "アーカイブ"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={selectedGroup?.role || "user"}
        userName={user?.name || "User"}
        userEmail={user?.email || "user@company.com"}
        groupName={selectedGroup?.name}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="案件一覧" subtitle="案件検索・情報閲覧、ドキュメント生成" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">検索条件</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">ステータス</label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setStatusFilter("ACTIVE")}
                      variant={statusFilter === "ACTIVE" ? "default" : "outline"}
                      className={statusFilter === "ACTIVE" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      進行中
                    </Button>
                    <Button
                      onClick={() => setStatusFilter("CLOSED")}
                      variant={statusFilter === "CLOSED" ? "default" : "outline"}
                      className={statusFilter === "CLOSED" ? "bg-gray-600 hover:bg-gray-700" : ""}
                    >
                      完了
                    </Button>
                    <Button
                      onClick={() => setStatusFilter("ARCHIVED")}
                      variant={statusFilter === "ARCHIVED" ? "default" : "outline"}
                      className={statusFilter === "ARCHIVED" ? "bg-blue-600 hover:bg-blue-700" : ""}
                    >
                      アーカイブ
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="案件名で検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">案件一覧</h2>
              {filteredProjects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">検索条件に一致する案件が見つかりませんでした</p>
              ) : (
                <div className="space-y-2">
                  {filteredProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="p-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              <span className={`px-2 py-0.5 rounded text-xs ${getStatusBadgeColor(project.status)}`}>
                                {getStatusLabel(project.status)}
                              </span>
                            </div>
                            {project.tags.length > 0 && (
                              <div className="flex gap-2 flex-wrap mb-2">
                                {project.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>作成者: {project.createdBy}</span>
                              <span>作成日: {project.createdDate}</span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">表示</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
