"use client"

import { useState, useCallback, useRef } from "react"
import type {
  AiPanelResponse,
  AiPanelContextFile,
  AiPanelTicket,
  AiPanelLabels,
  AiPanelResponseParser,
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
  send: (fullPrompt: string, activeTickets?: AiPanelTicket[]) => Promise<void>
  cancel: () => void
  reset: () => void
}

export function useAiPanel(options: UseAiPanelOptions): UseAiPanelReturn {
  const { sendHandler, labels, parser } = options
  const [status, setStatus] = useState<AiPanelStatus>(AiPanelStatus.Idle)
  const [response, setResponse] = useState<AiPanelResponse | null>(null)
  const streaming = useStreaming()
  const sendInFlight = useRef(false)
  const activeTicketsRef = useRef<AiPanelTicket[] | undefined>(undefined)

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

  const send = useCallback(async (
    fullPrompt: string,
    activeTickets?: AiPanelTicket[],
  ) => {
    if (!sendHandler || sendInFlight.current) return

    sendInFlight.current = true
    activeTicketsRef.current = activeTickets
    setStatus(AiPanelStatus.Loading)
    setResponse(null)
    streaming.reset()

    try {
      const stream = await sendHandler(fullPrompt)

      if (!stream) {
        throw new Error(labels?.errorNoStream ?? defaultLabels.errorNoStream)
      }

      setStatus(AiPanelStatus.Streaming)
      streaming.start(stream, handleComplete, handleStreamError)
    } catch (err) {
      const msg = err instanceof Error ? err.message : (labels?.errorUnknown ?? defaultLabels.errorUnknown)
      setStatus(AiPanelStatus.Error)
      setResponse({ raw: "", error: msg })
      sendInFlight.current = false
    }
  }, [sendHandler, streaming, handleComplete, handleStreamError, labels])

  const cancel = useCallback(() => {
    streaming.cancel()
    setStatus(AiPanelStatus.Idle)
    sendInFlight.current = false
  }, [streaming])

  const reset = useCallback(() => {
    streaming.reset()
    setStatus(AiPanelStatus.Idle)
    setResponse(null)
    sendInFlight.current = false
  }, [streaming])

  return {
    status,
    response: streaming.text && status === AiPanelStatus.Streaming ? { raw: streaming.text } : response,
    streamingText: streaming.text,
    streamingReasoning: streaming.reasoning,
    send,
    cancel,
    reset,
  }
}
