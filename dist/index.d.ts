import { OpencodeClient } from '@opencode-ai/sdk';
import * as react from 'react';

declare const AiPanelLanguage: {
    readonly Fr: "fr";
    readonly En: "en";
};
type AiPanelLanguage = (typeof AiPanelLanguage)[keyof typeof AiPanelLanguage];

declare const AiPanelStatus: {
    readonly Idle: "idle";
    readonly Loading: "loading";
    readonly Streaming: "streaming";
    readonly Done: "done";
    readonly Error: "error";
};
type AiPanelStatus = (typeof AiPanelStatus)[keyof typeof AiPanelStatus];
interface AiPanelContextFile {
    key: string;
    label: string;
    present: boolean;
    enabled?: boolean;
    path: string;
}
declare const AiPanelJsonType: {
    readonly Object: "object";
    readonly Array: "array";
    readonly String: "string";
    readonly Number: "number";
    readonly Integer: "integer";
    readonly Boolean: "boolean";
    readonly Null: "null";
};
type AiPanelJsonType = (typeof AiPanelJsonType)[keyof typeof AiPanelJsonType];
declare const AiPanelInvalidMode: {
    readonly Warn: "warn";
    readonly Block: "block";
};
type AiPanelInvalidMode = (typeof AiPanelInvalidMode)[keyof typeof AiPanelInvalidMode];
interface AiPanelJsonSchema {
    type?: AiPanelJsonType;
    properties?: Record<string, AiPanelJsonSchema>;
    items?: AiPanelJsonSchema;
    required?: string[];
    enum?: unknown[];
    [key: string]: unknown;
}
interface AiPanelSubTicket {
    key: string;
    label: string;
    done: boolean;
    enabled?: boolean;
    description?: string;
    responseSchema?: AiPanelJsonSchema;
    existingContent?: unknown;
    explication?: string;
    subTickets?: AiPanelSubTicket[];
}
interface AiPanelTicket {
    key: string;
    label: string;
    done: boolean;
    enabled?: boolean;
    description?: string;
    responseSchema: AiPanelJsonSchema;
    existingContent?: unknown;
    explication?: string;
    subTickets?: AiPanelSubTicket[];
}
interface AiPanelTicketValidationError {
    ticketKey: string;
    index: number;
    errors: string[];
}
interface AiPanelResponseValidation {
    ok: boolean;
    errors: string[];
    ticketErrors?: AiPanelTicketValidationError[];
}
type AiPanelResponseParser = (raw: string) => Pick<AiPanelResponse, "parsed" | "validation">;
interface AiPanelResponse {
    raw: string;
    parsed?: Record<string, unknown>;
    validation?: AiPanelResponseValidation;
    error?: string;
}
interface AiPanelLabels {
    title: string;
    systemPrompt: string;
    userPrompt: string;
    userPromptPlaceholder: string;
    files: string;
    filesDescription: string;
    addFilePlaceholder: string;
    addFileButton: string;
    removeFile: string;
    tickets: string;
    ticketsDescription: string;
    response: string;
    noPrompt: string;
    noPromptDesc: string;
    noFiles: string;
    noFilesDesc: string;
    noTickets: string;
    noTicketsDesc: string;
    noResponse: string;
    noResponseDesc: string;
    generating: string;
    cancel: string;
    actionLabel: string;
    plugLabel: string;
    reasoning: string;
    status: string;
    statusSystemPrompt: string;
    statusUserPrompt: string;
    statusAdditionalContext: string;
    statusFiles: string;
    statusTickets: string;
    statusFeedback: string;
    score: string;
    include: string;
    exclude: string;
    show: string;
    hide: string;
    showCurrentContent: string;
    hideCurrentContent: string;
    details: string;
    responseSchema: string;
    error: string;
    provider: string;
    configureProvider: string;
    systemPromptPlaceholder: string;
    additionalContext: string;
    additionalContextPlaceholder: string;
    viewPrompt: string;
    copyPrompt: string;
    promptCopied: string;
    promptPreview: string;
    promptCharCount: string;
    languageLabel: string;
    languageDescription: string;
    settings: string;
    selectProvider: string;
    enableProvider: string;
    disableProvider: string;
    helpSection: string;
    docLinks: string;
    modelLabel: string;
    modelPlaceholder: string;
    modelNone: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    baseUrlLabel: string;
    baseUrlPlaceholder: string;
    promptSectionFiles: string;
    promptSectionTickets: string;
    promptSectionUserPrompt: string;
    promptSectionAdditionalContext: string;
    promptSectionFeedback: string;
    feedbackDescription: string;
    includeErrorsInPrompt: string;
    ticketDescription: string;
    ticketExplanation: string;
    ticketExistingContent: string;
    ticketNoExistingContent: string;
    ticketMissingSchema: string;
    noExistingContent: string;
    noExistingContentDesc: string;
    responseValid: string;
    responseInvalid: string;
    responseFormatInstruction: string;
    validationErrorNotJson: string;
    validationErrorNotArray: string;
    validationErrorKeyExpected: string;
    validationErrorUnknownTicket: string;
    validationErrorMissingTicket: string;
    validationErrorSchema: string;
    errorNoStream: string;
    errorUnknown: string;
    errorStreaming: string;
    infoButton: string;
    infoSheetTitle: string;
    infoSheetDescription: string;
    infoOverviewTitle: string;
    infoOverviewBody: string;
    infoPromptTitle: string;
    infoPromptBody: string;
    infoFilesTitle: string;
    infoFilesBody: string;
    infoTicketsTitle: string;
    infoTicketsBody: string;
    infoValidationTitle: string;
    infoValidationBody: string;
    infoFeedbackTitle: string;
    infoFeedbackBody: string;
    infoStatusTitle: string;
    infoStatusBody: string;
    infoConfigTitle: string;
    infoConfigBody: string;
    infoActionsTitle: string;
    infoActionsBody: string;
    infoReviewTitle: string;
    infoReviewBody: string;
    infoIntegrationTitle: string;
    infoIntegrationBody: string;
    infoCreditsTitle: string;
    infoCreditsBody: string;
    infoCreditsLandingLabel: string;
    infoCreditsGithubLabel: string;
    invalidModeLabel: string;
    invalidModeDescription: string;
    invalidModeWarn: string;
    invalidModeBlock: string;
    reviewTitle: string;
    reviewDescription: string;
    diffIdentical: string;
    diffModified: string;
    diffAdded: string;
    diffRemoved: string;
    diffSelectAll: string;
    diffDeselectAll: string;
    diffNoChanges: string;
    diffUnknownTicket: string;
    diffEmptyValue: string;
    diffInclude: string;
    plugSelected: string;
    diffViewFull: string;
    diffExisting: string;
    diffProposed: string;
    diffClose: string;
}

declare const translations: Record<AiPanelLanguage, AiPanelLabels>;

declare const ProviderType$1: {
    readonly Opencode: "opencode";
    readonly Shadcn: "shadcn";
    readonly Fallback: "fallback";
};
type ProviderType$1 = (typeof ProviderType$1)[keyof typeof ProviderType$1];
interface ProviderMeta {
    value: ProviderType$1;
    label: string;
    description: string;
    models: string[];
    docLinks: {
        label: string;
        url: string;
    }[];
}
declare const PROVIDER_META: Record<ProviderType$1, ProviderMeta>;
interface AiPanelAdapter {
    send(prompt: string): Promise<ReadableStream<Uint8Array>>;
}
interface OpenCodeAdapterConfig {
    type: typeof ProviderType$1.Opencode;
    enabled?: boolean;
    apiUrl?: string;
    password?: string;
    model?: string;
    client?: OpencodeClient;
}
interface ShadcnAdapterConfig {
    type: typeof ProviderType$1.Shadcn;
    enabled?: boolean;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
}
interface FallbackAdapterConfig {
    type: typeof ProviderType$1.Fallback;
    enabled?: boolean;
    apiUrl?: string;
}
type AiAdapterConfig = OpenCodeAdapterConfig | ShadcnAdapterConfig | FallbackAdapterConfig;
type AiPanelSendHandler = (prompt: string) => Promise<ReadableStream<Uint8Array>>;

declare const OpenCodeModels: {
    readonly None: "";
    readonly BigPickle: "big-pickle";
    readonly Gpt4o: "gpt-4o";
    readonly Gpt4oMini: "gpt-4o-mini";
    readonly ClaudeSonnet35: "claude-3.5-sonnet";
    readonly DeepseekChat: "deepseek-chat";
    readonly DeepSeekV4FlashFree: "deepseek-v4-flash-free";
    readonly MiMoV25Free: "mimo-v2.5-free";
    readonly LagunaS21Free: "laguna-s-2.1-free";
    readonly Ling30FlashFree: "ling-3.0-flash-free";
    readonly NorthMiniCodeFree: "north-mini-code-free";
    readonly Nemotron3UltraFree: "nemotron-3-ultra-free";
    readonly Nemotron3SuperFree: "nemotron-3-super-free";
    readonly MiniMaxM3: "minimax-m3";
    readonly MiniMaxM27: "minimax-m2.7";
    readonly MiniMaxM25: "minimax-m2.5";
    readonly MiniMaxM25Free: "minimax-m2.5-free";
    readonly GLM52: "glm-5.2";
    readonly GLM51: "glm-5.1";
    readonly KimiK25: "kimi-k2.5";
    readonly KimiK26: "kimi-k2.6";
    readonly KimiK2Thinking: "kimi-k2-thinking";
    readonly KimiK2: "kimi-k2";
    readonly Qwen3Coder480B: "qwen3-coder";
    readonly Qwen36Plus: "qwen3.6-plus";
    readonly Qwen35Plus: "qwen3.5-plus";
    readonly Qwen37Max: "qwen3.7-max";
    readonly Qwen37Plus: "qwen3.7-plus";
    readonly GoGrok45: "opencode-go/grok-4.5";
    readonly GoGLM52: "opencode-go/glm-5.2";
    readonly GoGLM51: "opencode-go/glm-5.1";
    readonly GoKimiK3: "opencode-go/kimi-k3";
    readonly GoKimiK27Code: "opencode-go/kimi-k2.7-code";
    readonly GoKimiK26: "opencode-go/kimi-k2.6";
    readonly GoMiMoV25Pro: "opencode-go/mimo-v2.5-pro";
    readonly GoMiMoV25: "opencode-go/mimo-v2.5";
    readonly GoQwen37Max: "opencode-go/qwen3.7-max";
    readonly GoQwen37Plus: "opencode-go/qwen3.7-plus";
    readonly GoQwen36Plus: "opencode-go/qwen3.6-plus";
    readonly GoMiniMaxM27: "opencode-go/minimax-m2.7";
    readonly GoMiniMaxM3: "opencode-go/minimax-m3";
    readonly GoDeepSeekV4Pro: "opencode-go/deepseek-v4-pro";
    readonly GoDeepSeekV4Flash: "opencode-go/deepseek-v4-flash";
    readonly GoHy3: "opencode-go/hy3";
};
declare const ShadcnModels: {
    readonly None: "";
    readonly Gpt4o: "gpt-4o";
    readonly Gpt4oMini: "gpt-4o-mini";
    readonly Gpt41: "gpt-4.1";
    readonly ClaudeSonnet4: "claude-sonnet-4-20250514";
    readonly ClaudeSonnet35: "claude-3.5-sonnet";
    readonly ClaudeHaiku35: "claude-3.5-haiku";
    readonly Gemini20Flash: "gemini-2.0-flash";
};
declare function modelDisplayName(model: string): string;

declare function register(type: ProviderType$1, factory: new (config: any) => AiPanelAdapter): void;
declare function buildSend(config: AiAdapterConfig): AiPanelSendHandler;

declare function registerDefaultAdapters(): void;

declare class OpenCodeAdapter implements AiPanelAdapter {
    type: "opencode";
    private client;
    private baseUrl;
    private modelId?;
    constructor(config: OpenCodeAdapterConfig);
    private createSession;
    send(prompt: string): Promise<ReadableStream<Uint8Array>>;
}

/**
 * Adapter utilisant @shadcn/helpers/ai-sdk pour le développement / démo.
 * Il crée un chat pré-défini qui streame via le transport local.
 */
declare class ShadcnAdapter implements AiPanelAdapter {
    type: "shadcn";
    constructor(_config: ShadcnAdapterConfig);
    send(prompt: string): Promise<ReadableStream<Uint8Array>>;
}

declare class FallbackAdapter implements AiPanelAdapter {
    type: "fallback";
    private apiUrl;
    constructor(config: FallbackAdapterConfig);
    send(prompt: string): Promise<ReadableStream<Uint8Array>>;
}

interface ProviderInfo {
    description: string;
    help: string;
    modelPlaceholder: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    baseUrlLabel: string;
    baseUrlPlaceholder: string;
    docLinks: {
        label: string;
        url: string;
    }[];
}
declare const PROVIDER_INFO: Record<AiPanelLanguage, Record<ProviderType$1, ProviderInfo>>;

interface OneShotAiPanelProps {
    title?: string;
    systemPrompt?: string;
    initialUserPrompt?: string;
    files?: AiPanelContextFile[];
    tickets?: AiPanelTicket[];
    actionLabel?: string;
    language?: AiPanelLanguage;
    labels?: Partial<AiPanelLabels>;
    onPlug?: (response: AiPanelResponse, selectedKeys?: string[]) => void;
    children?: React.ReactNode;
    className?: string;
    adapter?: AiAdapterConfig;
    onSend?: AiPanelSendHandler;
    parser?: AiPanelResponseParser;
    invalidMode?: AiPanelInvalidMode;
    showInfoIntegration?: boolean;
    showInfoCredits?: boolean;
    showInfoButton?: boolean;
    showSettingsButton?: boolean;
}
declare function OneShotAiPanel({ title, systemPrompt: systemPromptProp, initialUserPrompt, files, tickets, actionLabel, language, labels: labelsProp, onPlug, children, className, adapter, onSend, parser, invalidMode: invalidModeProp, showInfoIntegration, showInfoCredits, showInfoButton, showSettingsButton, }: OneShotAiPanelProps): react.JSX.Element;

interface StatusBarProps {
    labels: AiPanelLabels;
    promptPresent: boolean;
    userPromptPresent: boolean;
    additionalContextPresent: boolean;
    files?: AiPanelContextFile[];
    tickets?: AiPanelTicket[];
    hasFeedback: boolean;
}
declare function StatusBar({ labels, promptPresent, userPromptPresent, additionalContextPresent, files, tickets, hasFeedback }: StatusBarProps): react.JSX.Element;

interface PromptSectionProps {
    labels: AiPanelLabels;
    systemPrompt: string;
    onSystemPromptChange: (value: string) => void;
    userPrompt: string;
    onUserPromptChange: (value: string) => void;
    additionalContext: string;
    onAdditionalContextChange: (value: string) => void;
}
declare function PromptSection({ labels, systemPrompt, onSystemPromptChange, userPrompt, onUserPromptChange, additionalContext, onAdditionalContextChange, }: PromptSectionProps): react.JSX.Element;

interface FilesSectionProps {
    labels: AiPanelLabels;
    files: AiPanelContextFile[];
    resolvedFiles: (AiPanelContextFile & {
        enabled: boolean;
    })[];
    customFileKeys: Set<string>;
    onToggleFile: (key: string) => void;
    onAddCustomFile: (path: string) => void;
    onRemoveCustomFile: (key: string) => void;
}
declare function FilesSection({ labels, files, resolvedFiles, customFileKeys, onToggleFile, onAddCustomFile, onRemoveCustomFile, }: FilesSectionProps): react.JSX.Element;

interface TicketsSectionProps {
    labels: AiPanelLabels;
    tickets: AiPanelTicket[];
    resolvedTickets: (AiPanelTicket & {
        enabled: boolean;
    })[];
    onToggleTicket: (key: string) => void;
}
declare function TicketsSection({ labels, tickets, resolvedTickets, onToggleTicket }: TicketsSectionProps): react.JSX.Element;

interface TicketItemProps {
    ticket: AiPanelTicket | AiPanelSubTicket;
    depth?: number;
    enabled?: boolean;
    labels: AiPanelLabels;
    onToggleEnabled?: () => void;
}
declare function TicketItem({ ticket, depth, enabled, labels, onToggleEnabled }: TicketItemProps): react.JSX.Element;

interface ResponseSectionProps {
    labels: AiPanelLabels;
    status: AiPanelStatus;
    response: AiPanelResponse | null;
    streamingText: string;
    streamingReasoning?: string;
    invalidMode?: AiPanelInvalidMode;
    tickets?: AiPanelTicket[];
    onPlug?: (response: AiPanelResponse, selectedKeys?: string[]) => void;
}
declare function ResponseSection({ labels, status, response, streamingText, streamingReasoning, invalidMode, tickets, onPlug, }: ResponseSectionProps): react.JSX.Element;

interface FeedbackSectionProps {
    labels: AiPanelLabels;
    feedback: AiPanelResponseValidation | null;
    enabled: boolean;
    onToggleEnabled: (enabled: boolean) => void;
}
declare function FeedbackSection({ labels, feedback, enabled, onToggleEnabled }: FeedbackSectionProps): react.JSX.Element | null;

interface InfoSheetProps {
    labels: AiPanelLabels;
    showIntegration?: boolean;
    showCredits?: boolean;
}
declare function InfoSheet({ labels, showIntegration, showCredits }: InfoSheetProps): react.JSX.Element;

declare const AI_PANEL_PROJECT_LINKS: {
    landingPage: string;
    github: string;
};

interface UseAiPanelOptions {
    sendHandler?: AiPanelSendHandler;
    files?: AiPanelContextFile[];
    tickets?: AiPanelTicket[];
    labels?: AiPanelLabels;
    parser?: AiPanelResponseParser;
}
interface UseAiPanelReturn {
    status: AiPanelStatus;
    response: AiPanelResponse | null;
    streamingText: string;
    streamingReasoning: string;
    send: (fullPrompt: string, activeTickets?: AiPanelTicket[]) => Promise<void>;
    cancel: () => void;
    reset: () => void;
}
declare function useAiPanel(options: UseAiPanelOptions): UseAiPanelReturn;

interface UseStreamingReturn {
    text: string;
    reasoning: string;
    isStreaming: boolean;
    start: (stream: ReadableStream<Uint8Array>, onComplete?: (text: string) => void, onError?: (error: unknown) => void) => void;
    cancel: () => void;
    reset: () => void;
}
declare function useStreaming(): UseStreamingReturn;

declare const defaultLabels: AiPanelLabels;

declare const ProviderType: {
    readonly Opencode: "opencode";
    readonly Shadcn: "shadcn";
    readonly Fallback: "fallback";
};

export { AI_PANEL_PROJECT_LINKS, type AiAdapterConfig, type AiPanelAdapter, type AiPanelContextFile, AiPanelInvalidMode, type AiPanelJsonSchema, AiPanelJsonType, type AiPanelLabels, AiPanelLanguage, type AiPanelResponse, type AiPanelResponseParser, type AiPanelResponseValidation, type AiPanelSendHandler, AiPanelStatus, type AiPanelSubTicket, type AiPanelTicket, type AiPanelTicketValidationError, FallbackAdapter, type FallbackAdapterConfig, FeedbackSection, FilesSection, InfoSheet, OneShotAiPanel, type OneShotAiPanelProps, OpenCodeAdapter, type OpenCodeAdapterConfig, OpenCodeModels, PROVIDER_INFO, PROVIDER_META, PromptSection, type ProviderMeta, ProviderType, ResponseSection, ShadcnAdapter, type ShadcnAdapterConfig, ShadcnModels, StatusBar, TicketItem, TicketsSection, type UseAiPanelOptions, type UseAiPanelReturn, type UseStreamingReturn, buildSend, defaultLabels, modelDisplayName, register, registerDefaultAdapters, translations, useAiPanel, useStreaming };
