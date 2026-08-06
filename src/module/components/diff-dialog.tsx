"use client"

import { useMemo } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { diffLines, type DiffLineRow } from "../lib/diff"
import type { AiPanelLabels } from "../types"

interface DiffDialogProps {
  labels: AiPanelLabels
  title: string
  subtitle?: string
  statusLabel?: string
  statusClass?: string
  oldValue: unknown
  newValue: unknown
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Cell({ text, number, marker, tone }: {
  text?: string
  number?: number
  marker?: string
  tone?: "added" | "removed"
}) {
  return (
    <div className={cn("flex min-w-0", tone === "added" && "bg-green-500/10", tone === "removed" && "bg-red-500/10")}>
      <span className="w-10 shrink-0 select-none border-r border-muted/60 pr-2 text-right text-muted-foreground/60">
        {number ?? ""}
      </span>
      <span className={cn(
        "w-4 shrink-0 select-none text-center",
        tone === "added" && "text-green-600 dark:text-green-400",
        tone === "removed" && "text-red-500",
      )}>
        {marker}
      </span>
      <span className={cn(
        "min-w-0 whitespace-pre-wrap break-all px-2",
        tone === "added" && "text-green-700 dark:text-green-400",
        tone === "removed" && "text-red-500",
      )}>
        {text}
      </span>
    </div>
  )
}

function DiffRow({ row }: { row: DiffLineRow }) {
  return (
    <tr>
      <td className="border-b border-r border-muted/40 align-top">
        <Cell
          text={row.left?.text}
          number={row.leftNo}
          marker={row.left?.status === "removed" ? "−" : ""}
          tone={row.left?.status === "removed" ? "removed" : undefined}
        />
      </td>
      <td className="border-b border-muted/40 align-top">
        <Cell
          text={row.right?.text}
          number={row.rightNo}
          marker={row.right?.status === "added" ? "+" : ""}
          tone={row.right?.status === "added" ? "added" : undefined}
        />
      </td>
    </tr>
  )
}

export function DiffDialog({
  labels,
  title,
  subtitle,
  statusLabel,
  statusClass,
  oldValue,
  newValue,
  open,
  onOpenChange,
}: DiffDialogProps) {
  const rows = useMemo(() => diffLines(oldValue, newValue), [oldValue, newValue])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay forceRender />
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "fixed top-1/2 start-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "flex h-[85vh] w-full flex-col gap-3 sm:max-w-5xl",
          )}
        >
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 end-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">{labels.diffClose}</span>
          </DialogPrimitive.Close>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="min-w-0 truncate">{title}</span>
              {statusLabel && statusClass && (
                <span className={cn("shrink-0 rounded-md border px-2 py-0.5", statusClass)}>{statusLabel}</span>
              )}
            </DialogTitle>
            {subtitle && <DialogDescription className="truncate font-mono">{subtitle}</DialogDescription>}
          </DialogHeader>

          <div className="grid shrink-0 grid-cols-2 overflow-hidden rounded-md border">
            <div className="border-r border-muted/60 bg-muted/40 px-2 py-1 text-xs font-medium text-foreground">
              {labels.diffExisting}
            </div>
            <div className="bg-muted/40 px-2 py-1 text-xs font-medium text-foreground">
              {labels.diffProposed}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto rounded-md border">
            <table className="w-full table-fixed border-collapse font-mono text-xs leading-relaxed">
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-2 text-muted-foreground" colSpan={2}>
                      {labels.diffNoChanges}
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => <DiffRow key={i} row={row} />)
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter className="shrink-0">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              {labels.diffClose}
            </DialogClose>
          </DialogFooter>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
