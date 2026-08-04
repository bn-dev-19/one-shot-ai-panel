export const AiPanelStatus = {
  Idle: "idle",
  Loading: "loading",
  Streaming: "streaming",
  Done: "done",
  Error: "error",
} as const

export type AiPanelStatus = (typeof AiPanelStatus)[keyof typeof AiPanelStatus]

export interface AiPanelContextFile {
  key: string
  label: string
  present: boolean
  enabled?: boolean
  path: string
}

export interface AiPanelQuestionOption {
  label: string
  description?: string
}

export interface AiPanelQuestion {
  question: string
  header?: string
  options: AiPanelQuestionOption[]
  multiple?: boolean
  custom?: boolean
}

export interface AiPanelPendingQuestion {
  requestID: string
  questions: AiPanelQuestion[]
}

export interface AiPanelPendingPermission {
  permissionID: string
  title: string
  type?: string
  pattern?: string | string[]
}

export type AiPanelPermissionResponse = "once" | "always" | "reject"

export interface AiPanelToolActivity {
  title?: string
  tool?: string
  state?: string
}

export interface AiPanelTokenUsage {
  input: number
  output: number
  reasoning: number
  cacheRead: number
  cacheWrite: number
}

export interface AiPanelContextInfo {
  sessionID: string
  directory?: string
  modelID?: string
  providerID?: string
  cost?: number
  tokens?: AiPanelTokenUsage
}

export interface AiPanelStreamStatus {
  kind: "connecting" | "waiting" | "stalled" | "tool"
  seconds?: number
}

export const AiPanelJsonType = {
  Object: "object",
  Array: "array",
  String: "string",
  Number: "number",
  Integer: "integer",
  Boolean: "boolean",
  Null: "null",
} as const

export type AiPanelJsonType = (typeof AiPanelJsonType)[keyof typeof AiPanelJsonType]

export const AiPanelInvalidMode = {
  Warn: "warn",
  Block: "block",
} as const

export type AiPanelInvalidMode = (typeof AiPanelInvalidMode)[keyof typeof AiPanelInvalidMode]

export interface AiPanelJsonSchema {
  type?: AiPanelJsonType
  properties?: Record<string, AiPanelJsonSchema>
  items?: AiPanelJsonSchema
  required?: string[]
  enum?: unknown[]
  [key: string]: unknown
}

export interface AiPanelSubTicket {
  key: string
  label: string
  done: boolean
  enabled?: boolean
  description?: string
  responseSchema?: AiPanelJsonSchema
  existingContent?: unknown
  explication?: string
  subTickets?: AiPanelSubTicket[]
}

export interface AiPanelTicket {
  key: string
  label: string
  done: boolean
  enabled?: boolean
  description?: string
  responseSchema: AiPanelJsonSchema
  existingContent?: unknown
  explication?: string
  subTickets?: AiPanelSubTicket[]
}

export interface AiPanelTicketValidationError {
  ticketKey: string
  index: number
  errors: string[]
}

export interface AiPanelResponseValidation {
  ok: boolean
  errors: string[]
  ticketErrors?: AiPanelTicketValidationError[]
}

export type AiPanelResponseParser = (raw: string) => Pick<AiPanelResponse, "parsed" | "validation">

export interface AiPanelResponse {
  raw: string
  parsed?: Record<string, unknown>
  validation?: AiPanelResponseValidation
  error?: string
}


export interface AiPanelLabels {
  title: string
  systemPrompt: string
  userPrompt: string
  userPromptPlaceholder: string
  files: string
  filesDescription: string
  addFilePlaceholder: string
  addFileButton: string
  removeFile: string
  tickets: string
  ticketsDescription: string
  response: string
  noPrompt: string
  noPromptDesc: string
  noFiles: string
  noFilesDesc: string
  noTickets: string
  noTicketsDesc: string
  noResponse: string
  noResponseDesc: string
  generating: string
  cancel: string
  actionLabel: string
  plugLabel: string
  reasoning: string
  status: string
  statusSystemPrompt: string
  statusUserPrompt: string
  statusAdditionalContext: string
  statusFiles: string
  statusTickets: string
  statusFeedback: string
  score: string
  include: string
  exclude: string
  show: string
  hide: string
  showCurrentContent: string
  hideCurrentContent: string
  details: string
  responseSchema: string
  error: string
  provider: string
  configureProvider: string
  systemPromptPlaceholder: string
  additionalContext: string
  additionalContextPlaceholder: string
  viewPrompt: string
  copyPrompt: string
  promptCopied: string
  promptPreview: string
  promptCharCount: string
  languageLabel: string
  languageDescription: string
  settings: string
  selectProvider: string
  enableProvider: string
  disableProvider: string
  helpSection: string
  docLinks: string
  modelLabel: string
  modelPlaceholder: string
  modelNone: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  baseUrlLabel: string
  baseUrlPlaceholder: string
  promptSectionFiles: string
  promptSectionTickets: string
  promptSectionUserPrompt: string
  promptSectionAdditionalContext: string
  promptSectionFeedback: string
  feedbackDescription: string
  includeErrorsInPrompt: string
  ticketDescription: string
  ticketExplanation: string
  ticketExistingContent: string
  ticketNoExistingContent: string
  ticketMissingSchema: string
  noExistingContent: string
  noExistingContentDesc: string
  responseValid: string
  responseInvalid: string
  responseFormatInstruction: string
  validationErrorNotJson: string
  validationErrorNotArray: string
  validationErrorKeyExpected: string
  validationErrorUnknownTicket: string
  validationErrorMissingTicket: string
  validationErrorSchema: string
  errorNoStream: string
  errorUnknown: string
  errorStreaming: string
  infoButton: string
  infoSheetTitle: string
  infoSheetDescription: string
  infoOverviewTitle: string
  infoOverviewBody: string
  infoPromptTitle: string
  infoPromptBody: string
  infoFilesTitle: string
  infoFilesBody: string
  infoTicketsTitle: string
  infoTicketsBody: string
  infoValidationTitle: string
  infoValidationBody: string
  infoFeedbackTitle: string
  infoFeedbackBody: string
  infoStatusTitle: string
  infoStatusBody: string
  infoConfigTitle: string
  infoConfigBody: string
  infoActionsTitle: string
  infoActionsBody: string
  infoReviewTitle: string
  infoReviewBody: string
  infoIntegrationTitle: string
  infoIntegrationBody: string
  infoCreditsTitle: string
  infoCreditsBody: string
  infoCreditsLandingLabel: string
  infoCreditsGithubLabel: string
  invalidModeLabel: string
  invalidModeDescription: string
  invalidModeWarn: string
  invalidModeBlock: string
  reviewTitle: string
  reviewDescription: string
  diffIdentical: string
  diffModified: string
  diffAdded: string
  diffRemoved: string
  diffSelectAll: string
  diffDeselectAll: string
  diffNoChanges: string
  diffUnknownTicket: string
  diffEmptyValue: string
  diffInclude: string
  plugSelected: string
  diffViewFull: string
  diffExisting: string
  diffProposed: string
  diffClose: string
  questionTitle: string
  questionDescription: string
  questionAnswer: string
  questionSkip: string
  questionCustomPlaceholder: string
  permissionTitle: string
  permissionDescription: string
  permissionAllowOnce: string
  permissionAlways: string
  permissionDeny: string
  toolActivity: string
  context?: string
  contextDescription?: string
  statusSession?: string
  statusModel?: string
  statusTokens?: string
  statusCost?: string
  sessionRenew?: string
  sessionRenewDescription?: string
  statusConnecting?: string
  statusWaiting?: string
  statusStalled?: string
  statusTool?: string
}
