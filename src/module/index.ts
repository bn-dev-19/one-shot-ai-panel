// Components
export { OneShotAiPanel } from "./components/OneShotAiPanel"
export type { OneShotAiPanelProps } from "./components/OneShotAiPanel"
export { StatusBar } from "./components/status-bar"
export { PromptSection } from "./components/prompt-section"
export { FilesSection } from "./components/files-section"

export { TicketsSection } from "./components/tickets-section"
export { TicketItem } from "./components/ticket-item"
export { ResponseSection } from "./components/response-section"
export { FeedbackSection } from "./components/feedback-section"
export { InfoSheet } from "./components/info-sheet"
export { DiffDialog } from "./components/diff-dialog"
export { AI_PANEL_PROJECT_LINKS } from "./project-links"

// Hooks
export { useAiPanel } from "./hooks/useAiPanel"
export type { UseAiPanelOptions, UseAiPanelReturn } from "./hooks/useAiPanel"
export { useStreaming } from "./hooks/useStreaming"
export type { UseStreamingReturn } from "./hooks/useStreaming"

// Adapters
export {
  PROVIDER_META,
  buildSend,
  register,
  registerDefaultAdapters,
  OpenCodeAdapter,
  ShadcnAdapter,
  FallbackAdapter,
  OpenCodeModels,
  ShadcnModels,
  modelDisplayName,
} from "./adapters"
import { ProviderType as PT } from "./adapters"
export const ProviderType = PT
export type {
  ProviderMeta,
  AiPanelAdapter,
  AiAdapterConfig,
  AiPanelSendHandler,
  OpenCodeAdapterConfig,
  ShadcnAdapterConfig,
  FallbackAdapterConfig,
} from "./adapters"

// Types
export { AiPanelJsonType, AiPanelInvalidMode } from "./types"
export type {
  AiPanelStatus,
  AiPanelLabels,
  AiPanelResponse,
  AiPanelResponseParser,
  AiPanelResponseValidation,
  AiPanelTicketValidationError,
  AiPanelContextFile,
  AiPanelTicket,
  AiPanelSubTicket,
  AiPanelJsonSchema,
} from "./types"

// Labels
export { defaultLabels } from "./lib/defaults"

// i18n
export { AiPanelLanguage, translations, PROVIDER_INFO, AiPanelLanguageNames, AI_PANEL_LANGUAGES, aiPanelLanguageFromLocale } from "./i18n"
