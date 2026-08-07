import { createOpencodeClient } from "@opencode-ai/sdk/client"
import type { SessionPromptData } from "@opencode-ai/sdk/client"
import type { AiPanelAdapter, AiPanelSendContext, OpenCodeAdapterConfig } from "./types"
import { ProviderType } from "./types"
import type {
  AiPanelContextInfo,
  AiPanelPendingPermission,
  AiPanelPendingQuestion,
  AiPanelPermissionResponse,
  AiPanelStreamStatus,
  AiPanelTokenUsage,
  AiPanelToolActivity,
} from "../types"

const DEFAULT_OPENCODE_URL = "http://localhost:4096"

const SESSION_COOKIE_PREFIX = "ai-panel:session:"
const SESSION_COOKIE_DAYS = 30
const SSE_MAX_RETRIES = 3
const HEARTBEAT_INTERVAL_MS = 10_000
const STALL_SECONDS = 45
const PROMPT_TIMEOUT_MS = 15 * 60 * 1000

type StreamFrame =
  | { t: "reasoning" | "text"; d: string; snapshot?: boolean }
  | { t: "question"; d: AiPanelPendingQuestion; snapshot?: boolean }
  | { t: "permission"; d: AiPanelPendingPermission; snapshot?: boolean }
  | { t: "tool"; d: AiPanelToolActivity; snapshot?: boolean }
  | { t: "context"; d: AiPanelContextInfo; snapshot?: boolean }
  | { t: "status"; d: AiPanelStreamStatus; snapshot?: boolean }

interface OpenCodeEvent {
  type: string
  properties: Record<string, unknown>
}

interface StoredSession {
  id: string
  directory?: string
}

const sessionStore = new Map<string, StoredSession>()

function cookieKey(baseUrl: string): string {
  return `${SESSION_COOKIE_PREFIX}${encodeURIComponent(baseUrl)}`
}

function readCookie(key: string): StoredSession | undefined {
  if (typeof document === "undefined") return undefined
  const prefix = `${key}=`
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim()
    if (trimmed.startsWith(prefix)) {
      try {
        const value = JSON.parse(decodeURIComponent(trimmed.slice(prefix.length))) as StoredSession
        if (value && typeof value.id === "string") return value
      } catch {
        // malformed cookie, ignore
      }
    }
  }
  return undefined
}

function writeCookie(key: string, value: StoredSession): void {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + SESSION_COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${key}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`
}

function clearCookie(key: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

export class OpenCodeAdapter implements AiPanelAdapter {
  type = ProviderType.Opencode
  private client: ReturnType<typeof createOpencodeClient>
  private baseUrl: string
  private modelId?: string
  private password?: string
  private sessionId?: string
  private directory?: string
  private lastCost?: number
  private lastTokens?: AiPanelTokenUsage
  private pendingQuestions = new Map<string, { sessionID: string; questions: AiPanelPendingQuestion["questions"] }>()
  private pendingPermissions = new Map<string, { sessionID: string; permission: AiPanelPendingPermission }>()
  private runningTools = new Map<string, { activity: AiPanelToolActivity; startedAt: number }>()
  private seenPermissions = new Set<string>()
  private seenQuestions = new Set<string>()

  constructor(config: OpenCodeAdapterConfig) {
    const raw = config.apiUrl?.trim()
    const hasUrl = !!raw
    const validUrl = hasUrl && /^https?:\/\//i.test(raw)
    this.baseUrl = validUrl ? raw : DEFAULT_OPENCODE_URL
    this.modelId = config.model
    this.password = validUrl ? config.password : hasUrl ? undefined : config.password
    this.client = createOpencodeClient({
      baseUrl: this.baseUrl,
      throwOnError: true,
      headers: this.password ? { Authorization: `Bearer ${this.password}` } : undefined,
    })
  }

  private async createSession(directory?: string): Promise<StoredSession> {
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
    return { id: sid, directory }
  }

  private async getSession(directory?: string): Promise<StoredSession> {
    const key = cookieKey(this.baseUrl)
    const cached = sessionStore.get(this.baseUrl)
    const stored = cached ?? readCookie(key)
    if (stored) {
      try {
        await this.client.session.get({
          path: { id: stored.id },
          query: stored.directory ? { directory: stored.directory } : undefined,
        })
        sessionStore.set(this.baseUrl, stored)
        return stored
      } catch {
        sessionStore.delete(this.baseUrl)
        clearCookie(key)
      }
    }
    const created = await this.createSession(directory)
    sessionStore.set(this.baseUrl, created)
    writeCookie(key, created)
    return created
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
    try {
      await this.postRaw(`/permission/${permissionID}/reply`, { reply: response })
      return
    } catch {
      // fall back to the older SDK endpoint shape
    }
    if (!this.sessionId) return
    await this.client.postSessionIdPermissionsPermissionId({
      path: { id: this.sessionId, permissionID },
      body: { response },
    })
  }

  async abort(): Promise<void> {
    const sid = this.sessionId
    if (!sid) return
    try {
      await this.client.session.abort({ path: { id: sid } })
    } catch {
      // best-effort
    }
  }

  async cancel(): Promise<void> {
    const sid = this.sessionId
    await this.abort()
    if (sid) {
      try {
        await this.client.session.delete({ path: { id: sid } })
      } catch {
        // best-effort
      }
      this.sessionId = undefined
      this.directory = undefined
      this.lastCost = undefined
      this.lastTokens = undefined
      sessionStore.delete(this.baseUrl)
      clearCookie(cookieKey(this.baseUrl))
    }
  }

  async deleteSession(): Promise<void> {
    const sid = this.sessionId
    if (!sid) return
    try {
      await this.client.session.delete({ path: { id: sid } })
    } catch {
      // best-effort
    }
    this.sessionId = undefined
    this.directory = undefined
    this.lastCost = undefined
    this.lastTokens = undefined
    sessionStore.delete(this.baseUrl)
    clearCookie(cookieKey(this.baseUrl))
  }

  async renewSession(): Promise<void> {
    await this.deleteSession()
    const created = await this.getSession(undefined)
    this.sessionId = created.id
    this.directory = created.directory
  }

  getContextInfo(): AiPanelContextInfo | undefined {
    if (!this.sessionId) return undefined
    return {
      sessionID: this.sessionId,
      directory: this.directory,
      modelID: this.modelId,
      providerID: "opencode",
      cost: this.lastCost,
      tokens: this.lastTokens,
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

  async send(prompt: string, _context?: AiPanelSendContext): Promise<ReadableStream<Uint8Array>> {
    void _context
    this.seenPermissions.clear()
    this.seenQuestions.clear()
    this.runningTools.clear()

    const stored = await this.getSession()
    const sessionId = stored.id
    this.sessionId = sessionId
    this.directory = stored.directory
    this.lastCost = undefined
    this.lastTokens = undefined

    const body: NonNullable<SessionPromptData["body"]> = {
      model: this.modelId ? { providerID: "opencode", modelID: this.modelId } : undefined,
      parts: [{ type: "text", text: prompt }],
    }

    let events: AsyncGenerator<OpenCodeEvent> | undefined
    let sseError: Error | null = null
    let eventReceived = false
    const sseAbort = new AbortController()
    try {
      const subscribeOptions = {
        signal: sseAbort.signal,
        sseMaxRetryAttempts: SSE_MAX_RETRIES,
        onSseError: (err: unknown) => {
          sseError = err instanceof Error ? err : new Error(String(err))
        },
      } as Parameters<typeof this.client.event.subscribe>[0] & {
        signal?: AbortSignal
        sseMaxRetryAttempts?: number
        onSseError?: (error: unknown) => void
      }
      const sse = await this.client.event.subscribe(subscribeOptions)
      events = sse.stream as AsyncGenerator<OpenCodeEvent>
    } catch (err) {
      events = undefined
      sseError = err instanceof Error ? err : new Error(String(err))
    }

    let globalEvents: AsyncGenerator<Record<string, unknown>> | undefined
    try {
      const globalOptions = {
        signal: sseAbort.signal,
        sseMaxRetryAttempts: SSE_MAX_RETRIES,
        onSseError: () => {
          // safety net stream: never fail the generation because of it
        },
      } as Parameters<typeof this.client.global.event>[0] & {
        signal?: AbortSignal
        sseMaxRetryAttempts?: number
        onSseError?: (error: unknown) => void
      }
      const g = await this.client.global.event(globalOptions)
      globalEvents = g.stream as AsyncGenerator<Record<string, unknown>>
    } catch {
      globalEvents = undefined
    }

    const promptPromise = this.client.session.prompt({
      path: { id: sessionId },
      body,
    })

    const encoder = new TextEncoder()
    let closed = false
    const startedAt = Date.now()
    let lastActivity = Date.now()
    let lastStatusKind: AiPanelStreamStatus["kind"] | undefined
    let lastStatusSeconds = -1
    let watchdog: ReturnType<typeof setInterval> | undefined
    let poller: ReturnType<typeof setInterval> | undefined

    const buildSseError = () => {
      const detail = sseError?.message ? `\n${sseError.message}` : ""
      return new Error(
        `Impossible de recevoir le flux du serveur OpenCode (${this.baseUrl}). Vérifie qu'il est lancé.${detail}`,
      )
    }

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
          if (watchdog) clearInterval(watchdog)
          if (poller) clearInterval(poller)
          sseAbort.abort()
          void events?.return(undefined)
          void globalEvents?.return(undefined)
          try {
            controller.close()
          } catch {
            // stream already cancelled
          }
        }

        const fail = (err: unknown) => {
          if (closed) return
          closed = true
          if (watchdog) clearInterval(watchdog)
          if (poller) clearInterval(poller)
          sseAbort.abort()
          void events?.return(undefined)
          void globalEvents?.return(undefined)
          try {
            controller.error(err)
          } catch {
            // stream already cancelled
          }
        }

        const emitStatus = (kind: AiPanelStreamStatus["kind"], seconds: number) => {
          if (lastStatusKind === kind && Math.abs(seconds - lastStatusSeconds) < 10) return
          lastStatusKind = kind
          lastStatusSeconds = seconds
          emit({ t: "status", d: { kind, seconds } })
        }

        const handleQuestionEvent = (props: {
          sessionID?: string
          id?: string
          questions?: AiPanelPendingQuestion["questions"]
        }) => {
          if (props.sessionID !== sessionId || !props.id || !props.questions) return
          if (this.seenQuestions.has(props.id)) return
          this.seenQuestions.add(props.id)
          lastActivity = Date.now()
          this.pendingQuestions.set(props.id, { sessionID: sessionId, questions: props.questions })
          emit({ t: "question", d: { requestID: props.id, questions: props.questions } })
        }

        const handlePermissionEvent = (props: {
          sessionID?: string
          id?: string
          type?: string
          pattern?: string | string[]
          title?: string
        }) => {
          if (props.sessionID !== sessionId || !props.id) return
          if (this.seenPermissions.has(props.id)) return
          this.seenPermissions.add(props.id)
          lastActivity = Date.now()
          const entry: AiPanelPendingPermission = {
            permissionID: props.id,
            title: props.title ?? props.type ?? "permission",
            type: props.type,
            pattern: props.pattern,
          }
          this.pendingPermissions.set(props.id, { sessionID: sessionId, permission: entry })
          emit({ t: "permission", d: entry })
        }

        const pollRequests = async () => {
          if (closed) return
          try {
            const headers: Record<string, string> = { Accept: "application/json" }
            if (this.password) headers.Authorization = `Bearer ${this.password}`
            const res = await fetch(`${this.baseUrl}/permission`, { headers })
            if (res.ok) {
              const list = (await res.json()) as Array<{
                id?: string
                sessionID?: string
                permission?: string
                patterns?: string | string[]
                metadata?: { filepath?: string }
              }>
              for (const item of list) {
                handlePermissionEvent({
                  sessionID: item.sessionID,
                  id: item.id,
                  type: item.permission,
                  pattern: item.patterns,
                  title: item.metadata?.filepath,
                })
              }
            }
            const qres = await fetch(`${this.baseUrl}/question`, { headers })
            if (qres.ok) {
              const qlist = (await qres.json()) as Array<{
                id?: string
                sessionID?: string
                questions?: AiPanelPendingQuestion["questions"]
              }>
              for (const item of qlist) {
                if (item.id && item.sessionID === sessionId && item.questions) {
                  handleQuestionEvent({ sessionID: item.sessionID, id: item.id, questions: item.questions })
                }
              }
            }
          } catch {
            // best-effort polling, never fails the generation
          }
        }

        const consumeEvents = async () => {
          if (!events) return
          const reasoningSeen = new Set<string>()
          try {
            for await (const evt of events) {
              if (closed) return
              eventReceived = true

              if (evt.type === "question.asked") {
                handleQuestionEvent(evt.properties as {
                  sessionID?: string
                  id?: string
                  questions?: AiPanelPendingQuestion["questions"]
                })
                continue
              }

              if (evt.type === "permission.updated") {
                handlePermissionEvent(evt.properties as {
                  sessionID?: string
                  id?: string
                  type?: string
                  pattern?: string | string[]
                  title?: string
                })
                continue
              }

              if (evt.type === "message.part.removed") {
                const props = evt.properties as { sessionID?: string; partID?: string }
                if (props.sessionID === sessionId && props.partID) {
                  this.runningTools.delete(props.partID)
                }
                continue
              }

              if (evt.type === "message.updated") {
                const info = (evt.properties as {
                  info?: Record<string, unknown> & { sessionID?: string; cost?: number; modelID?: string; providerID?: string; tokens?: Record<string, unknown> }
                })?.info
                if (!info || info.sessionID !== sessionId || typeof info.cost !== "number") continue
                lastActivity = Date.now()
                this.lastCost = info.cost
                const rawTokens = info.tokens as Record<string, unknown> | undefined
                const cache = (rawTokens?.cache as Record<string, unknown> | undefined) ?? {}
                this.lastTokens = {
                  input: Number(rawTokens?.input ?? 0),
                  output: Number(rawTokens?.output ?? 0),
                  reasoning: Number(rawTokens?.reasoning ?? 0),
                  cacheRead: Number(cache.read ?? 0),
                  cacheWrite: Number(cache.write ?? 0),
                }
                emit({
                  t: "context",
                  d: {
                    sessionID: sessionId,
                    directory: this.directory,
                    modelID: typeof info.modelID === "string" ? info.modelID : undefined,
                    providerID: typeof info.providerID === "string" ? info.providerID : undefined,
                    cost: info.cost,
                    tokens: this.lastTokens,
                  },
                })
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
                lastActivity = Date.now()
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
              lastActivity = Date.now()
              if (part.type === "reasoning") {
                if (!part.id || reasoningSeen.has(part.id)) continue
                if (part.text) emit({ t: "reasoning", d: part.text, snapshot: true })
                continue
              }
              if (part.type === "tool") {
                if (part.id) {
                  if (part.state?.status === "running") {
                    this.runningTools.set(part.id, {
                      activity: { title: part.title, tool: part.tool, state: "running" },
                      startedAt: Date.now(),
                    })
                  } else {
                    this.runningTools.delete(part.id)
                  }
                }
                emit({ t: "tool", d: { title: part.title, tool: part.tool, state: part.state?.status } })
                continue
              }
            }
            if (!closed && !eventReceived) {
              fail(buildSseError())
            }
          } catch {
            if (!closed && !eventReceived) {
              fail(buildSseError())
            }
          }
        }

        const consumeGlobalEvents = async () => {
          if (!globalEvents) return
          try {
            for await (const evt of globalEvents) {
              if (closed) return
              const envelope = evt as {
                directory?: string
                payload?: { type?: string; properties?: Record<string, unknown> }
              }
              const payload = envelope?.payload
              if (!payload?.type) continue
              if (payload.type === "permission.updated") {
                handlePermissionEvent(payload.properties as {
                  sessionID?: string
                  id?: string
                  type?: string
                  pattern?: string | string[]
                  title?: string
                })
              } else if (payload.type === "question.asked") {
                handleQuestionEvent(payload.properties as {
                  sessionID?: string
                  id?: string
                  questions?: AiPanelPendingQuestion["questions"]
                })
              }
            }
          } catch {
            // safety net stream: never fail the generation because of it
          }
        }

        const consumePrompt = async () => {
          try {
            const result = await Promise.race([
              promptPromise,
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error("Délai d'attente dépassé pour la réponse du serveur OpenCode")), PROMPT_TIMEOUT_MS),
              ),
            ])
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

        emitStatus("connecting", 0)
        poller = setInterval(() => {
          void pollRequests()
        }, 2000)
        watchdog = setInterval(() => {
          if (closed) {
            if (watchdog) clearInterval(watchdog)
            return
          }
          const elapsed = Math.floor((Date.now() - lastActivity) / 1000)
          const total = Math.floor((Date.now() - startedAt) / 1000)
          if (!eventReceived) {
            emitStatus("waiting", total)
          } else if (this.pendingPermissions.size > 0 || this.pendingQuestions.size > 0) {
            emitStatus("waiting", total)
          } else if (elapsed >= STALL_SECONDS) {
            if (this.runningTools.size > 0) {
              emitStatus("tool", elapsed)
            } else {
              emitStatus("stalled", elapsed)
            }
          }
        }, HEARTBEAT_INTERVAL_MS)

        void consumeEvents()
        void consumeGlobalEvents()
        await consumePrompt()
        close()
      },
      cancel: async () => {
        closed = true
        if (watchdog) clearInterval(watchdog)
        if (poller) clearInterval(poller)
        sseAbort.abort()
        try {
          await this.client.session.abort({ path: { id: sessionId } })
        } catch {
          // ignore
        }
      },
    })
  }
}
