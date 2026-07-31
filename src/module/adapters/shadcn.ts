import type { AiPanelAdapter, ShadcnAdapterConfig } from "./types"
import { ProviderType } from "./types"

/**
 * Adapter utilisant @shadcn/helpers/ai-sdk pour le développement / démo.
 * Il crée un chat pré-défini qui streame via le transport local.
 */
export class ShadcnAdapter implements AiPanelAdapter {
  type = ProviderType.Shadcn

  constructor(_config: ShadcnAdapterConfig) {}

  async send(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const encoder = new TextEncoder()

    return new ReadableStream({
      async start(controller) {
        const words = prompt.split(/\s+/)
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "))
          await new Promise((r) => setTimeout(r, 30))
        }
        controller.close()
      },
    })
  }
}
