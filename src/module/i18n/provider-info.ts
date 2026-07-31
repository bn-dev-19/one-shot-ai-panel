import { ProviderType } from "../adapters"
import { AiPanelLanguage } from "./types"

export interface ProviderInfo {
  description: string
  help: string
  modelPlaceholder: string
  apiKeyLabel: string
  apiKeyPlaceholder: string
  baseUrlLabel: string
  baseUrlPlaceholder: string
  docLinks: { label: string; url: string }[]
}

export const PROVIDER_INFO: Record<AiPanelLanguage, Record<ProviderType, ProviderInfo>> = {
  [AiPanelLanguage.Fr]: {
    [ProviderType.Opencode]: {
      description: "Connexion native au serveur OpenCode",
      help:
        "Ouvre un terminal et lance le serveur :\n\n" +
        "  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\n" +
        "Défauts : port=4096, hostname=127.0.0.1.\n" +
        "--cors peut être répété pour autoriser plusieurs origines.\n\n" +
        "Pour activer l'authentification, définis la variable d'environnement :\n" +
        "  OPENCODE_SERVER_PASSWORD=ton-mot-de-passe\n\n" +
        "Puis renseigne le mot de passe ci-dessous.",
      modelPlaceholder: "Modèle (laissé vide pour le défaut du serveur)",
      apiKeyLabel: "Mot de passe (optionnel)",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "URL du serveur",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "Documentation OpenCode", url: "https://opencode.ai/docs" },
        { label: "Dépôt GitHub", url: "https://github.com/anomalyco/opencode" },
      ],
    },
    [ProviderType.Shadcn]: {
      description: "Utilise le SDK @shadcn/helpers avec un provider AI (OpenAI, Anthropic...)",
      help:
        "Configure une clé API auprès de ton provider (OpenAI, Anthropic, etc.) " +
        "et renseigne-la ci-dessous. Le SDK utilise le modèle sélectionné pour générer les réponses.",
      modelPlaceholder: "Modèle (ex: gpt-4o)",
      apiKeyLabel: "Clé API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL de base",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://ui.shadcn.com/docs/helpers/ai-sdk" },
        { label: "OpenAI API Keys", url: "https://platform.openai.com/api-keys" },
      ],
    },
    [ProviderType.Fallback]: {
      description: "Requête HTTP directe vers une API externe",
      help:
        "Le panel envoie une requête POST à l'URL configurée avec un body JSON { prompt }. " +
        "La réponse doit être un ReadableStream ou du texte brut. " +
        "Utilise ce mode pour une API compatible OpenAI ou un proxy custom.",
      modelPlaceholder: "Modèle (non utilisé en fallback)",
      apiKeyLabel: "Clé API",
      apiKeyPlaceholder: "Optionnelle (transmise dans l'en-tête Authorization)",
      baseUrlLabel: "URL de l'API",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
      ],
    },
  },
  [AiPanelLanguage.En]: {
    [ProviderType.Opencode]: {
      description: "Native connection to the OpenCode server",
      help:
        "Open a terminal and start the server:\n\n" +
        "  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\n" +
        "Defaults: port=4096, hostname=127.0.0.1.\n" +
        "--cors can be repeated to allow multiple origins.\n\n" +
        "To enable authentication, set the environment variable:\n" +
        "  OPENCODE_SERVER_PASSWORD=your-password\n\n" +
        "Then enter the password below.",
      modelPlaceholder: "Model (leave empty for server default)",
      apiKeyLabel: "Password (optional)",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "Server URL",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "OpenCode Docs", url: "https://opencode.ai/docs" },
        { label: "GitHub Repository", url: "https://github.com/anomalyco/opencode" },
      ],
    },
    [ProviderType.Shadcn]: {
      description: "Uses the @shadcn/helpers SDK with an AI provider (OpenAI, Anthropic...)",
      help:
        "Configure an API key from your provider (OpenAI, Anthropic, etc.) " +
        "and enter it below. The SDK uses the selected model to generate responses.",
      modelPlaceholder: "Model (e.g. gpt-4o)",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "Base URL",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
        { label: "OpenAI API Keys", url: "https://platform.openai.com/api-keys" },
      ],
    },
    [ProviderType.Fallback]: {
      description: "Direct HTTP request to an external API",
      help:
        "The panel sends a POST request to the configured URL with a JSON body { prompt }. " +
        "The response must be a ReadableStream or raw text. " +
        "Use this mode for an OpenAI-compatible API or a custom proxy.",
      modelPlaceholder: "Model (not used in fallback mode)",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "Optional (sent in the Authorization header)",
      baseUrlLabel: "API URL",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
      ],
    },
  },
}
