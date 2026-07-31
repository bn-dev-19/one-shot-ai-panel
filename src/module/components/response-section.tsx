"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Bot, Loader2, AlertTriangle, Sparkles, CircleCheck, CircleX, Brain, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "./empty-state"
import { DiffSection } from "./diff-section"
import { formatJson } from "../lib/utils"
import type { AiPanelLabels, AiPanelResponse, AiPanelInvalidMode, AiPanelTicket } from "../types"
import { AiPanelStatus } from "../types"

interface ResponseSectionProps {
  labels: AiPanelLabels
  status: AiPanelStatus
  response: AiPanelResponse | null
  streamingText: string
  streamingReasoning?: string
  invalidMode?: AiPanelInvalidMode
  tickets?: AiPanelTicket[]
  onPlug?: (response: AiPanelResponse, selectedKeys?: string[]) => void
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

function defaultSelectedKeys(response: AiPanelResponse | null, tickets: AiPanelTicket[]): string[] {
  if (!response?.parsed) return []
  const parsed = response.parsed
  const known = new Set(tickets.map((t) => t.key))
  const keys: string[] = []
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const itemKeys = Object.keys(item as Record<string, unknown>)
        if (itemKeys.length === 1 && known.has(itemKeys[0])) keys.push(itemKeys[0])
      }
    }
  } else if (parsed && typeof parsed === "object") {
    for (const key of Object.keys(parsed)) {
      if (known.has(key)) keys.push(key)
    }
  }
  return keys
}

export function ResponseSection({
  labels, status, response, streamingText, streamingReasoning = "", invalidMode = "warn", tickets = [], onPlug,
}: ResponseSectionProps) {
  const isLoading = status === AiPanelStatus.Loading
  const isStreaming = status === AiPanelStatus.Streaming
  const isError = status === AiPanelStatus.Error
  const isDone = status === AiPanelStatus.Done
  const isBusy = isLoading || isStreaming
  const validation = response?.validation
  const plugBlocked = invalidMode === "block" && !!validation && !validation.ok

  const rawDisplay = streamingText || response?.raw || ""
  const displayText = useMemo(() => formatJson(rawDisplay), [rawDisplay])

  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const [prevBusy, setPrevBusy] = useState(false)
  const [reasoningOpen, setReasoningOpen] = useState(true)

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [prevResponse, setPrevResponse] = useState<AiPanelResponse | null>(null)

  if (isBusy && !prevBusy) {
    setElapsed(0)
  }
  if (prevBusy !== isBusy) {
    setPrevBusy(isBusy)
  }
  if (response !== prevResponse) {
    setPrevResponse(response)
    setSelectedKeys(defaultSelectedKeys(response, tickets))
  }

  useEffect(() => {
    if (!isBusy) {
      startTimeRef.current = null
      return
    }
    startTimeRef.current = startTimeRef.current ?? Date.now()
    const id = setInterval(() => {
      if (startTimeRef.current !== null) setElapsed(Date.now() - startTimeRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [isBusy])

  const handleToggle = useCallback((key: string) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedKeys(defaultSelectedKeys(response, tickets))
  }, [response, tickets])

  const handleDeselectAll = useCallback(() => {
    setSelectedKeys([])
  }, [])

  const showDiff = isDone && !!response?.parsed && !!onPlug

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-2">
        <Bot className="size-3" />
        <span className="font-semibold text-foreground flex-1">{labels.response}</span>
        {isBusy && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {isLoading ? labels.generating : `⏱ ${formatElapsed(elapsed)}`}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 p-3 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>{labels.generating}</span>
        </div>
      ) : isError ? (
        <div className="border border-red-500/20 rounded-md p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-red-500">
            <AlertTriangle className="size-3.5" />
            <span className="font-semibold text-xs">{labels.error}</span>
          </div>
          <p className="text-xs text-red-500/80">{response?.error}</p>
        </div>
      ) : (
        <>
          {streamingReasoning && (
            <div className="mb-2 border border-muted rounded-md">
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <Brain className="size-3 text-muted-foreground" />
                <span className="font-semibold text-foreground flex-1">{labels.reasoning}</span>
                <span className="text-xs text-muted-foreground tabular-nums">⏱ {formatElapsed(elapsed)}</span>
                <button
                  type="button"
                  onClick={() => setReasoningOpen((v) => !v)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={reasoningOpen ? labels.hide : labels.show}
                >
                  {reasoningOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                </button>
              </div>
              {reasoningOpen && (
                <pre className="text-xs font-mono bg-muted/50 p-2 rounded-b-md overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {streamingReasoning}
                  {isStreaming && <span className="animate-pulse">▊</span>}
                </pre>
              )}
            </div>
          )}

          {showDiff && response && (
            <DiffSection
              labels={labels}
              response={response}
              tickets={tickets}
              selectedKeys={selectedKeys}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          )}

          {displayText ? (
            <>
              <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {displayText}
                {isStreaming && <span className="animate-pulse">▊</span>}
              </pre>
              {isDone && validation && (
                <div className="mt-2 space-y-1">
                  {validation.ok ? (
                    <p className="flex items-center gap-1.5 text-xs text-green-600">
                      <CircleCheck className="size-3.5 shrink-0" />
                      <span className="font-semibold">{labels.responseValid}</span>
                    </p>
                  ) : (
                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                      <CircleX className="size-3.5 shrink-0" />
                      <span className="font-semibold">{labels.responseInvalid}</span>
                    </p>
                  )}
                </div>
              )}
              {isDone && onPlug && (
                <Button
                  variant="secondary"
                  size="default"
                  disabled={plugBlocked}
                  onClick={() => response && onPlug(response, selectedKeys)}
                  className="mt-2 w-full gap-1"
                >
                  <Sparkles className="size-3" />
                  {showDiff ? `${labels.plugSelected} (${selectedKeys.length})` : labels.plugLabel}
                </Button>
              )}
            </>
          ) : isStreaming ? (
            <div className="flex items-center gap-2 p-3 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              <span>{labels.generating}</span>
            </div>
          ) : (
            <EmptyState
              icon={<Sparkles className="size-5" />}
              title={labels.noResponse}
              description={labels.noResponseDesc}
              className="border"
            />
          )}
        </>
      )}
    </section>
  )
}
