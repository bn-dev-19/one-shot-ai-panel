"use client"

import { useState } from "react"
import { Sparkles, FileText, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"
import { Textarea } from "@/components/ui/textarea"
import type { AiPanelLabels } from "../types"

interface PromptSectionProps {
  labels: AiPanelLabels
  systemPrompt: string
  onSystemPromptChange: (value: string) => void
  userPrompt: string
  onUserPromptChange: (value: string) => void
  additionalContext: string
  onAdditionalContextChange: (value: string) => void
}

type SectionKey = "system" | "user" | "context"

export function PromptSection({
  labels, systemPrompt, onSystemPromptChange,
  userPrompt, onUserPromptChange,
  additionalContext, onAdditionalContextChange,
}: PromptSectionProps) {
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    system: true,
    user: true,
    context: true,
  })

  const toggle = (key: SectionKey) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }))

  const renderHeader = (
    key: SectionKey,
    icon: React.ReactNode,
    label: string,
    extraClass?: string,
  ) => (
    <div className={cn("flex items-center gap-1.5 mb-2", extraClass)}>
      {icon}
      <span className="font-semibold text-foreground flex-1">{label}</span>
      <button
        type="button"
        onClick={() => toggle(key)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed[key] ? labels.show : labels.hide}
      >
        {collapsed[key] ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </button>
    </div>
  )

  return (
    <section>
      {renderHeader("system", <Sparkles className="size-3" />, labels.systemPrompt)}
      {!collapsed.system && (
        <Textarea
          placeholder={labels.systemPromptPlaceholder}
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          className="min-h-[80px] text-xs text-foreground"
        />
      )}

      {renderHeader("user", <Sparkles className="size-3" />, labels.userPrompt, "mt-4")}
      {!collapsed.user && (
        <Textarea
          placeholder={labels.userPromptPlaceholder}
          value={userPrompt}
          onChange={(e) => onUserPromptChange(e.target.value)}
          className="min-h-[60px] text-xs text-foreground"
        />
      )}

      {renderHeader("context", <FileText className="size-3" />, labels.additionalContext, "mt-4")}
      {!collapsed.context && (
        <Textarea
          placeholder={labels.additionalContextPlaceholder}
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          className="min-h-[60px] text-xs text-foreground"
        />
      )}
    </section>
  )
}
