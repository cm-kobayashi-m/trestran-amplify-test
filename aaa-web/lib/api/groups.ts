import { apiClient } from "@/lib/api-client"
import type { Group } from "@/lib/types/api"

export const groupsApi = {
  list: () => apiClient.get<Group[]>("/api/lisa/groups"),

  create: (data: { name: string; description?: string; admins: string[] }) =>
    apiClient.post<Group>("/api/lisa/groups", data),

  update: (groupId: string, data: { name?: string; description?: string; admins?: string[] }) =>
    apiClient.put<Group>(`/api/lisa/groups/${groupId}`, data),

  delete: (groupId: string) => apiClient.delete<void>(`/api/lisa/groups/${groupId}`),
}
