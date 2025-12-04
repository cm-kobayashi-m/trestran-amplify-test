"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function NewProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [projectName, setProjectName] = useState("")
  const [gdriveFolderIds, setGdriveFolderIds] = useState<string[]>([""])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [errors, setErrors] = useState<{ projectName?: string; gdriveFolderIds?: string }>({})

  const handleAddFolder = () => {
    setGdriveFolderIds([...gdriveFolderIds, ""])
  }

  const handleRemoveFolder = (index: number) => {
    if (gdriveFolderIds.length > 1) {
      setGdriveFolderIds(gdriveFolderIds.filter((_, i) => i !== index))
    }
  }

  const handleFolderChange = (index: number, value: string) => {
    const newFolderIds = [...gdriveFolderIds]
    newFolderIds[index] = value
    setGdriveFolderIds(newFolderIds)
    if (errors.gdriveFolderIds) {
      setErrors((prev) => ({ ...prev, gdriveFolderIds: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { projectName?: string; gdriveFolderIds?: string } = {}

    if (!projectName.trim()) {
      newErrors.projectName = "プロジェクト名を入力してください"
    }
    const hasValidFolder = gdriveFolderIds.some((id) => id.trim() !== "")
    if (!hasValidFolder) {
      newErrors.gdriveFolderIds = "少なくとも1つのGoogle DriveフォルダIDを入力してください"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = async () => {
    // TODO: 実際のAPI呼び出しを実装

    // モック保存処理
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "保存しました",
      description: "案件が正常に作成されました",
    })

    setTimeout(() => {
      setShowConfirmDialog(false)
      router.push("/group-admin/projects")
    }, 100)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "group_admin"}
        userName={user?.name || "Group Admin"}
        userEmail={user?.email || "groupadmin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="案件を作成" subtitle="新しい案件を登録します" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Link href="/group-admin/projects">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </Button>
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">
                    プロジェクト名（顧客名・案件名） <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value)
                      if (errors.projectName) {
                        setErrors((prev) => ({ ...prev, projectName: undefined }))
                      }
                    }}
                    placeholder="例: ABC株式会社 新システム導入"
                    className={errors.projectName ? "border-red-500" : ""}
                    aria-invalid={!!errors.projectName}
                  />
                  {errors.projectName && <p className="text-sm text-red-500">{errors.projectName}</p>}
                </div>

                <div className="space-y-2">
                  <Label>
                    Google DriveフォルダID <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    {gdriveFolderIds.map((folderId, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="text"
                          value={folderId}
                          onChange={(e) => handleFolderChange(index, e.target.value)}
                          placeholder="例: 1a2b3c4d5e6f7g8h9i0j"
                          className={errors.gdriveFolderIds ? "border-red-500" : ""}
                        />
                        {gdriveFolderIds.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleRemoveFolder(index)}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFolder}
                    className="gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    フォルダを追加
                  </Button>
                  {errors.gdriveFolderIds && <p className="text-sm text-red-500">{errors.gdriveFolderIds}</p>}
                  <p className="text-sm text-gray-500">
                    Google DriveのフォルダURLから取得できます。
                    <br />
                    例: https://drive.google.com/drive/folders/
                    <span className="font-mono bg-gray-100 px-1">1a2b3c4d5e6f7g8h9i0j</span>
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    作成
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/group-admin/projects")}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>案件を作成しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              プロジェクト名: {projectName}
              <br />
              Google Driveフォルダ: {gdriveFolderIds.filter((id) => id.trim()).length}件
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmSave}>作成</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
