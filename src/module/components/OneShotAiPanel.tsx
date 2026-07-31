"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { Bot, Sparkles, Eye, Copy, Check } from "lucide-react"
import { cn } from "../lib/utils"
import { AiPanelLanguage, translations } from "../i18n"
import { useAiPanel } from "../hooks/useAiPanel"
import { buildSend, registerDefaultAdapters } from "../adapters"
import type { AiPanelSendHandler } from "../adapters/types"
import type {
  AiPanelLabels, AiPanelResponse,
  AiPanelContextFile, AiPanelTicket,
  AiPanelResponseParser, AiPanelResponseValidation,
} from "../types"
import { AiPanelStatus, AiPanelInvalidMode } from "../types"
import type { AiAdapterConfig } from "../adapters"
import { LoadingButton } from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { StatusBar } from "./status-bar"
import { PromptSection } from "./prompt-section"
import { FilesSection } from "./files-section"
import { TicketsSection } from "./tickets-section"
import { ResponseSection } from "./response-section"
import { FeedbackSection } from "./feedback-section"
import { ConfigSheet } from "./config-sheet"
import { InfoSheet } from "./info-sheet"

registerDefaultAdapters()

export interface OneShotAiPanelProps {
  title?: string
  systemPrompt?: string
  initialUserPrompt?: string
  files?: AiPanelContextFile[]
  tickets?: AiPanelTicket[]
  actionLabel?: string
  language?: AiPanelLanguage
  labels?: Partial<AiPanelLabels>
  onPlug?: (response: AiPanelResponse, selectedKeys?: string[]) => void
  children?: React.ReactNode
  className?: string

  adapter?: AiAdapterConfig
  onSend?: AiPanelSendHandler
  parser?: AiPanelResponseParser
  invalidMode?: AiPanelInvalidMode
  showInfoIntegration?: boolean
  showInfoCredits?: boolean
  showInfoButton?: boolean
  showSettingsButton?: boolean
}

function assembleFullPrompt(
  labels: AiPanelLabels,
  systemPrompt: string,
  userPrompt: string,
  additionalContext: string,
  resolvedFiles: (AiPanelContextFile & { enabled: boolean })[],
  resolvedTickets: (AiPanelTicket & { enabled: boolean })[],
  feedback: AiPanelResponseValidation | null,
  includeFeedback: boolean,
): string {
  const parts: string[] = []

  if (systemPrompt) parts.push(systemPrompt)

  const ctxParts: string[] = []
  const enabledFiles = resolvedFiles.filter((f) => f.enabled && f.present)
  if (enabledFiles.length > 0) {
    ctxParts.push(labels.promptSectionFiles)
    for (const f of enabledFiles) {
      ctxParts.push(f.path ? `[${f.label}] → ${f.path}` : `[${f.label}]`)
    }
  }

  const enabledTickets = resolvedTickets.filter((t) => t.enabled && !t.done)
  if (enabledTickets.length > 0) {
    ctxParts.push(labels.promptSectionTickets)
    for (const t of enabledTickets) {
      let line = `[${t.label}]`
      if (t.description) line += `\n${labels.ticketDescription} : ${t.description}`
      if (t.explication) line += `\n${labels.ticketExplanation} : ${t.explication}`
      line += `\n${labels.responseSchema} :\n\`\`\`json\n${JSON.stringify(t.responseSchema, null, 2)}\n\`\`\``
      if (t.existingContent) {
        const serialized = typeof t.existingContent === "string" ? t.existingContent : JSON.stringify(t.existingContent, null, 2)
        line += `\n${labels.ticketExistingContent} :\n\`\`\`\n${serialized}\n\`\`\``
      } else {
        line += `\n${labels.ticketNoExistingContent}`
      }
      ctxParts.push(line)
    }
    ctxParts.push(labels.responseFormatInstruction)
  }

  if (includeFeedback && feedback && !feedback.ok) {
    ctxParts.push(`${labels.promptSectionFeedback}\n${labels.feedbackDescription}`)
    for (const err of feedback.errors) {
      ctxParts.push(`- ${err}`)
    }
    for (const ticketErr of feedback.ticketErrors ?? []) {
      ctxParts.push(`- [${ticketErr.ticketKey}] :`)
      for (const err of ticketErr.errors) {
        ctxParts.push(`  - ${err}`)
      }
    }
  }

  if (ctxParts.length > 0) parts.push(ctxParts.join("\n"))
  if (userPrompt) parts.push(`${labels.promptSectionUserPrompt}\n${userPrompt}`)
  if (additionalContext) parts.push(`${labels.promptSectionAdditionalContext}\n${additionalContext}`)

  return parts.join("\n\n")
}

export function OneShotAiPanel({
  title,
  systemPrompt: systemPromptProp,
  initialUserPrompt,
  files,
  tickets,
  actionLabel,
  language = AiPanelLanguage.Fr,
  labels: labelsProp,
  onPlug,
  children,
  className,
  adapter,
  onSend,
  parser,
  invalidMode: invalidModeProp = AiPanelInvalidMode.Warn,
  showInfoIntegration = true,
  showInfoCredits = true,
  showInfoButton = true,
  showSettingsButton = true,
}: OneShotAiPanelProps) {
  const [currentLanguage, setCurrentLanguage] = useState<AiPanelLanguage>(language)
  const labels = useMemo(() => ({ ...translations[currentLanguage], ...labelsProp }), [currentLanguage, labelsProp])
  const [currentAdapter, setCurrentAdapter] = useState<AiAdapterConfig | undefined>(adapter)
  const [invalidMode, setInvalidMode] = useState<AiPanelInvalidMode>(invalidModeProp)
  const [systemPrompt, setSystemPrompt] = useState(systemPromptProp ?? "")
  const [userPrompt, setUserPrompt] = useState(initialUserPrompt ?? "")
  const [additionalContext, setAdditionalContext] = useState("")
  const [fileEnabled, setFileEnabled] = useState<Record<string, boolean>>({})
  const [ticketEnabled, setTicketEnabled] = useState<Record<string, boolean>>({})
  const [customFiles, setCustomFiles] = useState<AiPanelContextFile[]>([])
  const customIdRef = useRef(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [feedbackEnabled, setFeedbackEnabled] = useState(true)

  const activeConfig = useMemo(() => {
    if (currentAdapter && "enabled" in currentAdapter && !currentAdapter.enabled) return undefined
    return currentAdapter
  }, [currentAdapter])

  const sendHandler = useMemo<AiPanelSendHandler | undefined>(() => {
    if (onSend) return onSend
    if (!activeConfig) return undefined
    try {
      return buildSend(activeConfig)
    } catch {
      return undefined
    }
  }, [onSend, activeConfig])

  const { status, response, streamingText, streamingReasoning, send, cancel, reset } = useAiPanel({
    sendHandler,
    files,
    tickets,
    labels,
    parser,
  })

  const feedback = response?.validation && !response.validation.ok ? response.validation : null

  const allFiles = useMemo(() => [...(files ?? []), ...customFiles], [files, customFiles])

  const resolvedFiles = useMemo(() => allFiles.map((f) => ({
    ...f,
    enabled: fileEnabled[f.key] ?? f.enabled ?? true,
  })), [allFiles, fileEnabled])

  const resolvedTickets = useMemo(() => (tickets ?? []).map((t) => ({
    ...t,
    enabled: ticketEnabled[t.key] ?? t.enabled ?? true,
  })), [tickets, ticketEnabled])

  const promptPresent = !!systemPrompt

  const isBusy = status === AiPanelStatus.Loading || status === AiPanelStatus.Streaming

  const fullPrompt = useMemo(() => assembleFullPrompt(
    labels, systemPrompt, userPrompt, additionalContext, resolvedFiles, resolvedTickets, feedback, feedbackEnabled,
  ), [labels, systemPrompt, userPrompt, additionalContext, resolvedFiles, resolvedTickets, feedback, feedbackEnabled])

  const handleAction = () => {
    if (isBusy) {
      cancel()
      return
    }
    reset()
    const activeTickets = resolvedTickets.filter((t) => t.enabled && !t.done)
    send(fullPrompt, activeTickets)
  }

  const handleAddCustomFile = useCallback((path: string) => {
    customIdRef.current += 1
    const key = `_custom-${customIdRef.current}`
    const label = path.split("/").filter(Boolean).pop() ?? path
    setCustomFiles((prev) => [...prev, { key, label, present: true, enabled: true, path }])
  }, [])

  const handleRemoveCustomFile = useCallback((key: string) => {
    setCustomFiles((prev) => prev.filter((f) => f.key !== key))
    setFileEnabled((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(fullPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [fullPrompt])

  return (
    <div className={cn("flex flex-col h-full divide-y", className)}>
      <div className="flex items-center justify-between gap-2 px-4  py-3 border-b shrink-0">
        <div className="w-full flex items-center gap-2">
          <Bot className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex-1">
            {title ?? labels.title}
          </span>
        </div>
        <div className="flex items-end gap-1">
          {showInfoButton && (
            <InfoSheet labels={labels} showIntegration={showInfoIntegration} showCredits={showInfoCredits} />
          )}
          {showSettingsButton && (
            <ConfigSheet
              labels={labels}
              language={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              adapter={currentAdapter}
              onAdapterChange={setCurrentAdapter}
              invalidMode={invalidMode}
              onInvalidModeChange={setInvalidMode}
            />
          )}
        </div>
      </div>

        <StatusBar
          labels={labels}
          promptPresent={promptPresent}
          userPromptPresent={userPrompt.trim().length > 0}
          additionalContextPresent={additionalContext.trim().length > 0}
          files={resolvedFiles}
          tickets={resolvedTickets}
          hasFeedback={feedback !== null}
        />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-4 text-xs text-muted-foreground">
        <PromptSection
          labels={labels}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
          userPrompt={userPrompt}
          onUserPromptChange={setUserPrompt}
          additionalContext={additionalContext}
          onAdditionalContextChange={setAdditionalContext}
        />

        <FilesSection
          labels={labels}
          files={allFiles}
          resolvedFiles={resolvedFiles}
          customFileKeys={new Set(customFiles.map((f) => f.key))}
          onToggleFile={(key) => setFileEnabled((prev) => ({ ...prev, [key]: !(prev[key] ?? allFiles.find((f) => f.key === key)?.enabled ?? true) }))}
          onAddCustomFile={handleAddCustomFile}
          onRemoveCustomFile={handleRemoveCustomFile}
        />

        <TicketsSection
          labels={labels}
          tickets={tickets ?? []}
          resolvedTickets={resolvedTickets}
          onToggleTicket={(key) => setTicketEnabled((prev) => ({ ...prev, [key]: !(prev[key] ?? tickets?.find((t) => t.key === key)?.enabled ?? true) }))}
        />

        <ResponseSection
          labels={labels}
          status={status}
          response={response}
          streamingText={streamingText}
          streamingReasoning={streamingReasoning}
          tickets={resolvedTickets}
          onPlug={onPlug}
          invalidMode={invalidMode}
        />

        <FeedbackSection
          labels={labels}
          feedback={feedback}
          enabled={feedbackEnabled}
          onToggleEnabled={setFeedbackEnabled}
        />

        {children}
      </div>

      <div className="px-4 py-3 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="default"
            onClick={() => setPreviewOpen(true)}
            className="gap-1"
          >
            <Eye className="size-3" />
            {labels.viewPrompt}
          </Button>
          <LoadingButton
            label={isBusy ? labels.cancel : (actionLabel ?? labels.actionLabel)}
            loading={isBusy}
            disableOnLoading={false}
            onClick={handleAction}
            size="default"
          >
            <Sparkles className="size-3.5" />
          </LoadingButton>
        </div>
      </div>

      <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
        <SheetContent side="right" className="w-[480px] sm:w-[540px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-3 shrink-0 border-b space-y-1">
              <SheetTitle className="text-sm">{labels.promptPreview}</SheetTitle>
              <p className="text-xs text-muted-foreground">{fullPrompt.length} {labels.promptCharCount}</p>
              <Button variant="secondary" size="sm" onClick={handleCopy} className="gap-1 h-7">
                {copied ? <Check className="size-3 text-green-500" /> : <Copy className="size-3" />}
                <span className="text-xs">{copied ? labels.promptCopied : labels.copyPrompt}</span>
              </Button>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto no-scrollbar p-4">
              <p className="text-xs whitespace-pre-wrap break-words leading-relaxed">
                {fullPrompt || "—"}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
