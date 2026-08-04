import { createOpencodeClient } from "@opencode-ai/sdk/client"
import type { SessionPromptData } from "@opencode-ai/sdk/client"
import type { AiPanelAdapter, AiPanelSendContext, OpenCodeAdapterConfig } from "./types"
import { ProviderType } from "./types"
import type {
  AiPanelPendingPermission,
  AiPanelPendingQuestion,
  AiPanelPermissionResponse,
  AiPanelToolActivity,
} from "../types"

const DEFAULT_OPENCODE_URL = "http://localhost:4096"

type StreamFrame =
  | { t: "reasoning" | "text"; d: string; snapshot?: boolean }
  | { t: "question"; d: AiPanelPendingQuestion; snapshot?: boolean }
  | { t: "permission"; d: AiPanelPendingPermission; snapshot?: boolean }
  | { t: "tool"; d: AiPanelToolActivity; snapshot?: boolean }

interface OpenCodeEvent {
  type: string
  properties: Record<string, unknown>
}

function isHttpUrl(p: string): boolean {
  return /^https?:\/\//i.test(p)
}

function toLocalPath(p: string): string {
  if (/^file:\/\//i.test(p)) {
    try {
      return decodeURIComponent(new URL(p).pathname)
    } catch {
      return p.replace(/^file:\/\//i, "")
    }
  }
  return p
}

function commonAncestorDir(paths: string[]): string | null {
  if (paths.length === 0) return null
  let prefix = paths[0].replace(/\/+$/, "")
  for (const raw of paths.slice(1)) {
    let p = raw.replace(/\/+$/, "")
    while (!p.startsWith(prefix)) {
      const idx = prefix.lastIndexOf("/")
      if (idx <= 0) return null
      prefix = prefix.slice(0, idx)
    }
  }
  if (prefix === "/" || prefix.split("/").filter(Boolean).length <= 1) return null
  return prefix
}

function patternInPaths(pattern: string | string[] | undefined, paths: string[]): boolean {
  if (!pattern || paths.length === 0) return false
  const patterns = Array.isArray(pattern) ? pattern : [pattern]
  return patterns.some((p) => paths.some((f) => f.startsWith(p) || p.startsWith(f)))
}

export class OpenCodeAdapter implements AiPanelAdapter {
  type = ProviderType.Opencode
  private client: ReturnType<typeof createOpencodeClient>
  private baseUrl: string
  private modelId?: string
  private password?: string
  private sessionId?: string
  private pendingQuestions = new Map<string, { sessionID: string; questions: AiPanelPendingQuestion["questions"] }>()
  private pendingPermissions = new Map<string, { sessionID: string; permission: AiPanelPendingPermission }>()

  constructor(config: OpenCodeAdapterConfig) {
    this.baseUrl = config.apiUrl ?? DEFAULT_OPENCODE_URL
    this.modelId = config.model
    this.password = config.password
    this.client = createOpencodeClient({
      baseUrl: this.baseUrl,
      throwOnError: true,
      headers: config.password ? { Authorization: `Bearer ${config.password}` } : undefined,
    })
  }

  private async createSession(directory?: string): Promise<string> {
    let session
    try {
      session = await this.client.session.create({
        body: { title: "ai-panel" },
        query: directory ? { directory } : undefined,
      })
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

  async replyQuestion(requestID: string, answers: string[][]): Promise<void> {
    this.pendingQuestions.delete(requestID)
    await this.postRaw(`/question/${requestID}/reply`, { answers })
  }

  async rejectQuestion(requestID: string): Promise<void> {
    this.pendingQuestions.delete(requestID)
    await this.postRaw(`/question/${requestID}/reject`)
  }

  async replyPermission(permissionID: string, response: AiPanelPermissionResponse): Promise<void> {
    this.pendingPermissions.delete(permissionID)
    if (!this.sessionId) return
    try {
      await this.client.postSessionIdPermissionsPermissionId({
        path: { id: this.sessionId, permissionID },
        body: { response },
      })
    } catch {
      // best-effort
    }
  }

  private async postRaw(path: string, body?: unknown): Promise<void> {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (this.password) headers["Authorization"] = `Bearer ${this.password}`
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error(`OpenCode API error ${res.status} on ${path}`)
    }
  }

  async send(prompt: string, context?: AiPanelSendContext): Promise<ReadableStream<Uint8Array>> {
    const files = (context?.files ?? []).filter((f) => f.enabled !== false && f.present && f.path)
    const localFiles = files.map((f) => toLocalPath(f.path)).filter((p) => !isHttpUrl(p))
    const scopedDir = commonAncestorDir(localFiles)
    const panelPaths = [...localFiles]
    if (scopedDir) panelPaths.push(scopedDir)

    const sessionId = await this.createSession(scopedDir ?? undefined)
    this.sessionId = sessionId

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

              if (evt.type === "question.asked") {
                const props = evt.properties as {
                  sessionID?: string
                  id?: string
                  questions?: AiPanelPendingQuestion["questions"]
                }
                if (props.sessionID !== sessionId || !props.id || !props.questions) continue
                this.pendingQuestions.set(props.id, { sessionID: sessionId, questions: props.questions })
                emit({ t: "question", d: { requestID: props.id, questions: props.questions } })
                continue
              }

              if (evt.type === "permission.updated") {
                const props = evt.properties as {
                  sessionID?: string
                  id?: string
                  type?: string
                  pattern?: string | string[]
                  title?: string
                }
                if (props.sessionID !== sessionId || !props.id) continue
                if (props.type === "external_directory" && patternInPaths(props.pattern, panelPaths)) {
                  void this.replyPermission(props.id, "always")
                  continue
                }
                const entry: AiPanelPendingPermission = {
                  permissionID: props.id,
                  title: props.title ?? props.type ?? "permission",
                  type: props.type,
                  pattern: props.pattern,
                }
                this.pendingPermissions.set(props.id, { sessionID: sessionId, permission: entry })
                emit({ t: "permission", d: entry })
                continue
              }

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
                part?: {
                  id?: string
                  type?: string
                  sessionID?: string
                  text?: string
                  tool?: string
                  title?: string
                  state?: { status?: string }
                }
              }
              const part = props.part
              if (!part || part.sessionID !== sessionId) continue
              if (part.type === "reasoning") {
                if (!part.id || reasoningSeen.has(part.id)) continue
                if (part.text) emit({ t: "reasoning", d: part.text, snapshot: true })
                continue
              }
              if (part.type === "tool") {
                emit({ t: "tool", d: { title: part.title, tool: part.tool, state: part.state?.status } })
                continue
              }
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
