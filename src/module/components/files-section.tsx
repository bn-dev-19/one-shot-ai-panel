"use client"

import { useState } from "react"
import { Check, X, Plus, FileText } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "./empty-state"
import type { AiPanelLabels, AiPanelContextFile } from "../types"

interface FilesSectionProps {
  labels: AiPanelLabels
  files: AiPanelContextFile[]
  resolvedFiles: (AiPanelContextFile & { enabled: boolean })[]
  customFileKeys: Set<string>
  onToggleFile: (key: string) => void
  onAddCustomFile: (path: string) => void
  onRemoveCustomFile: (key: string) => void
}

export function FilesSection({
  labels,
  files,
  resolvedFiles,
  customFileKeys,
  onToggleFile,
  onAddCustomFile,
  onRemoveCustomFile,
}: FilesSectionProps) {
  const [inputValue, setInputValue] = useState("")

  function handleAdd() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onAddCustomFile(trimmed)
    setInputValue("")
  }

  return (
    <section>
      <div className="flex items-center gap-1.5 mb-1">
        <FileText className="size-3" />
        <span className="font-semibold text-foreground">{labels.files}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{labels.filesDescription}</p>
      {files.length > 0 ? (
        <div className="space-y-1.5 mb-2">
          {resolvedFiles.map((f) => (
            <div key={f.key} className={cn("flex items-start gap-2", !f.enabled && "opacity-50")}>
              {f.present ? (
                <Check className="size-3 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X className="size-3 text-red-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className={cn("text-xs", f.present && f.enabled ? "text-foreground" : "")}>
                  {f.label}
                </div>
                <div className="text-xs text-muted-foreground truncate">{f.path}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                {customFileKeys.has(f.key) && (
                  <button
                    onClick={() => onRemoveCustomFile(f.key)}
                    className="flex items-center gap-0.5 rounded-md px-1 py-0.5 transition-colors text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    title={labels.removeFile}
                  >
                    <X className="size-3" />
                  </button>
                )}
                <button
                  onClick={() => onToggleFile(f.key)}
                  className={cn(
                    "flex items-center gap-0.5 rounded-md px-1 py-0.5 transition-colors text-xs",
                    f.enabled ? "bg-green-500/20 hover:bg-green-500/30 text-green-600" : "bg-red-500/20 hover:bg-red-500/30 text-red-600",
                  )}
                  title={f.enabled ? labels.include : labels.exclude}
                >
                  {f.enabled ? <Check className="size-3" /> : <X className="size-3" />}
                  <span>{f.enabled ? labels.include : labels.exclude}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="size-5" />}
          title={labels.noFiles}
          description={labels.noFilesDesc}
          className="border mb-2"
        />
      )}
      <div className="flex items-center gap-2">
        <Input
          className="text-xs text-foreground flex-1 h-6"
          placeholder={labels.addFilePlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
        />
        <Button variant="secondary" size="sm" onClick={handleAdd} className="gap-1 shrink-0 cursor-pointer">
          <Plus className="size-3" />
          <span className="text-xs">{labels.addFileButton}</span>
        </Button>
      </div>
    </section>
  )
}
