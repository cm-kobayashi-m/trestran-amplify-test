import { apiClient } from "@/lib/api-client"
import type { UserMeResponse } from "@/lib/types/api"

export const usersApi = {
  getMe: () => apiClient.get<UserMeResponse>("/api/lisa/users/me"),
}
