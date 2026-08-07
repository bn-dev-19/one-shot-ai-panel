import OpenAI from "openai"
import type { AiPanelAdapter, ZenAdapterConfig } from "./types"
import { ProviderType } from "./types"
import type { AiPanelContextInfo, AiPanelTokenUsage } from "../types"

const DEFAULT_ZEN_URL = "/api/zen/v1"
const STREAM_TIMEOUT_MS = 15 * 60 * 1000

type StreamFrame =
  | { t: "reasoning" | "text"; d: string; snapshot?: boolean }
  | { t: "context"; d: AiPanelContextInfo; snapshot?: boolean }

interface ZenUsage {
  prompt_tokens?: number
  completion_tokens?: number
  prompt_tokens_details?: { cached_tokens?: number }
  completion_tokens_details?: { reasoning_tokens?: number }
}

function mapUsage(u: ZenUsage): AiPanelTokenUsage {
  const promptDetails = u.prompt_tokens_details
  const completionDetails = u.completion_tokens_details
  return {
    input: Number(u.prompt_tokens ?? 0),
    output: Number(u.completion_tokens ?? 0),
    reasoning: Number(completionDetails?.reasoning_tokens ?? 0),
    cacheRead: Number(promptDetails?.cached_tokens ?? 0),
    cacheWrite: 0,
  }
}

/**
 * Adapter utilisant l'API OpenAI-compatible d'OpenCode Zen
 * (https://opencode.ai/zen/v1/chat/completions).
 *
 * Zen est un gateway de modèles (chat uniquement) : pas de sessions,
 * de permissions, de questions ni de diff d'agent. Seul le texte
 * (et le raisonnement le cas échéant) est diffusé.
 */
export class ZenAdapter implements AiPanelAdapter {
  type = ProviderType.Zen
  private client: OpenAI
  private baseUrl: string
  private modelId?: string
  private controller?: AbortController
  private lastInfo?: AiPanelContextInfo

  constructor(config: ZenAdapterConfig) {
    this.baseUrl = config.baseUrl ?? DEFAULT_ZEN_URL
    this.modelId = config.model
    this.client = new OpenAI({
      apiKey: config.apiKey ?? "",
      baseURL: this.baseUrl,
      dangerouslyAllowBrowser: true,
    })
  }

  async abort(): Promise<void> {
    this.controller?.abort()
  }

  async cancel(): Promise<void> {
    this.controller?.abort()
  }

  getContextInfo(): AiPanelContextInfo | undefined {
    return this.lastInfo
  }

  async send(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const model = this.modelId
    if (!model) {
      throw new Error(
        "Aucun modèle sélectionné. Choisis un modèle OpenCode Zen dans les réglages du panel.",
      )
    }

    const abortController = new AbortController()
    this.controller = abortController

    let stream
    try {
      stream = await this.client.chat.completions.create(
        {
          model,
          messages: [{ role: "user", content: prompt }],
          stream: true,
        },
        { signal: abortController.signal },
      )
    } catch (err) {
      if (abortController.signal.aborted) {
        throw new DOMException("Aborted", "AbortError")
      }
      const detail = err instanceof Error && err.message ? `\n${err.message}` : ""
      throw new Error(
        `Impossible de joindre OpenCode Zen (${this.baseUrl}). Vérifie ta clé API et ta connexion.${detail}`,
      )
    }

    const encoder = new TextEncoder()
    const adapter = this
    let closed = false
    let timeout: ReturnType<typeof setTimeout> | undefined
    let usage: ZenUsage | null = null

    return new ReadableStream<Uint8Array>({
      async start(streamController) {
        const emit = (frame: StreamFrame) => {
          if (closed) return
          try {
            streamController.enqueue(encoder.encode(`${JSON.stringify(frame)}\n`))
          } catch {
            closed = true
          }
        }

        const finish = () => {
          if (closed) return
          closed = true
          if (timeout) clearTimeout(timeout)
          try {
            streamController.close()
          } catch {
            // stream already cancelled
          }
        }

        const fail = (err: unknown) => {
          if (closed) return
          closed = true
          if (timeout) clearTimeout(timeout)
          try {
            streamController.error(err)
          } catch {
            // stream already cancelled
          }
        }

        timeout = setTimeout(() => abortController.abort(), STREAM_TIMEOUT_MS)

        try {
          for await (const chunk of stream) {
            if (closed) return
            const delta = chunk.choices?.[0]?.delta
            if (delta) {
              const reasoning = (delta as { reasoning_content?: string }).reasoning_content
              if (reasoning) emit({ t: "reasoning", d: reasoning })
              if (delta.content) emit({ t: "text", d: delta.content })
            }
            if (chunk.usage) usage = chunk.usage as ZenUsage
          }

          if (!closed && usage) {
            adapter.lastInfo = {
              sessionID: `zen:${Date.now()}`,
              modelID: model,
              providerID: "zen",
              tokens: mapUsage(usage),
            }
            emit({ t: "context", d: adapter.lastInfo })
          }
          finish()
        } catch (err) {
          if (closed) return
          if (abortController.signal.aborted) {
            fail(new Error("Délai d'attente dépassé pour la réponse OpenCode Zen."))
          } else {
            fail(err)
          }
        }
      },
      cancel() {
        closed = true
        if (timeout) clearTimeout(timeout)
        abortController.abort()
      },
    })
  }
}
