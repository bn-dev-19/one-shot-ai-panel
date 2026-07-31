import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatJson(text: string): string {
  const trimmed = text.trim()
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return text
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced ? fenced[1] : trimmed).trim()
  try {
    const parsed = JSON.parse(candidate)
    if (parsed === null || typeof parsed === "object") {
      return JSON.stringify(parsed, null, 2)
    }
  } catch {
    // not valid JSON, keep the raw text
  }
  return text
}
