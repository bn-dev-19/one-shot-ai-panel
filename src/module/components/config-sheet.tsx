"use client"

import { useState } from "react"
import { Settings, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AiPanelLanguage, PROVIDER_INFO, AiPanelLanguageNames, AI_PANEL_LANGUAGES } from "../i18n"
import type { ProviderInfo } from "../i18n"
import { PROVIDER_META, ProviderType, OpenCodeModels, ShadcnModels, modelDisplayName } from "../adapters"
import type {
  AiAdapterConfig,
  OpenCodeAdapterConfig,
  ShadcnAdapterConfig,
  FallbackAdapterConfig,
} from "../adapters"
import type { AiPanelLabels } from "../types"
import { AiPanelInvalidMode } from "../types"

const INVALID_MODE_NAMES: Record<AiPanelInvalidMode, (labels: AiPanelLabels) => string> = {
  [AiPanelInvalidMode.Warn]: (labels) => labels.invalidModeWarn,
  [AiPanelInvalidMode.Block]: (labels) => labels.invalidModeBlock,
}

interface ConfigSheetProps {
  labels: AiPanelLabels
  language: AiPanelLanguage
  onLanguageChange: (language: AiPanelLanguage) => void
  adapter?: AiAdapterConfig
  onAdapterChange?: (config: AiAdapterConfig) => void
  invalidMode: AiPanelInvalidMode
  onInvalidModeChange: (mode: AiPanelInvalidMode) => void
}

const DEFAULT_CONFIGS: Record<ProviderType, AiAdapterConfig> = {
  [ProviderType.Opencode]: { type: ProviderType.Opencode, enabled: true, model: "big-pickle" },
  [ProviderType.Shadcn]: { type: ProviderType.Shadcn, enabled: false, apiKey: "", baseUrl: "", model: "" },
  [ProviderType.Fallback]: { type: ProviderType.Fallback, enabled: false, apiUrl: "/api/ai/generate" },
}

export function ConfigSheet({ labels, language, onLanguageChange, adapter, onAdapterChange, invalidMode, onInvalidModeChange }: ConfigSheetProps) {
  const [config, setConfig] = useState<AiAdapterConfig>(adapter ?? DEFAULT_CONFIGS[ProviderType.Opencode])

  const info = PROVIDER_INFO[language]?.[config.type]
  const meta = PROVIDER_META[config.type]
  const isEnabled = config.enabled ?? true

  function setAndNotify(next: AiAdapterConfig) {
    setConfig(next)
    onAdapterChange?.(next)
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="secondary" size="sm" className="gap-1 cursor-pointer" />}>
        <Settings className="size-3.5" />
        {labels.settings}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[440px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 py-3 shrink-0 border-b space-y-1">
            <SheetTitle className="text-sm">{labels.settings}</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">

            {/* Langue */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{labels.languageLabel}</Label>
              <p className="text-xs text-muted-foreground">{labels.languageDescription}</p>
              <Select value={language} onValueChange={(v) => onLanguageChange(v as AiPanelLanguage)}>
                <SelectTrigger className="h-8 text-xs w-full cursor-pointer">
                  {AiPanelLanguageNames[language]}
                </SelectTrigger>
                <SelectContent>
                  {AI_PANEL_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-xs cursor-pointer">
                      {AiPanelLanguageNames[lang]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mode de validation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{labels.invalidModeLabel}</Label>
              <p className="text-xs text-muted-foreground">{labels.invalidModeDescription}</p>
              <Select
                value={invalidMode}
                onValueChange={(v) => onInvalidModeChange(v as AiPanelInvalidMode)}
              >
                <SelectTrigger className="h-8 text-xs w-full cursor-pointer">
                  {INVALID_MODE_NAMES[invalidMode](labels)}
                </SelectTrigger>
                <SelectContent>
                  {([AiPanelInvalidMode.Warn, AiPanelInvalidMode.Block] as const).map((mode) => (
                    <SelectItem key={mode} value={mode} className="text-xs cursor-pointer">
                      {INVALID_MODE_NAMES[mode](labels)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Séparateur */}
            <div className="border-t" />

            {/* Provider */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{labels.selectProvider}</Label>
              <p className="text-xs text-muted-foreground">{meta?.description}</p>
              <Select
                value={config.type}
                onValueChange={(v) => {
                  const pt = v as ProviderType
                  const cfg = DEFAULT_CONFIGS[pt]
                  setAndNotify(cfg)
                }}
              >
                <SelectTrigger className="h-8 text-xs w-full cursor-pointer">
                  {meta?.label}
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProviderType).map((pt) => (
                    <SelectItem key={pt} value={pt} className="text-xs cursor-pointer">
                      {PROVIDER_META[pt]?.label ?? pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle activé/désactivé */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-medium cursor-pointer">
                  {isEnabled ? labels.enableProvider : labels.disableProvider}
                </Label>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) => {
                  setAndNotify({ ...config, enabled: checked })
                }}
              />
            </div>

            {/* Champs dynamiques selon le provider */}
            {info && (
              <>
                {/* Aide */}
                <div className="rounded-lg bg-muted/50 border p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <Info className="size-3" />
                    {labels.helpSection}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{info.help}</p>
                  {info.docLinks.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <p className="text-xs font-medium text-foreground">{labels.docLinks}</p>
                      {info.docLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                        >
                          <ExternalLink className="size-3" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Champs spécifiques */}
                {config.type === ProviderType.Opencode && (
                  <OpenCodeFields
                    config={config as OpenCodeAdapterConfig}
                    labels={labels}
                    info={info}
                    onChange={setAndNotify}
                  />
                )}

                {config.type === ProviderType.Shadcn && (
                  <ShadcnFields
                    config={config as ShadcnAdapterConfig}
                    labels={labels}
                    info={info}
                    onChange={setAndNotify}
                  />
                )}

                {config.type === ProviderType.Fallback && (
                  <FallbackFields
                    config={config as FallbackAdapterConfig}
                    labels={labels}
                    info={info}
                    onChange={setAndNotify}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ─── Sous-composants par provider ──────────────────────────────────────────

interface FieldProps {
  labels: AiPanelLabels
  info: ProviderInfo
}

function OpenCodeFields({
  config,
  labels,
  info,
  onChange,
}: FieldProps & { config: OpenCodeAdapterConfig; onChange: (c: AiAdapterConfig) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{info.baseUrlLabel}</Label>
        <Input
          className="h-8 text-xs"
          placeholder={info.baseUrlPlaceholder}
          value={config.apiUrl ?? ""}
          onChange={(e) => onChange({ ...config, apiUrl: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{info.apiKeyLabel}</Label>
        <Input
          className="h-8 text-xs"
          type="password"
          placeholder={info.apiKeyPlaceholder}
          value={config.password ?? ""}
          onChange={(e) => onChange({ ...config, password: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{labels.modelLabel}</Label>
        <Select
          value={config.model ?? ""}
          onValueChange={(v) => onChange({ ...config, model: v || undefined })}
        >
          <SelectTrigger className="h-8 text-xs w-full cursor-pointer">
            {config.model ? modelDisplayName(config.model) : labels.modelNone}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className="text-xs cursor-pointer">{labels.modelNone}</SelectItem>
            {Object.values(OpenCodeModels).filter(Boolean).map((m) => (
              <SelectItem key={m} value={m} className="text-xs cursor-pointer">
                {modelDisplayName(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function ShadcnFields({
  config,
  labels,
  info,
  onChange,
}: FieldProps & { config: ShadcnAdapterConfig; onChange: (c: AiAdapterConfig) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{info.apiKeyLabel}</Label>
        <Input
          className="h-8 text-xs"
          placeholder={info.apiKeyPlaceholder}
          value={config.apiKey ?? ""}
          onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{info.baseUrlLabel}</Label>
        <Input
          className="h-8 text-xs"
          placeholder={info.baseUrlPlaceholder}
          value={config.baseUrl ?? ""}
          onChange={(e) => onChange({ ...config, baseUrl: e.target.value || undefined })}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{labels.modelLabel}</Label>
        <Select
          value={config.model ?? ""}
          onValueChange={(v) => onChange({ ...config, model: v || undefined })}
        >
          <SelectTrigger className="h-8 text-xs w-full cursor-pointer">
            {config.model ? modelDisplayName(config.model) : labels.modelNone}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className="text-xs cursor-pointer">{labels.modelNone}</SelectItem>
            {Object.values(ShadcnModels).filter(Boolean).map((m) => (
              <SelectItem key={m} value={m} className="text-xs cursor-pointer">
                {modelDisplayName(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function FallbackFields({
  config,
  info,
  onChange,
}: FieldProps & { config: FallbackAdapterConfig; onChange: (c: AiAdapterConfig) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{info.baseUrlLabel}</Label>
        <Input
          className="h-8 text-xs"
          placeholder={info.baseUrlPlaceholder}
          value={config.apiUrl ?? ""}
          onChange={(e) => onChange({ ...config, apiUrl: e.target.value || undefined })}
        />
      </div>
    </div>
  )
}
