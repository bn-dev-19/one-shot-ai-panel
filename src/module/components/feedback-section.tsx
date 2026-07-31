"use client"

import { CircleX } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { AiPanelLabels, AiPanelResponseValidation } from "../types"

interface FeedbackSectionProps {
  labels: AiPanelLabels
  feedback: AiPanelResponseValidation | null
  enabled: boolean
  onToggleEnabled: (enabled: boolean) => void
}

export function FeedbackSection({ labels, feedback, enabled, onToggleEnabled }: FeedbackSectionProps) {
  if (!feedback || feedback.ok) return null

  return (
    <section className="border border-red-500/20 rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-red-500">
          <CircleX className="size-3.5 shrink-0" />
          <span className="font-semibold text-xs">{labels.error}</span>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
          <Checkbox
            checked={enabled}
            onCheckedChange={(checked) => onToggleEnabled(checked === true)}
          />
          <span>{labels.includeErrorsInPrompt}</span>
        </label>
      </div>

      <div className="text-xs text-red-500/80 space-y-1">
        {feedback.errors.map((err) => (
          <p key={err}>• {err}</p>
        ))}
        {feedback.ticketErrors?.map((ticketErr) => (
          <div key={ticketErr.ticketKey}>
            <span className="font-semibold">[{ticketErr.ticketKey}]</span>
            <ul className="pl-4 space-y-0.5">
              {ticketErr.errors.map((err) => (
                <li key={err}>• {err}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
