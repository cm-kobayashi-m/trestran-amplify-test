import { apiClient } from "@/lib/api-client"
import type { Project, CreateProjectRequest, UpdateProjectRequest, ProjectInfoSheet } from "@/lib/types/api"

export const projectsApi = {
  list: (groupId: string, status?: string) => {
    const params = status ? `?status=${status}` : ""
    return apiClient.get<Project[]>(`/api/lisa/groups/${groupId}/projects${params}`)
  },

  get: (projectId: string) => apiClient.get<Project>(`/api/lisa/projects/${projectId}`),

  create: (groupId: string, data: CreateProjectRequest) =>
    apiClient.post<Project>(`/api/lisa/groups/${groupId}/projects`, data),

  update: (projectId: string, data: UpdateProjectRequest) =>
    apiClient.put<Project>(`/api/lisa/projects/${projectId}`, data),

  delete: (projectId: string) => apiClient.delete<void>(`/api/lisa/projects/${projectId}`),

  getInfoSheet: (projectId: string) => apiClient.get<ProjectInfoSheet>(`/api/lisa/projects/${projectId}/info-sheet`),

  updateInfoSheet: (projectId: string, content: string) =>
    apiClient.put<ProjectInfoSheet>(`/api/lisa/projects/${projectId}/info-sheet`, { content }),
}
