"use client"

import { useState } from "react"
import { Check, X, Minus, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import type { AiPanelLabels, AiPanelContextFile, AiPanelTicket } from "../types"

interface StatusBarProps {
  labels: AiPanelLabels
  promptPresent: boolean
  userPromptPresent: boolean
  additionalContextPresent: boolean
  files?: AiPanelContextFile[]
  tickets?: AiPanelTicket[]
  hasFeedback: boolean
}

function scoreSegment(label: string, ok: boolean, required: boolean, warning = false) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? (
        <Check className="size-3 text-green-500 shrink-0" />
      ) : warning ? (
        <AlertTriangle className="size-3 text-orange-500 shrink-0" />
      ) : required ? (
        <X className="size-3 text-red-500 shrink-0" />
      ) : (
        <Minus className="size-3 text-muted-foreground shrink-0" />
      )}
      <span className={ok ? "text-foreground" : warning ? "text-orange-500" : required ? "text-red-500" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  )
}

export function StatusBar({ labels, promptPresent, userPromptPresent, additionalContextPresent, files, tickets, hasFeedback }: StatusBarProps) {
  const [showStatus, setShowStatus] = useState(false)

  const enabledFiles = (files ?? []).filter((f) => f.enabled !== false)
  const hasPresentFiles = enabledFiles.some((f) => f.present)
  const filesOk = enabledFiles.length === 0 || hasPresentFiles
  const filesWarning = enabledFiles.length > 0 && !hasPresentFiles
  const enabledTickets = (tickets ?? []).filter((t) => t.enabled !== false)
  const hasActiveTickets = enabledTickets.some((t) => !t.done)
  const ticketsOk = enabledTickets.length === 0 || hasActiveTickets

  const scoreOk = [
    promptPresent,
    userPromptPresent,
    additionalContextPresent,
    filesOk,
    ticketsOk,
    !hasFeedback,
  ]
  const scoreCount = scoreOk.filter(Boolean).length
  const scoreTotal = scoreOk.length

  const requiredOk = promptPresent && filesOk && ticketsOk
  const globalColor = requiredOk ? "text-green-500" : "text-red-500"

  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {labels.status}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowStatus(!showStatus)}
          className="h-6 gap-1 px-2"
        >
          {showStatus ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
          <span className="text-xs">{showStatus ? labels.hide : labels.show}</span>
        </Button>
      </div>
      {showStatus && (
        <div className="px-4 pb-2 space-y-1 text-xs">
          {scoreSegment(labels.statusSystemPrompt, promptPresent, true)}
          {scoreSegment(labels.statusUserPrompt, userPromptPresent, false)}
          {scoreSegment(labels.statusAdditionalContext, additionalContextPresent, false)}
          {scoreSegment(labels.statusFiles, filesOk, enabledFiles.length > 0, filesWarning)}
          {scoreSegment(labels.statusTickets, ticketsOk, enabledTickets.length > 0)}
          {scoreSegment(labels.statusFeedback, !hasFeedback, false, hasFeedback)}
          <div className={cn("pt-1 font-semibold", globalColor)}>
            {labels.score} : {scoreCount}/{scoreTotal}
          </div>
        </div>
      )}
    </div>
  )
}
