import type { OpencodeClient } from "@opencode-ai/sdk"
import { OpenCodeModels, ShadcnModels } from "./models"

export const ProviderType = {
  Opencode: "opencode",
  Shadcn: "shadcn",
  Fallback: "fallback",
} as const

export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType]

export interface ProviderMeta {
  value: ProviderType
  label: string
  description: string
  models: string[]
  docLinks: { label: string; url: string }[]
}

export const PROVIDER_META: Record<ProviderType, ProviderMeta> = {
  [ProviderType.Opencode]: {
    value: ProviderType.Opencode,
    label: "OpenCode",
    description: "Connexion native via le SDK OpenCode",
    models: Object.values(OpenCodeModels).filter(Boolean),
    docLinks: [
      { label: "OpenCode Docs", url: "https://opencode.ai/docs" },
    ],
  },
  [ProviderType.Shadcn]: {
    value: ProviderType.Shadcn,
    label: "shadcn AI SDK",
    description: "Démo / développement via @shadcn/helpers",
    models: Object.values(ShadcnModels).filter(Boolean),
    docLinks: [
      { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
    ],
  },
  [ProviderType.Fallback]: {
    value: ProviderType.Fallback,
    label: "HTTP Fallback",
    description: "API HTTP directe (sans SDK)",
    models: [],
    docLinks: [
      { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
    ],
  },
}

export interface AiPanelAdapter {
  send(prompt: string): Promise<ReadableStream<Uint8Array>>
}

export interface OpenCodeAdapterConfig {
  type: typeof ProviderType.Opencode
  enabled?: boolean
  apiUrl?: string
  password?: string
  model?: string
  client?: OpencodeClient
}

export interface ShadcnAdapterConfig {
  type: typeof ProviderType.Shadcn
  enabled?: boolean
  apiKey?: string
  baseUrl?: string
  model?: string
}

export interface FallbackAdapterConfig {
  type: typeof ProviderType.Fallback
  enabled?: boolean
  apiUrl?: string
}

export type AiAdapterConfig = OpenCodeAdapterConfig | ShadcnAdapterConfig | FallbackAdapterConfig

export type AiPanelSendHandler = (prompt: string) => Promise<ReadableStream<Uint8Array>>
