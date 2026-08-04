"use client"

import { useState, useEffect, useCallback } from "react"
import { HelpCircle, Sparkles } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AiPanelLabels, AiPanelQuestion } from "../types"

export interface QuestionDialogProps {
  labels: AiPanelLabels
  open: boolean
  questions: AiPanelQuestion[]
  onSubmit: (answers: string[][]) => void
  onSkip: () => void
}

export function QuestionDialog({ labels, open, questions, onSubmit, onSkip }: QuestionDialogProps) {
  const [selected, setSelected] = useState<Record<number, string[]>>({})
  const [custom, setCustom] = useState<Record<number, string>>({})

  useEffect(() => {
    if (open) {
      setSelected({})
      setCustom({})
    }
  }, [open])

  const toggleOption = useCallback((qi: number, label: string, multiple: boolean) => {
    setSelected((prev) => {
      const current = prev[qi] ?? []
      if (multiple) {
        return { ...prev, [qi]: current.includes(label) ? current.filter((l) => l !== label) : [...current, label] }
      }
      return { ...prev, [qi]: current.includes(label) ? [] : [label] }
    })
  }, [])

  const canSubmit = questions.every((_q, qi) => {
    const hasSelection = (selected[qi] ?? []).length > 0
    const hasCustom = !!custom[qi]?.trim()
    return hasSelection || hasCustom
  })

  const handleSubmit = () => {
    const answers: string[][] = questions.map((_q, qi) => {
      const picked = selected[qi] ?? []
      const customValue = custom[qi]?.trim()
      return customValue ? [...picked, customValue] : picked
    })
    onSubmit(answers)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onSkip()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <HelpCircle className="size-3.5" />
            {labels.questionTitle}
          </DialogTitle>
          <DialogDescription>{labels.questionDescription}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-1">
          {questions.map((q, qi) => (
            <div key={qi} className="space-y-2">
              {q.header && <p className="text-xs font-semibold text-foreground">{q.header}</p>}
              <p className="text-xs text-foreground">{q.question}</p>
              <div className="space-y-1">
                {q.options.map((opt) => {
                  const active = (selected[qi] ?? []).includes(opt.label)
                  return (
                    <label
                      key={opt.label}
                      className={cn(
                        "flex w-full cursor-pointer items-start gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <Checkbox
                        checked={active}
                        onCheckedChange={() => toggleOption(qi, opt.label, !!q.multiple)}
                        className="mt-0.5"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-foreground">{opt.label}</span>
                        {opt.description && <span className="block text-xs text-muted-foreground">{opt.description}</span>}
                      </span>
                    </label>
                  )
                })}
              </div>
              {q.custom !== false && (
                <Textarea
                  value={custom[qi] ?? ""}
                  onChange={(e) => setCustom((prev) => ({ ...prev, [qi]: e.target.value }))}
                  placeholder={labels.questionCustomPlaceholder}
                  className="min-h-16 text-xs"
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onSkip}>
            {labels.questionSkip}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!canSubmit} className="gap-1">
            <Sparkles className="size-3" />
            {labels.questionAnswer}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
