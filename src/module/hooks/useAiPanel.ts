"use client"

import { useState, useCallback, useRef } from "react"
import type {
  AiPanelResponse,
  AiPanelContextFile,
  AiPanelTicket,
  AiPanelLabels,
  AiPanelResponseParser,
  AiPanelPendingQuestion,
  AiPanelPendingPermission,
  AiPanelPermissionResponse,
  AiPanelToolActivity,
  AiPanelContextInfo,
  AiPanelStreamStatus,
} from "../types"
import { AiPanelStatus } from "../types"
import type { AiPanelSendHandler } from "../adapters/types"
import { useStreaming } from "./useStreaming"
import { extractJson, validateTicketsResponse } from "../lib/validate"
import { defaultLabels } from "../lib/defaults"

export interface UseAiPanelOptions {
  sendHandler?: AiPanelSendHandler
  files?: AiPanelContextFile[]
  tickets?: AiPanelTicket[]
  labels?: AiPanelLabels
  parser?: AiPanelResponseParser
}

export interface UseAiPanelReturn {
  status: AiPanelStatus
  response: AiPanelResponse | null
  streamingText: string
  streamingReasoning: string
  contextInfo: AiPanelContextInfo | null
  streamStatus: AiPanelStreamStatus | null
  pendingQuestions: AiPanelPendingQuestion[]
  pendingPermissions: AiPanelPendingPermission[]
  toolActivity: AiPanelToolActivity | null
  replyQuestion: (requestID: string, answers: string[][]) => Promise<void>
  rejectQuestion: (requestID: string) => Promise<void>
  decidePermission: (permissionID: string, response: AiPanelPermissionResponse) => Promise<void>
  send: (fullPrompt: string, activeTickets?: AiPanelTicket[]) => Promise<void>
  cancel: () => void
  reset: () => void
  renewSession: () => Promise<void>
}

export function useAiPanel(options: UseAiPanelOptions): UseAiPanelReturn {
  const { sendHandler, labels, parser, files } = options
  const [status, setStatus] = useState<AiPanelStatus>(AiPanelStatus.Idle)
  const [response, setResponse] = useState<AiPanelResponse | null>(null)
  const [pendingQuestions, setPendingQuestions] = useState<AiPanelPendingQuestion[]>([])
  const [pendingPermissions, setPendingPermissions] = useState<AiPanelPendingPermission[]>([])
  const [toolActivity, setToolActivity] = useState<AiPanelToolActivity | null>(null)
  const [contextInfo, setContextInfo] = useState<AiPanelContextInfo | null>(null)
  const [streamStatus, setStreamStatus] = useState<AiPanelStreamStatus | null>(null)
  const streaming = useStreaming()
  const sendInFlight = useRef(false)
  const activeTicketsRef = useRef<AiPanelTicket[] | undefined>(undefined)
  const adapter = (sendHandler as AiPanelSendHandler | undefined)?.adapter

  const handleComplete = useCallback((raw: string) => {
    const activeTickets = activeTicketsRef.current
    let parsed: Record<string, unknown> | undefined
    let validation: AiPanelResponse["validation"]

    if (parser) {
      const result = parser(raw)
      parsed = result.parsed
      validation = result.validation
    } else if (activeTickets && activeTickets.length > 0 && labels) {
      const result = validateTicketsResponse(raw, activeTickets, labels)
      parsed = result.parsed
      validation = result.validation
    } else {
      const extracted = extractJson(raw)
      parsed = extracted !== null ? (extracted as Record<string, unknown>) : undefined
    }

    setStatus(AiPanelStatus.Done)
    setResponse({ raw, parsed, validation })
    sendInFlight.current = false
  }, [parser, labels])

  const handleStreamError = useCallback((error: unknown) => {
    const message = error instanceof Error && error.message
      ? error.message
      : (labels?.errorStreaming ?? defaultLabels.errorStreaming)
    setStatus(AiPanelStatus.Error)
    setResponse({ raw: "", error: message })
    sendInFlight.current = false
  }, [labels])

  const handleQuestion = useCallback((q: AiPanelPendingQuestion) => {
    setPendingQuestions((prev) => (prev.some((p) => p.requestID === q.requestID) ? prev : [...prev, q]))
  }, [])

  const handlePermission = useCallback((p: AiPanelPendingPermission) => {
    setPendingPermissions((prev) => (prev.some((x) => x.permissionID === p.permissionID) ? prev : [...prev, p]))
  }, [])

  const handleTool = useCallback((t: AiPanelToolActivity) => {
    setToolActivity(t)
  }, [])

  const handleContext = useCallback((c: AiPanelContextInfo) => {
    setContextInfo(c)
  }, [])

  const handleStatus = useCallback((s: AiPanelStreamStatus) => {
    setStreamStatus(s)
  }, [])

  const replyQuestion = useCallback(async (requestID: string, answers: string[][]) => {
    if (adapter?.replyQuestion) {
      try {
        await adapter.replyQuestion(requestID, answers)
      } catch {
        // ignore
      }
    }
    setPendingQuestions((prev) => prev.filter((q) => q.requestID !== requestID))
  }, [adapter])

  const rejectQuestion = useCallback(async (requestID: string) => {
    if (adapter?.rejectQuestion) {
      try {
        await adapter.rejectQuestion(requestID)
      } catch {
        // ignore
      }
    }
    setPendingQuestions((prev) => prev.filter((q) => q.requestID !== requestID))
  }, [adapter])

  const decidePermission = useCallback(async (permissionID: string, response: AiPanelPermissionResponse) => {
    if (adapter?.replyPermission) {
      try {
        await adapter.replyPermission(permissionID, response)
        setPendingPermissions((prev) => prev.filter((p) => p.permissionID !== permissionID))
      } catch (err) {
        const message = err instanceof Error && err.message
          ? err.message
          : (labels?.errorStreaming ?? defaultLabels.errorStreaming)
        setStatus(AiPanelStatus.Error)
        setResponse({ raw: "", error: message })
      }
      return
    }
    setPendingPermissions((prev) => prev.filter((p) => p.permissionID !== permissionID))
  }, [adapter, labels])

  const send = useCallback(async (
    fullPrompt: string,
    activeTickets?: AiPanelTicket[],
  ) => {
    if (!sendHandler || sendInFlight.current) return

    sendInFlight.current = true
    activeTicketsRef.current = activeTickets
    setStatus(AiPanelStatus.Loading)
    setResponse(null)
    setPendingQuestions([])
    setPendingPermissions([])
    setToolActivity(null)
    setContextInfo(null)
    setStreamStatus(null)
    streaming.reset()

    try {
      const enabledFiles = (files ?? []).filter((f) => f.enabled !== false && f.present)
      const stream = await sendHandler(fullPrompt, { files: enabledFiles })

      if (!sendInFlight.current) {
        // cancelled while the stream was being established
        try {
          await adapter?.cancel?.()
        } catch {
          // ignore
        }
        return
      }

      if (!stream) {
        throw new Error(labels?.errorNoStream ?? defaultLabels.errorNoStream)
      }

      setStatus(AiPanelStatus.Streaming)
      streaming.start(stream, {
        onComplete: handleComplete,
        onError: handleStreamError,
        onQuestion: handleQuestion,
        onPermission: handlePermission,
        onTool: handleTool,
        onContext: handleContext,
        onStatus: handleStatus,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : (labels?.errorUnknown ?? defaultLabels.errorUnknown)
      setStatus(AiPanelStatus.Error)
      setResponse({ raw: "", error: msg })
      sendInFlight.current = false
    }
  }, [sendHandler, streaming, handleComplete, handleStreamError, handleQuestion, handlePermission, handleTool, handleContext, handleStatus, labels, files, adapter])

  const cancel = useCallback(() => {
    if (adapter?.cancel) {
      void adapter.cancel()
    }
    streaming.cancel()
    setStatus(AiPanelStatus.Idle)
    sendInFlight.current = false
  }, [streaming, adapter])

  const renewSession = useCallback(async () => {
    if (adapter?.renewSession) {
      await adapter.renewSession()
    }
    const info = adapter?.getContextInfo?.()
    setContextInfo(info ?? null)
  }, [adapter])

  const reset = useCallback(() => {
    streaming.reset()
    setStatus(AiPanelStatus.Idle)
    setResponse(null)
    setPendingQuestions([])
    setPendingPermissions([])
    setToolActivity(null)
    sendInFlight.current = false
  }, [streaming])

  return {
    status,
    response: streaming.text && status === AiPanelStatus.Streaming ? { raw: streaming.text } : response,
    streamingText: streaming.text,
    streamingReasoning: streaming.reasoning,
    contextInfo,
    streamStatus,
    pendingQuestions,
    pendingPermissions,
    toolActivity,
    replyQuestion,
    rejectQuestion,
    decidePermission,
    send,
    cancel,
    reset,
    renewSession,
  }
}
