"use client"

import { useState } from "react"
import { Plus, Minus, ArrowRight, AlertTriangle, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "../lib/utils"
import { DiffDialog } from "./diff-dialog"
import { diffJson, diffStatus, formatValue, isEmptyValue, type DiffChange } from "../lib/diff"
import type { AiPanelLabels, AiPanelResponse, AiPanelTicket } from "../types"

interface DiffSectionProps {
  labels: AiPanelLabels
  response: AiPanelResponse
  tickets: AiPanelTicket[]
  selectedKeys: string[]
  onToggle: (key: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

interface ReviewEntry {
  key: string
  value: unknown
  label: string
  unknown: boolean
  changes: DiffChange[]
  status: ReturnType<typeof diffStatus>
  errors?: string[]
}

function normalizeEntries(response: AiPanelResponse): { key: string; value: unknown }[] {
  const parsed = response.parsed
  if (Array.isArray(parsed)) {
    return parsed.flatMap((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const keys = Object.keys(item as Record<string, unknown>)
        if (keys.length === 1) return [{ key: keys[0], value: (item as Record<string, unknown>)[keys[0]] }]
        return keys.map((key) => ({ key, value: (item as Record<string, unknown>)[key] }))
      }
      return []
    })
  }
  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed).map(([key, value]) => ({ key, value }))
  }
  return []
}

function statusStyles(status: ReviewEntry["status"]): string {
  switch (status) {
    case "added":
      return "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400"
    case "removed":
      return "border-red-500/30 bg-red-500/5 text-red-500"
    case "modified":
      return "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"
    default:
      return "border-border bg-muted/40 text-muted-foreground"
  }
}

function statusLabel(status: ReviewEntry["status"], labels: AiPanelLabels): string {
  switch (status) {
    case "added":
      return labels.diffAdded
    case "removed":
      return labels.diffRemoved
    case "modified":
      return labels.diffModified
    default:
      return labels.diffIdentical
  }
}

function renderValue(value: unknown, labels: AiPanelLabels): string {
  if (isEmptyValue(value)) return labels.diffEmptyValue
  return formatValue(value)
}

export function DiffSection({
  labels,
  response,
  tickets,
  selectedKeys,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: DiffSectionProps) {
  const ticketErrors = response.validation?.ticketErrors ?? []

  const [openKey, setOpenKey] = useState<string | null>(null)

  const entries = normalizeEntries(response).map<ReviewEntry>(({ key, value }) => {
    const ticket = tickets.find((t) => t.key === key)
    const changes = diffJson(ticket?.existingContent, value)
    return {
      key,
      value,
      label: ticket?.label ?? key,
      unknown: !ticket,
      changes,
      status: diffStatus(changes),
      errors: ticketErrors.find((te) => te.ticketKey === key)?.errors,
    }
  })

  const openEntry = entries.find((e) => e.key === openKey) ?? null

  return (
    <div className="mb-2 border border-muted rounded-md">
      <div className="px-2 py-1.5 border-b border-muted/60 space-y-3">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground flex-1">{labels.reviewTitle}</span>
          <button
            type="button"
            onClick={onSelectAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {labels.diffSelectAll}
          </button>
          <span className="text-muted-foreground/50">·</span>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {labels.diffDeselectAll}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{labels.reviewDescription}</p>
      </div>

      <div className="divide-y divide-muted/60">
        {entries.length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">{labels.diffNoChanges}</p>
        ) : (
          entries.map((entry) => {
            const selected = selectedKeys.includes(entry.key)
            return (
              <div key={entry.key} className="px-2 py-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`diff-${entry.key}`}
                    checked={selected}
                    onCheckedChange={() => onToggle(entry.key)}
                    aria-label={labels.diffInclude}
                  />
                  <label htmlFor={`diff-${entry.key}`} className="font-medium text-foreground text-xs flex-1 cursor-pointer min-w-0">
                    <span className="truncate inline-block align-middle max-w-full">{entry.label}</span>
                  </label>
                  <code className="text-xs font-mono text-muted-foreground/60 truncate hidden sm:inline">{entry.key}</code>
                  {entry.unknown && (
                    <Badge variant="outline" className="text-xs text-muted-foreground border-dashed">
                      {labels.diffUnknownTicket}
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setOpenKey(entry.key)}
                    className="shrink-0 gap-1"
                    title={labels.diffViewFull}
                  >
                    <Expand className="size-3.5" />
                    {labels.diffViewFull}
                  </Button>
                  <Badge variant="outline" className={cn("text-xs border rounded-md", statusStyles(entry.status))}>
                    {entry.status === "identical" && labels.diffIdentical}
                    {entry.status === "modified" && labels.diffModified}
                    {entry.status === "added" && labels.diffAdded}
                    {entry.status === "removed" && labels.diffRemoved}
                  </Badge>
                </div>

                {entry.errors && entry.errors.length > 0 && (
                  <div className="ml-6 flex items-start gap-1.5 text-xs text-red-500">
                    <AlertTriangle className="size-3 mt-0.5 shrink-0" />
                    <ul className="space-y-0.5">
                      {entry.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="ml-6">
                  {entry.changes.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{labels.diffNoChanges}</p>
                  ) : (
                    <ul className="space-y-0.5 text-xs">
                      {entry.changes.map((change, i) => {
                        const path = change.path.replace(/^\$\.?/, "")
                        if (change.kind === "added") {
                          return (
                            <li key={i} className="flex items-start gap-1 text-green-600 dark:text-green-400">
                              <Plus className="size-3 mt-0.5 shrink-0" />
                              <code className="font-mono break-all">{path}</code>
                              <span className="text-muted-foreground">=</span>
                              <span className="break-all">{renderValue(change.new, labels)}</span>
                            </li>
                          )
                        }
                        if (change.kind === "removed") {
                          return (
                            <li key={i} className="flex items-start gap-1 text-red-500">
                              <Minus className="size-3 mt-0.5 shrink-0" />
                              <code className="font-mono break-all">{path}</code>
                              <span className="text-muted-foreground">=</span>
                              <span className="break-all">{renderValue(change.old, labels)}</span>
                            </li>
                          )
                        }
                        return (
                          <li key={i} className="flex items-start gap-1 text-amber-600 dark:text-amber-400">
                            <code className="font-mono break-all">{path}</code>
                            <span className="min-w-0 flex items-center gap-1">
                              <span className="break-all line-through opacity-70">{renderValue(change.old, labels)}</span>
                              <ArrowRight className="size-3 shrink-0" />
                              <span className="break-all">{renderValue(change.new, labels)}</span>
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <DiffDialog
        labels={labels}
        title={openEntry?.label ?? ""}
        subtitle={openEntry?.key}
        statusLabel={openEntry ? statusLabel(openEntry.status, labels) : undefined}
        statusClass={openEntry ? statusStyles(openEntry.status) : undefined}
        oldValue={openEntry ? tickets.find((t) => t.key === openEntry.key)?.existingContent : undefined}
        newValue={openEntry?.value}
        open={!!openEntry}
        onOpenChange={(open) => {
          if (!open) setOpenKey(null)
        }}
      />
    </div>
  )
}
