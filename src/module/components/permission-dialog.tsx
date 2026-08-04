"use client"

import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AiPanelLabels, AiPanelPendingPermission, AiPanelPermissionResponse } from "../types"

export interface PermissionDialogProps {
  labels: AiPanelLabels
  open: boolean
  permission: AiPanelPendingPermission | null
  onDecide: (response: AiPanelPermissionResponse) => void
}

export function PermissionDialog({ labels, open, permission, onDecide }: PermissionDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={() => onDecide("reject")}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <ShieldAlert className="size-3.5" />
            {labels.permissionTitle}
          </DialogTitle>
          <DialogDescription>{labels.permissionDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 min-w-0">
          <p className="text-xs font-semibold text-foreground">{permission?.title ?? "—"}</p>
          {permission?.type && <p className="text-xs text-muted-foreground">{permission.type}</p>}
          {permission?.pattern && (
            <pre className="whitespace-pre-wrap break-all max-w-full rounded-md bg-muted/50 p-2 font-mono text-xs">
              {Array.isArray(permission.pattern) ? permission.pattern.join("\n") : permission.pattern}
            </pre>
          )}
        </div>
        <DialogFooter className="flex-wrap">
          <Button variant="outline" size="sm" onClick={() => onDecide("reject")}>
            {labels.permissionDeny}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onDecide("once")}>
            {labels.permissionAllowOnce}
          </Button>
          <Button size="sm" onClick={() => onDecide("always")}>
            {labels.permissionAlways}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
