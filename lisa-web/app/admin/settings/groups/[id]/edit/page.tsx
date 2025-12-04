"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"
import { useState, useEffect } from "react"
import { X, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const EditGroup = ({ params }: { params: { id: string } }) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [id, setId] = useState<string>("")
  const [groupName, setGroupName] = useState("")
  const [admins, setAdmins] = useState<string[]>([])
  const [adminInput, setAdminInput] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [errors, setErrors] = useState<{ groupName?: string; admins?: string }>({})

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await Promise.resolve(params)
      setId(resolvedParams.id)

      // Mock data - replace with actual API call
      if (resolvedParams.id === "1") {
        setGroupName("営業部")
        setAdmins(["田中太郎", "佐藤花子"])
      } else {
        setGroupName("エンジニアチーム")
        setAdmins(["鈴木一郎"])
      }
    }
    loadData()
  }, [params])

  const addAdmin = () => {
    if (adminInput.trim() && !admins.includes(adminInput.trim())) {
      setAdmins([...admins, adminInput.trim()])
      setAdminInput("")
    }
  }

  const removeAdmin = (adminToRemove: string) => {
    setAdmins(admins.filter((admin) => admin !== adminToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { groupName?: string; admins?: string } = {}

    if (!groupName.trim()) {
      newErrors.groupName = "グループ名を入力してください"
    }
    if (admins.length === 0) {
      newErrors.admins = "少なくとも1人の管理者を設定してください"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setShowSaveDialog(true)
  }

  const handleConfirmSave = () => {
    try {
      console.log("Updating group:", { id, groupName, admins })
      // TODO: API call to update group

      toast({
        title: "成功",
        description: "グループを更新しました",
      })

      setTimeout(() => {
        setShowSaveDialog(false)
      }, 100)
    } catch (error) {
      toast({
        title: "エラー",
        description: "グループの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    try {
      console.log("Deleting group:", id)
      // TODO: API call to delete group

      toast({
        title: "成功",
        description: "グループを削除しました",
      })

      setTimeout(() => {
        setShowDeleteDialog(false)
      }, 100)
      // Redirect after success
      window.location.href = "/admin/settings/groups"
    } catch (error) {
      toast({
        title: "エラー",
        description: "グループの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

  if (!id) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user?.role || "admin"}
        userName={user?.name || "Admin User"}
        userEmail={user?.email || "admin@company.com"}
      />

      <main className="flex-1 ml-64 flex flex-col">
        <Header title="グループを編集" subtitle="グループ名と管理者を編集" />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Link href="/admin/settings/groups">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </Button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <div>
                <label htmlFor="groupName" className="block text-sm font-semibold text-gray-900 mb-2">
                  グループ名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value)
                    if (errors.groupName) {
                      setErrors((prev) => ({ ...prev, groupName: undefined }))
                    }
                  }}
                  placeholder="例: 営業部"
                  className={cn(
                    "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    errors.groupName ? "border-red-500" : "border-gray-300",
                  )}
                />
                {errors.groupName && <p className="text-sm text-red-500 mt-1">{errors.groupName}</p>}
              </div>

              <div>
                <label htmlFor="adminInput" className="block text-sm font-semibold text-gray-900 mb-2">
                  管理者 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    id="adminInput"
                    type="text"
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAdmin())}
                    placeholder="管理者名を入力"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button type="button" onClick={addAdmin}>
                    追加
                  </Button>
                </div>

                {admins.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {admins.map((admin) => (
                      <div key={admin} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-900">{admin}</span>
                        <button
                          type="button"
                          onClick={() => removeAdmin(admin)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.admins && <p className="text-sm text-red-500 mt-1">{errors.admins}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">保存</Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  削除
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (window.location.href = "/admin/settings/groups")}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>グループを保存しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              グループ名: {groupName}
              <br />
              管理者: {admins.join(", ")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleConfirmSave}>保存</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>グループを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。グループ「{groupName}」を完全に削除します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              削除
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditGroup
