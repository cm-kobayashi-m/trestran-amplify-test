import { apiClient } from "@/lib/api-client"
import type { Document, GenerateDocumentRequest } from "@/lib/types/api"

export const documentsApi = {
  list: (projectId: string) => apiClient.get<Document[]>(`/api/lisa/projects/${projectId}/documents`),

  get: (projectId: string, documentId: string) =>
    apiClient.get<Document>(`/api/lisa/projects/${projectId}/documents/${documentId}`),

  generate: (projectId: string, data: GenerateDocumentRequest) =>
    apiClient.post<Document>(`/api/lisa/projects/${projectId}/documents/generate`, data),

  regenerate: (projectId: string, documentId: string) =>
    apiClient.post<Document>(`/api/lisa/projects/${projectId}/documents/${documentId}/regenerate`),
}
