"use client"

import { Circle } from "lucide-react"
import { EmptyState } from "./empty-state"
import { TicketItem } from "./ticket-item"
import type { AiPanelLabels, AiPanelTicket } from "../types"

interface TicketsSectionProps {
  labels: AiPanelLabels
  tickets: AiPanelTicket[]
  resolvedTickets: (AiPanelTicket & { enabled: boolean })[]
  onToggleTicket: (key: string) => void
}

export function TicketsSection({ labels, tickets, resolvedTickets, onToggleTicket }: TicketsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-1.5 mb-1">
        <Circle className="size-3" />
        <span className="font-semibold text-foreground">{labels.tickets}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{labels.ticketsDescription}</p>
      {tickets.length > 0 ? (
        <div className="space-y-2">
          {resolvedTickets.map((t) => (
            <TicketItem
              key={t.key}
              ticket={t}
              enabled={t.enabled}
              labels={labels}
              onToggleEnabled={() => onToggleTicket(t.key)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Circle className="size-5" />}
          title={labels.noTickets}
          description={labels.noTicketsDesc}
          className="border"
        />
      )}
    </section>
  )
}
