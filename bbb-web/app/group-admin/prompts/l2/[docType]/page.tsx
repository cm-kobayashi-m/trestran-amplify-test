"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const L2DocumentPromptPage = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const params = useParams()
  const docType = params.docType as string

  const documentTypeInfo: Record<string, { name: string; description: string; defaultPrompt: string }> = {
    "hearing-sheet": {
      name: "ヒアリングシート用",
      description: "顧客ヒアリングシート生成用のプロンプト",
      defaultPrompt:
        "以下の情報を基に、顧客ヒアリングシートを作成してください：\n\n- 顧客の課題\n- 現状の業務フロー\n- 期待する改善点\n- 予算と期間\n\n質問は具体的かつ掘り下げた内容にしてください。",
    },
    proposal: {
      name: "提案書用",
      description: "営業提案書生成用のプロンプト",
      defaultPrompt:
        "以下の情報を基に、営業提案書を作成してください：\n\n- エグゼクティブサマリー\n- 課題分析\n- 提案内容\n- 実施スケジュール\n- 見積もり\n\n説得力のある提案書を作成してください。",
    },
    quotation: {
      name: "見積書用",
      description: "見積書生成用のプロンプト",
      defaultPrompt:
        "以下の情報を基に、見積書を作成してください：\n\n- 項目名と単価\n- 数量\n- 小計と合計\n- 支払条件\n- 有効期限\n\n明確で理解しやすい見積書を作成してください。",
    },
  }

  const docInfo = documentTypeInfo[docType] || {
    name: "不明なドキュメント",
    description: "",
    defaultPrompt: "",
  }

  const [promptContent, setPromptContent] = useState(docInfo.defaultPrompt)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleSave = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = () => {
    try {
      console.log(`Saving L2 prompt for ${docType}:`, promptContent)
      // TODO: API call to save prompt

      toast({
        title: "成功",
        description: `${docInfo.name}のプロンプトを保存しました`,
      })

      setTimeout(() => {
        setShowConfirmDialog(false)
      }, 100)
    } catch (error) {
      toast({
        title: "エラー",
        description: "プロンプトの保存に失敗しました",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "group_admin"}
        userName={user?.name || "Group Admin"}
        userEmail={user?.email || "groupadmin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title={`L2: ${docInfo.name}`} subtitle={docInfo.description} />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-6">
              <Link href="/group-admin/prompts/l2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  L2プロンプト一覧に戻る
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
            <AlertDialogTitle>{docInfo.name}のプロンプトを保存しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              変更内容を保存すると、このドキュメントタイプに適用されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-200 text-gray-900 hover:bg-gray-300">キャンセル</AlertDialogCancel>
            <Button onClick={handleConfirmSave}>保存</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default L2DocumentPromptPage
