"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const L0PromptSettings = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [promptContent, setPromptContent] = useState(
    "当社のコーポレートDNAを以下の通り定義します：\n\n- 顧客第一主義\n- イノベーションの追求\n- チームワークと相互尊重\n- 継続的な学習と成長",
  )
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleSave = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = () => {
    try {
      console.log("Saving L0 prompt:", promptContent)
      // TODO: API call to save prompt

      toast({
        title: "成功",
        description: "L0プロンプトを保存しました",
      })

      setTimeout(() => {
        setShowConfirmDialog(false)
      }, 100)
    } catch (error) {
      toast({
        title: "エラー",
        description: "L0プロンプトの保存に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "admin"}
        userName={user?.name || "Admin User"}
        userEmail={user?.email || "admin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="L0: コーポレートDNAプロンプト" subtitle="組織のコーポレートDNAを定義" />

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

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">現在のプロンプト</h2>
              <textarea
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                rows={10}
                className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <div className="mt-4">
                <Button onClick={handleSave}>保存</Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>L0プロンプトを保存しますか？</AlertDialogTitle>
            <AlertDialogDescription>変更内容を保存すると、すべてのグループに適用されます。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmSave}>保存</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default L0PromptSettings
