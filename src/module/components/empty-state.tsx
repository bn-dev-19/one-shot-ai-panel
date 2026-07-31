import type { ReactNode } from "react"
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyContent } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
  children?: ReactNode
}

export function EmptyState({ icon, title, description, action, className, children }: EmptyStateProps) {
  return (
    <Empty className={className}>
      <EmptyContent>
        {icon && <EmptyMedia>{icon}</EmptyMedia>}
        <EmptyHeader>
          {title && <div className="font-heading text-sm font-medium">{title}</div>}
          {description && <EmptyDescription>{description}</EmptyDescription>}
        </EmptyHeader>
        {children ?? (action && (
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        ))}
      </EmptyContent>
    </Empty>
  )
}
