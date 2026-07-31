"use client"

import { useState, type ReactNode } from "react"
import {
  Info,
  Sparkles,
  PenLine,
  FolderOpen,
  ListChecks,
  ShieldCheck,
  RefreshCcw,
  Gauge,
  Settings2,
  Zap,
  Braces,
  Heart,
  ArrowLeftRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { AiPanelLabels } from "../types"
import { AI_PANEL_PROJECT_LINKS } from "../project-links"

interface InfoSection {
  key: string
  icon: ReactNode
  title: string
  body: string
}

interface InfoSheetProps {
  labels: AiPanelLabels
  showIntegration?: boolean
  showCredits?: boolean
}

export function InfoSheet({ labels, showIntegration = true, showCredits = true }: InfoSheetProps) {
  const [open, setOpen] = useState(false)

  const links = [
    { label: labels.infoCreditsLandingLabel, url: AI_PANEL_PROJECT_LINKS.landingPage },
    { label: labels.infoCreditsGithubLabel, url: AI_PANEL_PROJECT_LINKS.github },
  ].filter((link) => link.url.length > 0)

  const sections: InfoSection[] = [
    {
      key: "overview",
      icon: <Sparkles className="size-3.5 text-muted-foreground" />,
      title: labels.infoOverviewTitle,
      body: labels.infoOverviewBody,
    },
    {
      key: "prompt",
      icon: <PenLine className="size-3.5 text-muted-foreground" />,
      title: labels.infoPromptTitle,
      body: labels.infoPromptBody,
    },
    {
      key: "files",
      icon: <FolderOpen className="size-3.5 text-muted-foreground" />,
      title: labels.infoFilesTitle,
      body: labels.infoFilesBody,
    },
    {
      key: "tickets",
      icon: <ListChecks className="size-3.5 text-muted-foreground" />,
      title: labels.infoTicketsTitle,
      body: labels.infoTicketsBody,
    },
    {
      key: "validation",
      icon: <ShieldCheck className="size-3.5 text-muted-foreground" />,
      title: labels.infoValidationTitle,
      body: labels.infoValidationBody,
    },
    {
      key: "feedback",
      icon: <RefreshCcw className="size-3.5 text-muted-foreground" />,
      title: labels.infoFeedbackTitle,
      body: labels.infoFeedbackBody,
    },
    {
      key: "status",
      icon: <Gauge className="size-3.5 text-muted-foreground" />,
      title: labels.infoStatusTitle,
      body: labels.infoStatusBody,
    },
    {
      key: "config",
      icon: <Settings2 className="size-3.5 text-muted-foreground" />,
      title: labels.infoConfigTitle,
      body: labels.infoConfigBody,
    },
    {
      key: "review",
      icon: <ArrowLeftRight className="size-3.5 text-muted-foreground" />,
      title: labels.infoReviewTitle,
      body: labels.infoReviewBody,
    },
    {
      key: "actions",
      icon: <Zap className="size-3.5 text-muted-foreground" />,
      title: labels.infoActionsTitle,
      body: labels.infoActionsBody,
    },
    {
      key: "integration",
      icon: <Braces className="size-3.5 text-muted-foreground" />,
      title: labels.infoIntegrationTitle,
      body: labels.infoIntegrationBody,
    },
  ]

  const visibleSections = sections.filter((section) => section.key !== "integration" || showIntegration)

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="gap-1 cursor-pointer"
        onClick={() => setOpen(true)}
        title={labels.infoButton}
        aria-label={labels.infoButton}
      >
        <Info className="size-3.5" />
        {labels.infoButton}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[440px] sm:w-[520px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-4 py-3 shrink-0 border-b space-y-1">
              <SheetTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-muted-foreground" />
                {labels.infoSheetTitle}
              </SheetTitle>
              <p className="text-xs text-muted-foreground">{labels.infoSheetDescription}</p>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
              {visibleSections.map((section) => (
                <div key={section.key} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {section.icon}
                    <span className="text-xs font-semibold text-foreground">{section.title}</span>
                  </div>
                  {section.body.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
              {showCredits && (
                <div className="border-t pt-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Heart className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">{labels.infoCreditsTitle}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {labels.infoCreditsBody}
                </p>
                {links.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
                    {links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-foreground underline underline-offset-4 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
