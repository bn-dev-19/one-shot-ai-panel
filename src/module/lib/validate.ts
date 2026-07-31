import { z } from "zod"
import type {
  AiPanelLabels,
  AiPanelResponse,
  AiPanelResponseValidation,
  AiPanelTicket,
  AiPanelTicketValidationError,
} from "../types"

export function extractJson(text: string): unknown | null {
  const trimmed = text.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced ? fenced[1] : trimmed).trim()
  try {
    return JSON.parse(candidate)
  } catch {
    return null
  }
}

export function validateTicketsResponse(
  raw: string,
  activeTickets: AiPanelTicket[],
  labels: AiPanelLabels,
): Pick<AiPanelResponse, "parsed" | "validation"> {
  const parsed = extractJson(raw)

  if (parsed === null) {
    return { validation: { ok: false, errors: [labels.validationErrorNotJson] } }
  }

  if (!Array.isArray(parsed)) {
    return { parsed: parsed as Record<string, unknown>, validation: { ok: false, errors: [labels.validationErrorNotArray] } }
  }

  const errors: string[] = []
  const ticketErrors: AiPanelTicketValidationError[] = []
  const covered = new Set<string>()

  parsed.forEach((item, index) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      ticketErrors.push({ ticketKey: String(index), index, errors: [labels.validationErrorKeyExpected] })
      return
    }

    const entry = item as Record<string, unknown>
    const keys = Object.keys(entry)

    if (keys.length !== 1) {
      ticketErrors.push({ ticketKey: keys.join(", ") || String(index), index, errors: [labels.validationErrorKeyExpected] })
      return
    }

    const ticketKey = keys[0]
    const ticket = activeTickets.find((t) => t.key === ticketKey)

    if (!ticket) {
      ticketErrors.push({ ticketKey, index, errors: [labels.validationErrorUnknownTicket] })
      return
    }

    covered.add(ticketKey)

    if (ticket.responseSchema) {
      try {
        const zodSchema = z.fromJSONSchema(ticket.responseSchema as unknown as Parameters<typeof z.fromJSONSchema>[0])
        const result = zodSchema.safeParse(entry[ticketKey])
        if (!result.success) {
          ticketErrors.push({ ticketKey, index, errors: result.error.issues.map((issue) => issue.message) })
        }
      } catch {
        ticketErrors.push({ ticketKey, index, errors: [labels.validationErrorSchema] })
      }
    }
  })

  const missing = activeTickets.filter((t) => !covered.has(t.key))
  if (missing.length > 0) {
    errors.push(`${labels.validationErrorMissingTicket} : ${missing.map((t) => t.label).join(", ")}`)
  }

  const validation: AiPanelResponseValidation = {
    ok: errors.length === 0 && ticketErrors.length === 0,
    errors,
    ...(ticketErrors.length > 0 ? { ticketErrors } : {}),
  }

  return { parsed: parsed as unknown as Record<string, unknown>, validation }
}
