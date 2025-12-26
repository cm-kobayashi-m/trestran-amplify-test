"use client"

import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-context"
import { ArrowLeft, Download, Edit, Eye, FileText, Loader2, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

const DOCUMENT_TYPES = [
  { value: "project-info", label: "案件情報管理シート" },
  { value: "hearing-sheet", label: "ヒアリングシート" },
  { value: "proposal", label: "提案書" },
  { value: "estimate", label: "見積書" },
  { value: "contract", label: "契約書" },
]

type GeneratedDocument = {
  id: string
  name: string
  type: string
  version: string
  status: "completed" | "generating" | "failed"
  progress?: number
  createdAt: string
  url?: string
}

type ProjectStatus = "ACTIVE" | "CLOSED" | "ARCHIVED"

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

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const { user } = useAuth()
  const projectId = params.id
  const { toast } = useToast()

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editProjectName, setEditProjectName] = useState("")
  const [editGdriveFolderIds, setEditGdriveFolderIds] = useState<string[]>([])
  const [editStatus, setEditStatus] = useState<ProjectStatus>("ACTIVE")
  const [editTags, setEditTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [newFolderId, setNewFolderId] = useState("")

  const [documentType, setDocumentType] = useState("")
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([
    {
      id: "1",
      name: "ヒアリングシート_v1",
      type: "hearing-sheet",
      version: "v1",
      status: "completed",
      createdAt: "2024-11-28",
      url: "/documents/hearing-sheet-v1.md",
    },
    {
      id: "2",
      name: "提案書_v2",
      type: "proposal",
      version: "v2",
      status: "completed",
      createdAt: "2024-11-27",
      url: "/documents/proposal-v2.md",
    },
  ])

  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const projectDetail = {
    id: projectId,
    name: "Acme Corp 営業提案書",
    createdBy: "田中太郎",
    createdDate: "2025-11-20",
    status: "ACTIVE" as ProjectStatus,
    tags: ["DWH", "ETL", "Redshift"],
    gdriveFolderIds: ["folder-12345", "folder-67890"],
  }

  const getLatestProjectInfoSheet = () => {
    const projectInfoDocs = generatedDocuments
      .filter((doc) => doc.type === "project-info" && doc.status === "completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return projectInfoDocs[0]
  }

  const latestProjectInfo = getLatestProjectInfoSheet()

  const handleDownloadMarkdown = () => {
    const blob = new Blob([latestProjectInfo?.url || ""], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${projectDetail.name}_案件情報管理シート.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleOpenGenerateDialog = () => {
    setIsGenerateDialogOpen(true)
    setDocumentType("")
  }

  const handleOpenEditDialog = () => {
    setEditProjectName(projectDetail.name)
    setEditGdriveFolderIds([...projectDetail.gdriveFolderIds])
    setEditStatus(projectDetail.status)
    setEditTags([...projectDetail.tags])
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    // TODO: 実際のAPI呼び出しを実装
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "保存しました",
      description: "案件情報が更新されました",
    })

    setTimeout(() => {
      setIsEditDialogOpen(false)
      // ページをリロードして更新を反映
    }, 100)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddFolderId = () => {
    if (newFolderId.trim() && !editGdriveFolderIds.includes(newFolderId.trim())) {
      setEditGdriveFolderIds([...editGdriveFolderIds, newFolderId.trim()])
      setNewFolderId("")
    }
  }

  const handleRemoveFolderId = (idToRemove: string) => {
    setEditGdriveFolderIds(editGdriveFolderIds.filter((id) => id !== idToRemove))
  }

  const getNextVersion = (docType: string) => {
    const existingDocs = generatedDocuments.filter((doc) => doc.type === docType)
    return `v${existingDocs.length + 1}`
  }

  const handleStartGeneration = () => {
    if (!documentType) {
      toast({
        title: "エラー",
        description: "ドキュメントタイプを選択してください",
        variant: "destructive",
      })
      return
    }

    const typeLabel = DOCUMENT_TYPES.find((t) => t.value === documentType)?.label || documentType
    const version = getNextVersion(documentType)

    const newDoc: GeneratedDocument = {
      id: Date.now().toString(),
      name: `${typeLabel}_${version}`,
      type: documentType,
      version,
      status: "generating",
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setGeneratedDocuments([newDoc, ...generatedDocuments])
    setIsGenerateDialogOpen(false)

    toast({
      title: "生成開始",
      description: `${newDoc.name}の生成を開始しました`,
    })

    // シミュレーション: プログレスバーを更新
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setGeneratedDocuments((docs) => docs.map((doc) => (doc.id === newDoc.id ? { ...doc, progress } : doc)))

      if (progress >= 100) {
        clearInterval(interval)
        setGeneratedDocuments((docs) =>
          docs.map((doc) =>
            doc.id === newDoc.id ? { ...doc, status: "completed", url: `/documents/${doc.name}.md` } : doc,
          ),
        )
        toast({
          title: "生成完了",
          description: `${newDoc.name}の生成が完了しました`,
        })
      }
    }, 500)
  }

  const handleRegenerate = (doc: GeneratedDocument) => {
    const versionNumber = Number.parseInt(doc.version.replace("v", "")) + 1
    const newVersion = `v${versionNumber}`
    const newName = doc.name.replace(/v\d+$/, newVersion)

    const newDoc: GeneratedDocument = {
      id: Date.now().toString(),
      name: newName,
      type: doc.type,
      version: newVersion,
      status: "generating",
      progress: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setGeneratedDocuments([newDoc, ...generatedDocuments])

    toast({
      title: "再生成開始",
      description: `${newName}の生成を開始しました`,
    })

    // シミュレーション
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setGeneratedDocuments((docs) => docs.map((d) => (d.id === newDoc.id ? { ...d, progress } : d)))

      if (progress >= 100) {
        clearInterval(interval)
        setGeneratedDocuments((docs) =>
          docs.map((d) => (d.id === newDoc.id ? { ...d, status: "completed", url: `/documents/${d.name}.md` } : d)),
        )
        toast({
          title: "生成完了",
          description: `${newName}の生成が完了しました`,
        })
      }
    }, 500)
  }

  const handleDownloadDocument = (doc: GeneratedDocument) => {
    toast({
      title: "ダウンロード",
      description: `${doc.name}をダウンロードしています`,
    })
    // 実際のダウンロード処理はここに実装
  }

  const handlePreviewDocument = (doc: GeneratedDocument) => {
    setPreviewDocument(doc)
    setIsPreviewOpen(true)
  }

  const getDocumentContent = (doc: GeneratedDocument) => {
    return `# ${doc.name}

## ドキュメント情報
- **タイプ**: ${doc.type}
- **バージョン**: ${doc.version}
- **生成日**: ${doc.createdAt}

## 内容

### セクション1
ここに生成されたドキュメントの内容が表示されます。

### セクション2
詳細な情報や分析結果がMarkdown形式で表示されます。

### セクション3
- 項目1
- 項目2
- 項目3

## まとめ
生成されたドキュメントのサマリーがここに表示されます。
`
  }

  const handleDeleteProject = () => {
    console.log("Deleting project:", projectDetail.name)
    toast({
      title: "案件を削除しました",
      description: `${projectDetail.name}が削除されました。`,
    })
    setIsDeleteDialogOpen(false)
    // TODO: Implement actual delete logic and redirect
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1000)
  }

  const handleOpenDeleteFromEdit = () => {
    setIsEditDialogOpen(false)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={user?.role || "user"} userName={user?.name || ""} userEmail={user?.email || ""} />
      <div className="flex-1 ml-64">
        <Header
          title={projectDetail.name}
          subtitle="案件詳細"
          actions={
            <>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="sr-only">通知</span>🔔
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <span className="sr-only">設定</span>
                ⚙️
              </button>
            </>
          }
        />
        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-6">
                <Link href="/dashboard">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <ArrowLeft className="w-4 h-4" />
                    案件一覧に戻る
                  </Button>
                </Link>
              </div>

              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">案件情報</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleOpenEditDialog} variant="outline" className="gap-2 bg-transparent">
                      <Edit className="w-4 h-4" />
                      変更
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">案件名</label>
                    <p className="mt-1 text-gray-900">{projectDetail.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">ステータス</label>
                    <div className="mt-1">
                      <Badge className={getStatusBadgeColor(projectDetail.status)}>
                        {getStatusLabel(projectDetail.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">作成者</label>
                    <p className="mt-1 text-gray-900">{projectDetail.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">作成日</label>
                    <p className="mt-1 text-gray-900">{projectDetail.createdDate}</p>
                  </div>
                </div>
                {projectDetail.tags.length > 0 && (
                  <div className="mt-6">
                    <label className="text-sm font-semibold text-gray-700">タグ</label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {projectDetail.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">案件情報管理シート</h2>
                  <div className="flex gap-2">
                    {latestProjectInfo && (
                      <>
                        <Button
                          onClick={() => {
                            setPreviewDocument(latestProjectInfo)
                            setIsPreviewOpen(true)
                          }}
                          variant="outline"
                          className="gap-2 bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                          プレビュー
                        </Button>
                        <Button
                          onClick={() => {
                            const blob = new Blob([latestProjectInfo.url || ""], { type: "text/markdown" })
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = `${latestProjectInfo.name}.md`
                            a.click()
                            window.URL.revokeObjectURL(url)
                          }}
                          variant="outline"
                          className="gap-2 bg-transparent"
                        >
                          <Download className="w-4 h-4" />
                          ダウンロード
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        setDocumentType("project-info")
                        setIsGenerateDialogOpen(true)
                      }}
                      variant="outline"
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FileText className="w-4 h-4" />
                      生成
                    </Button>
                  </div>
                </div>
                {latestProjectInfo ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        最新バージョン: {latestProjectInfo.version} ({latestProjectInfo.createdAt})
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-4 rounded-lg">
                        {getDocumentContent(latestProjectInfo).substring(0, 500)}...
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>案件情報管理シートを生成してください</p>
                  </div>
                )}
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">関連ドキュメント</h2>
                <div className="space-y-2">
                  {projectDetail.gdriveFolderIds.map((folderId, index) => (
                    <div key={index}>
                      <a
                        href={`https://drive.google.com/drive/folders/${folderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google Drive フォルダ {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">生成ドキュメント</h2>
                  <Button onClick={handleOpenGenerateDialog} className="gap-2">
                    <Plus className="w-4 h-4" />
                    新しいドキュメントを生成
                  </Button>
                </div>

                {generatedDocuments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">まだドキュメントが生成されていません</p>
                ) : (
                  <div className="space-y-4">
                    {generatedDocuments.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                  {doc.type}
                                </span>
                                {doc.status === "generating" && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 rounded text-blue-600 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    生成中
                                  </span>
                                )}
                                {doc.status === "completed" && (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 rounded text-green-600">完了</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {doc.version} • {doc.createdAt}生成
                              </p>
                              {doc.status === "generating" && doc.progress !== undefined && (
                                <div className="mt-3">
                                  <Progress value={doc.progress} className="h-2" />
                                  <p className="text-xs text-gray-500 mt-1">{doc.progress}%</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {doc.status === "completed" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handlePreviewDocument(doc)}
                                variant="outline"
                                size="sm"
                                className="gap-1 bg-transparent"
                              >
                                <Eye className="w-4 h-4" />
                                プレビュー
                              </Button>
                              <Button
                                onClick={() => handleDownloadDocument(doc)}
                                variant="outline"
                                size="sm"
                                className="gap-1 bg-transparent"
                              >
                                <Download className="w-4 h-4" />
                                ダウンロード
                              </Button>
                              <Button
                                onClick={() => handleRegenerate(doc)}
                                variant="outline"
                                size="sm"
                                className="gap-1 bg-transparent"
                              >
                                <RefreshCw className="w-4 h-4" />
                                再生成
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>案件情報を変更</DialogTitle>
              <DialogDescription>案件の名前、フォルダ、ステータスを変更できます</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="edit-project-name">案件名</Label>
                <Input
                  id="edit-project-name"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>ステータス</Label>
                <Select value={editStatus} onValueChange={(value) => setEditStatus(value as ProjectStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">進行中</SelectItem>
                    <SelectItem value="CLOSED">完了</SelectItem>
                    <SelectItem value="ARCHIVED">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Google DriveフォルダID</Label>
                <div className="space-y-2">
                  {editGdriveFolderIds.map((folderId, index) => (
                    <div key={index} className="flex gap-2">
                      <Input value={folderId} readOnly className="flex-1" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFolderId(folderId)}
                        className="text-red-600"
                      >
                        削除
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="新しいフォルダIDを追加"
                      value={newFolderId}
                      onChange={(e) => setNewFolderId(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddFolderId()
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddFolderId} variant="outline" size="sm">
                      追加
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>タグ</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {editTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-900 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="新しいタグを追加"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                    追加
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">
                キャンセル
              </Button>
              <Button onClick={handleOpenDeleteFromEdit} variant="destructive">
                削除
              </Button>
              <Button onClick={handleSaveEdit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ドキュメントを生成</DialogTitle>
              <DialogDescription>生成するドキュメントの種類を選択してください</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">ドキュメントタイプ</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">※ バージョンは自動的に採番されます</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleStartGeneration} className="bg-blue-600 hover:bg-blue-700 text-white">
                生成開始
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent
            className="flex flex-col p-0"
            style={{
              width: "95vw",
              height: "95vh",
              maxWidth: "95vw",
              maxHeight: "95vh",
            }}
          >
            <div className="p-6 border-b">
              <DialogHeader>
                <DialogTitle>{previewDocument?.name}</DialogTitle>
                <DialogDescription>
                  {previewDocument?.type} • {previewDocument?.version} • {previewDocument?.createdAt}生成
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-4 rounded-lg">
                  {previewDocument ? getDocumentContent(previewDocument) : ""}
                </pre>
              </div>
            </div>
            <div className="p-6 border-t">
              <DialogFooter>
                <Button onClick={() => setIsPreviewOpen(false)} variant="outline">
                  閉じる
                </Button>
                {previewDocument && (
                  <Button
                    onClick={() => handleDownloadDocument(previewDocument)}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4" />
                    ダウンロード
                  </Button>
                )}
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>案件の削除</AlertDialogTitle>
              <AlertDialogDescription>
                本当に「{projectDetail.name}」を削除しますか？この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">
                キャンセル
              </Button>
              <Button onClick={handleDeleteProject} variant="destructive">
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default ProjectDetailPage
