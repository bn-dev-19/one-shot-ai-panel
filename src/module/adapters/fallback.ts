import type { AiPanelAdapter, FallbackAdapterConfig } from "./types"
import { ProviderType } from "./types"

export class FallbackAdapter implements AiPanelAdapter {
  type = ProviderType.Fallback
  private apiUrl: string

  constructor(config: FallbackAdapterConfig) {
    this.apiUrl = config.apiUrl ?? "/api/ai/generate"
  }

  async send(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })

    if (!res.ok) {
      throw new Error(`AI request failed: ${res.status} ${res.statusText}`)
    }

    return res.body!
  }
}
