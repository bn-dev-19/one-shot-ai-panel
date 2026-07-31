"use client"

import { useState, useId } from "react"
import { Check, X, ChevronDown, ChevronRight, Circle, TriangleAlert } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyState } from "./empty-state"
import type { AiPanelSubTicket, AiPanelTicket, AiPanelLabels } from "../types"

interface TicketItemProps {
  ticket: AiPanelTicket | AiPanelSubTicket
  depth?: number
  enabled?: boolean
  labels: AiPanelLabels
  onToggleEnabled?: () => void
}

export function TicketItem({ ticket, depth = 0, enabled, labels, onToggleEnabled }: TicketItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [showExisting, setShowExisting] = useState(false)
  const contentId = useId()
  const hasExpandable = ticket.explication || ticket.responseSchema !== undefined || (ticket.subTickets && ticket.subTickets.length > 0)
  const hasExistingContent = ticket.existingContent !== undefined

  return (
    <div className={cn("border rounded-md p-3", depth > 0 && "ml-4", enabled === false && "opacity-50")}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0">
          {ticket.done ? (
            <Check className="size-3.5 text-green-500" />
          ) : (
            <Circle className="size-3.5 text-muted-foreground" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "font-medium text-xs",
              ticket.done ? "text-foreground line-through opacity-60" : "text-foreground",
            )}
          >
            {ticket.label}
          </span>
          {ticket.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{ticket.description}</p>
          )}
          {depth === 0 && ticket.responseSchema === undefined && (
            <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
              <TriangleAlert className="size-3 shrink-0" />
              <span>{labels.ticketMissingSchema}</span>
            </p>
          )}
        </div>
        {onToggleEnabled && (
          <button
            onClick={onToggleEnabled}
            className={cn(
              "flex items-center gap-0.5 rounded-md px-1 py-0.5 transition-colors shrink-0 text-xs",
              enabled ? "bg-green-500/20 hover:bg-green-500/30 text-green-600" : "bg-red-500/20 hover:bg-red-500/30 text-red-600",
            )}
            title={enabled ? labels.exclude : labels.include}
          >
            {enabled ? <Check className="size-3" /> : <X className="size-3" />}
            <span>{enabled ? labels.include : labels.exclude}</span>
          </button>
        )}
      </div>

      <div className="mt-2 ml-6">
        <button
          onClick={() => setShowExisting(!showExisting)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showExisting ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
          <span>{showExisting ? labels.hideCurrentContent : labels.showCurrentContent}</span>
        </button>
        {showExisting && (
          hasExistingContent ? (
            <pre className="mt-1 text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto border">
              {JSON.stringify(ticket.existingContent, null, 2)}
            </pre>
          ) : (
            <EmptyState
              icon={<Circle className="size-4" />}
              title={labels.noExistingContent}
              description={labels.noExistingContentDesc}
              className="border py-2"
            />
          )
        )}
      </div>

      {hasExpandable && (
        <div className="mt-2 ml-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 gap-1 px-2"
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            <span className="text-xs">{expanded ? labels.hide : labels.details}</span>
          </Button>
          {expanded && (
            <div id={contentId} className="mt-2 space-y-2">
              {ticket.explication && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {ticket.explication}
                </p>
              )}
              {ticket.responseSchema !== undefined && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{labels.responseSchema}</span>
                  <pre className="mt-1 text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto">
                    {JSON.stringify(ticket.responseSchema, null, 2)}
                  </pre>
                </div>
              )}
              {ticket.subTickets?.map((st) => (
                <TicketItem key={st.key} ticket={st} depth={depth + 1} labels={labels} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}


