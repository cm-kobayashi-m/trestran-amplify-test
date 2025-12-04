// ユーザーとグループ
export type UserRole = "system_admin" | "group_admin" | "general_user"

export interface User {
  user_id: string
  email: string
  name: string
  is_system_admin: boolean
  created_at: string
}

export interface Group {
  group_id: string
  name: string
  description?: string
  admins: string[]
  created_at: string
  updated_at: string
}

export interface UserGroup {
  group_id: string
  name: string
  role: "group_admin" | "general_user"
}

export interface UserMeResponse {
  user: User
  groups: UserGroup[]
}

// 案件
export type ProjectStatus = "active" | "closed" | "archived"

export interface Project {
  project_id: string
  group_id: string
  name: string
  status: ProjectStatus
  tags: string[]
  google_drive_folder_ids: string[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface CreateProjectRequest {
  name: string
  status?: ProjectStatus
  tags?: string[]
  google_drive_folder_ids: string[]
}

export interface UpdateProjectRequest {
  name?: string
  status?: ProjectStatus
  tags?: string[]
  google_drive_folder_ids?: string[]
}

// プロンプト
export interface L0Prompt {
  prompt_id: string
  content: string
  updated_at: string
  updated_by: string
}

export interface L1Prompt {
  prompt_id: string
  group_id: string
  content: string
  updated_at: string
  updated_by: string
}

export interface L2Prompt {
  prompt_id: string
  group_id: string
  document_type: string
  content: string
  updated_at: string
  updated_by: string
}

// ドキュメント
export type DocumentType = "hearing_sheet" | "proposal" | "quotation" | "project_info_sheet"
export type DocumentStatus = "generating" | "completed" | "failed"

export interface Document {
  document_id: string
  project_id: string
  document_type: DocumentType
  version: number
  status: DocumentStatus
  content?: string
  created_at: string
  created_by: string
}

export interface GenerateDocumentRequest {
  document_type: DocumentType
}

// 案件情報管理シート
export interface ProjectInfoSheet {
  sheet_id: string
  project_id: string
  content: string
  updated_at: string
  updated_by: string
}

// システムヘルス
export interface TenantHealth {
  api_status: "healthy" | "degraded" | "down"
  google_drive_status: "healthy" | "degraded" | "down"
}
