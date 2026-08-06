import { ProviderType } from "./types"
import type { AiAdapterConfig } from "./types"

export const DEFAULT_CONFIGS: Record<ProviderType, AiAdapterConfig> = {
  [ProviderType.Opencode]: { type: ProviderType.Opencode, enabled: true, model: "big-pickle" },
  [ProviderType.Shadcn]: { type: ProviderType.Shadcn, enabled: false, apiKey: "", baseUrl: "", model: "" },
  [ProviderType.Fallback]: { type: ProviderType.Fallback, enabled: false, apiUrl: "/api/ai/generate" },
}
