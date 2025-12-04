import { apiClient } from "@/lib/api-client"
import type { TenantHealth } from "@/lib/types/api"

export const healthApi = {
  getTenantHealth: () => apiClient.get<TenantHealth>("/api/lisa/tenant/health"),
}
