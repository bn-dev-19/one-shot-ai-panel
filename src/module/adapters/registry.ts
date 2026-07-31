import type { AiAdapterConfig, AiPanelSendHandler, AiPanelAdapter } from "./types"
import { ProviderType } from "./types"

const registry = new Map<ProviderType, new (config: any) => AiPanelAdapter>()

export function register(type: ProviderType, factory: new (config: any) => AiPanelAdapter) {
  registry.set(type, factory)
}

export function buildSend(config: AiAdapterConfig): AiPanelSendHandler {
  const AdapterClass = registry.get(config.type)

  if (!AdapterClass) {
    throw new Error(`Unknown adapter type: ${config.type}`)
  }

  const adapter = new AdapterClass(config)
  return (prompt: string) => adapter.send(prompt)
}
