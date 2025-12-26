import { apiClient } from "@/lib/api-client"
import type { L0Prompt, L1Prompt, L2Prompt } from "@/lib/types/api"

export const promptsApi = {
  getL0: () => apiClient.get<L0Prompt>("/api/lisa/prompts/l0"),

  updateL0: (content: string) => apiClient.put<L0Prompt>("/api/lisa/prompts/l0", { content }),

  getL1: (groupId: string) => apiClient.get<L1Prompt>(`/api/lisa/groups/${groupId}/prompts/l1`),

  updateL1: (groupId: string, content: string) =>
    apiClient.put<L1Prompt>(`/api/lisa/groups/${groupId}/prompts/l1`, { content }),

  listL2: (groupId: string) => apiClient.get<L2Prompt[]>(`/api/lisa/groups/${groupId}/prompts/l2`),

  getL2: (groupId: string, documentType: string) =>
    apiClient.get<L2Prompt>(`/api/lisa/groups/${groupId}/prompts/l2/${documentType}`),

  updateL2: (groupId: string, documentType: string, content: string) =>
    apiClient.put<L2Prompt>(`/api/lisa/groups/${groupId}/prompts/l2/${documentType}`, { content }),
}
