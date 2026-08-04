import type { AiAdapterConfig, AiPanelSendContext, AiPanelSendHandler, AiPanelAdapter } from "./types"
import { ProviderType } from "./types"

const registry = new Map<ProviderType, new (config: AiAdapterConfig) => AiPanelAdapter>()

export function register<C extends AiAdapterConfig>(type: ProviderType, factory: new (config: C) => AiPanelAdapter) {
  registry.set(type, factory as new (config: AiAdapterConfig) => AiPanelAdapter)
}

export function buildSend(config: AiAdapterConfig): AiPanelSendHandler {
  const AdapterClass = registry.get(config.type)

  if (!AdapterClass) {
    throw new Error(`Unknown adapter type: ${config.type}`)
  }

  const adapter = new AdapterClass(config)
  const handler: AiPanelSendHandler = (prompt: string, context?: AiPanelSendContext) => adapter.send(prompt, context)
  handler.adapter = adapter
  return handler
}
