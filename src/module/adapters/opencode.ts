import { createOpencodeClient } from "@opencode-ai/sdk/client"
import type { SessionPromptData } from "@opencode-ai/sdk/client"
import type { AiPanelAdapter, OpenCodeAdapterConfig } from "./types"
import { ProviderType } from "./types"

const DEFAULT_OPENCODE_URL = "http://localhost:4096"

interface StreamFrame {
  t: "reasoning" | "text"
  d: string
  snapshot?: boolean
}

interface OpenCodeEvent {
  type: string
  properties: Record<string, unknown>
}

export class OpenCodeAdapter implements AiPanelAdapter {
  type = ProviderType.Opencode
  private client: ReturnType<typeof createOpencodeClient>
  private baseUrl: string
  private modelId?: string

  constructor(config: OpenCodeAdapterConfig) {
    this.baseUrl = config.apiUrl ?? DEFAULT_OPENCODE_URL
    this.modelId = config.model
    this.client = createOpencodeClient({
      baseUrl: this.baseUrl,
      throwOnError: true,
      headers: config.password ? { Authorization: `Bearer ${config.password}` } : undefined,
    })
  }

  private async createSession(): Promise<string> {
    let session
    try {
      session = await this.client.session.create({ body: { title: "ai-panel" } })
    } catch (err) {
      throw new Error(
        `Impossible de contacter le serveur OpenCode (${this.baseUrl}). Vérifie qu'il est lancé.\n${(err as Error)?.message ?? ""}`,
      )
    }
    const sid = (session as { data?: { id: string } })?.data?.id
    if (!sid) {
      throw new Error("Échec de création de session OpenCode")
    }
    return sid
  }

  async send(prompt: string): Promise<ReadableStream<Uint8Array>> {
    const sessionId = await this.createSession()

    const body: NonNullable<SessionPromptData["body"]> = {
      model: this.modelId ? { providerID: "opencode", modelID: this.modelId } : undefined,
      parts: [{ type: "text", text: prompt }],
    }

    let events: AsyncGenerator<OpenCodeEvent> | undefined
    try {
      const sse = await this.client.event.subscribe({})
      events = sse.stream as AsyncGenerator<OpenCodeEvent>
    } catch {
      events = undefined
    }

    const promptPromise = this.client.session.prompt({
      path: { id: sessionId },
      body,
    })

    const encoder = new TextEncoder()
    let closed = false

    return new ReadableStream<Uint8Array>({
      start: async (controller) => {
        const emit = (frame: StreamFrame) => {
          if (closed) return
          try {
            controller.enqueue(encoder.encode(`${JSON.stringify(frame)}\n`))
          } catch {
            closed = true
          }
        }

        const close = () => {
          if (closed) return
          closed = true
          void events?.return(undefined)
          try {
            controller.close()
          } catch {
            // stream already cancelled
          }
        }

        const fail = (err: unknown) => {
          if (closed) return
          closed = true
          void events?.return(undefined)
          try {
            controller.error(err)
          } catch {
            // stream already cancelled
          }
        }

        const consumeEvents = async () => {
          if (!events) return
          const reasoningSeen = new Set<string>()
          try {
            for await (const evt of events) {
              if (closed) return
              if (evt.type === "message.part.delta") {
                const props = evt.properties as {
                  sessionID?: string
                  partID?: string
                  field?: string
                  delta?: string
                }
                if (props.sessionID !== sessionId) continue
                if (props.field === "reasoning") {
                  if (props.partID) reasoningSeen.add(props.partID)
                  if (props.delta) emit({ t: "reasoning", d: props.delta })
                } else if (props.field === "text" && props.delta) {
                  emit({ t: "text", d: props.delta })
                }
                continue
              }
              if (evt.type !== "message.part.updated") continue
              const props = evt.properties as {
                part?: { id?: string; type?: string; sessionID?: string; text?: string }
              }
              const part = props.part
              if (!part || part.sessionID !== sessionId || part.type !== "reasoning") continue
              if (!part.id || reasoningSeen.has(part.id)) continue
              if (part.text) emit({ t: "reasoning", d: part.text, snapshot: true })
            }
          } catch {
            // SSE stream ended or errored; final text still arrives via promptPromise
          }
        }

        const consumePrompt = async () => {
          try {
            const result = await promptPromise
            if (closed) return

            const responseData = (result as {
              data?: { parts?: Array<{ type: string; text?: string }>; info?: Record<string, unknown> }
            })?.data
            if (!responseData) {
              fail(new Error("Le serveur n'a pas retourné de réponse valide"))
              return
            }

            const info = responseData.info as Record<string, unknown> | undefined
            const structured = info?.structured ?? info?.structured_output

            if (structured) {
              const text = JSON.stringify(structured, null, 2)
              emit({ t: "text", d: text, snapshot: true })
            } else {
              const parts = responseData.parts ?? []
              let text = ""
              for (const p of parts) {
                if (p.type === "text" && "text" in p) {
                  text += (p.text ?? "") + "\n"
                }
              }
              text = text.trimEnd()
              if (text) emit({ t: "text", d: text, snapshot: true })
            }
            close()
          } catch (err) {
            fail(err)
          }
        }

        void consumeEvents()
        await consumePrompt()
      },
      cancel: async () => {
        closed = true
        try {
          await this.client.session.abort({ path: { id: sessionId } })
        } catch {
          // ignore
        }
      },
    })
  }
}
