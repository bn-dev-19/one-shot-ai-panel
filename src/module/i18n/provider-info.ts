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
    [ProviderType.Zen]: {
      description: "Gateway de modèles OpenCode Zen (API OpenAI-compatible)",
      help:
        "Récupère ta clé API sur https://opencode.ai/auth (dashboard Zen).\n\n" +
        "Le panel appelle directement https://opencode.ai/zen/v1 — aucun serveur local requis.\n\n" +
        "Attention : Zen est un gateway chat (pas d'agent) : pas de permissions, questions, tools ni diff.",
      modelPlaceholder: "Modèle (ex: big-pickle)",
      apiKeyLabel: "Clé API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL de base",
      baseUrlPlaceholder: "https://opencode.ai/zen/v1",
      docLinks: [
        { label: "OpenCode Zen Docs", url: "https://opencode.ai/docs/zen" },
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
    [ProviderType.Zen]: {
      description: "OpenCode Zen model gateway (OpenAI-compatible API)",
      help:
        "Get your API key from https://opencode.ai/auth (Zen dashboard).\n\n" +
        "The panel calls https://opencode.ai/zen/v1 directly — no local server required.\n\n" +
        "Note: Zen is a chat-only gateway (no agent): no permissions, questions, tools or diff.",
      modelPlaceholder: "Model (e.g. big-pickle)",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "Base URL",
      baseUrlPlaceholder: "https://opencode.ai/zen/v1",
      docLinks: [
        { label: "OpenCode Zen Docs", url: "https://opencode.ai/docs/zen" },
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
  [AiPanelLanguage.Ja]: {
    [ProviderType.Opencode]: {
      description: "OpenCode サーバーへのネイティブ接続",
      help:
        "ターミナルを開いてサーバーを起動：\n\n" +
        "  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\n" +
        "デフォルト：port=4096、hostname=127.0.0.1。\n" +
        "--cors は複数のオリジンを許可するために繰り返せます。\n\n" +
        "認証を有効にするには、環境変数を設定します：\n" +
        "  OPENCODE_SERVER_PASSWORD=あなたのパスワード\n\n" +
        "その後、以下のパスワードを入力します。",
      modelPlaceholder: "モデル（空のままにするとサーバーのデフォルト）",
      apiKeyLabel: "パスワード（オプション）",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "サーバー URL",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "OpenCode ドキュメント", url: "https://opencode.ai/docs" },
        { label: "GitHub リポジトリ", url: "https://github.com/anomalyco/opencode" },
      ],
    },
    [ProviderType.Zen]: {
      description: "OpenCode Zen モデルゲートウェイ（OpenAI 互換 API）",
      help:
        "API キーは https://opencode.ai/auth（Zen ダッシュボード）で取得します。\n\n" +
        "パネルは https://opencode.ai/zen/v1 を直接呼び出します — ローカルサーバーは不要です。\n\n" +
        "注意：Zen はチャット専用ゲートウェイ（エージェントなし）：権限、質問、ツール、diff はありません。",
      modelPlaceholder: "モデル（例: big-pickle）",
      apiKeyLabel: "API キー",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "ベース URL",
      baseUrlPlaceholder: "https://opencode.ai/zen/v1",
      docLinks: [
        { label: "OpenCode Zen ドキュメント", url: "https://opencode.ai/docs/zen" },
      ],
    },
    [ProviderType.Shadcn]: {
      description: "@shadcn/helpers SDK と AI プロバイダー（OpenAI、Anthropic...）を使用",
      help:
        "プロバイダー（OpenAI、Anthropic など）で API キーを設定し、以下に入力します。SDK は選択したモデルを使用してレスポンスを生成します。",
      modelPlaceholder: "モデル（例: gpt-4o）",
      apiKeyLabel: "API キー",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "ベース URL",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
        { label: "OpenAI API キー", url: "https://platform.openai.com/api-keys" },
      ],
    },
    [ProviderType.Fallback]: {
      description: "外部 API への直接 HTTP リクエスト",
      help:
        "パネルは設定された URL に JSON ボディ { prompt } で POST リクエストを送信します。レスポンスは ReadableStream またはプレーンテキストである必要があります。OpenAI 互換 API やカスタムプロキシにこのモードを使用します。",
      modelPlaceholder: "モデル（フォールバックでは未使用）",
      apiKeyLabel: "API キー",
      apiKeyPlaceholder: "オプション（Authorization ヘッダーで送信）",
      baseUrlLabel: "API URL",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
      ],
    },
  },
  [AiPanelLanguage.Zh]: {
    [ProviderType.Opencode]: {
      description: "原生连接到 OpenCode 服务器",
      help:
        "打开终端并启动服务器：\n\n" +
        "  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\n" +
        "默认值：port=4096、hostname=127.0.0.1。\n" +
        "--cors 可重复以允许多个来源。\n\n" +
        "要启用身份验证，请设置环境变量：\n" +
        "  OPENCODE_SERVER_PASSWORD=你的密码\n\n" +
        "然后在下面输入密码。",
      modelPlaceholder: "模型（留空使用服务器默认）",
      apiKeyLabel: "密码（可选）",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "服务器 URL",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "OpenCode 文档", url: "https://opencode.ai/docs" },
        { label: "GitHub 仓库", url: "https://github.com/anomalyco/opencode" },
      ],
    },
    [ProviderType.Zen]: {
      description: "OpenCode Zen 模型网关（OpenAI 兼容 API）",
      help:
        "在 https://opencode.ai/auth（Zen 仪表盘）获取你的 API 密钥。\n\n" +
        "面板直接调用 https://opencode.ai/zen/v1 —— 无需本地服务器。\n\n" +
        "注意：Zen 仅提供聊天网关（无代理）：没有权限、问题、工具或 diff。",
      modelPlaceholder: "模型（例如 big-pickle）",
      apiKeyLabel: "API 密钥",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "基础 URL",
      baseUrlPlaceholder: "https://opencode.ai/zen/v1",
      docLinks: [
        { label: "OpenCode Zen 文档", url: "https://opencode.ai/docs/zen" },
      ],
    },
    [ProviderType.Shadcn]: {
      description: "使用 @shadcn/helpers SDK 与 AI 提供商（OpenAI、Anthropic...）",
      help:
        "从你的提供商（OpenAI、Anthropic 等）配置 API 密钥并在下面输入。SDK 使用所选模型生成响应。",
      modelPlaceholder: "模型（例如 gpt-4o）",
      apiKeyLabel: "API 密钥",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "基础 URL",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
        { label: "OpenAI API 密钥", url: "https://platform.openai.com/api-keys" },
      ],
    },
    [ProviderType.Fallback]: {
      description: "直接向外部 API 发送 HTTP 请求",
      help:
        "面板向配置的 URL 发送一个 JSON 正文 { prompt } 的 POST 请求。响应必须是 ReadableStream 或纯文本。将此模式用于兼容 OpenAI 的 API 或自定义代理。",
      modelPlaceholder: "模型（回退模式下不使用）",
      apiKeyLabel: "API 密钥",
      apiKeyPlaceholder: "可选（在 Authorization 标头中发送）",
      baseUrlLabel: "API URL",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
      ],
    },
  },
  [AiPanelLanguage.Es]: {
    [ProviderType.Opencode]: {
      description: "Conexión nativa al servidor OpenCode",
      help:
        "Abre una terminal y lanza el servidor:\n\n" +
        "  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\n" +
        "Valores por defecto: port=4096, hostname=127.0.0.1.\n" +
        "--cors se puede repetir para permitir varios orígenes.\n\n" +
        "Para activar la autenticación, define la variable de entorno:\n" +
        "  OPENCODE_SERVER_PASSWORD=tu-contraseña\n\n" +
        "Luego introduce la contraseña abajo.",
      modelPlaceholder: "Modelo (déjalo vacío para el predeterminado del servidor)",
      apiKeyLabel: "Contraseña (opcional)",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "URL del servidor",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "Documentación de OpenCode", url: "https://opencode.ai/docs" },
        { label: "Repositorio de GitHub", url: "https://github.com/anomalyco/opencode" },
      ],
    },
    [ProviderType.Zen]: {
      description: "Gateway de modelos OpenCode Zen (API compatible con OpenAI)",
      help:
        "Obtén tu clave API en https://opencode.ai/auth (panel de Zen).\n\n" +
        "El panel llama directamente a https://opencode.ai/zen/v1 — no se requiere servidor local.\n\n" +
        "Nota: Zen es un gateway solo de chat (sin agente): sin permisos, preguntas, herramientas ni diff.",
      modelPlaceholder: "Modelo (p. ej. big-pickle)",
      apiKeyLabel: "Clave API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL base",
      baseUrlPlaceholder: "https://opencode.ai/zen/v1",
      docLinks: [
        { label: "Documentación de OpenCode Zen", url: "https://opencode.ai/docs/zen" },
      ],
    },
    [ProviderType.Shadcn]: {
      description: "Usa el SDK @shadcn/helpers con un proveedor de IA (OpenAI, Anthropic...)",
      help:
        "Configura una clave API en tu proveedor (OpenAI, Anthropic, etc.) e introdúcela abajo. El SDK usa el modelo seleccionado para generar las respuestas.",
      modelPlaceholder: "Modelo (p. ej. gpt-4o)",
      apiKeyLabel: "Clave API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL base",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
        { label: "Claves API de OpenAI", url: "https://platform.openai.com/api-keys" },
      ],
    },
    [ProviderType.Fallback]: {
      description: "Petición HTTP directa a una API externa",
      help:
        "El panel envía una petición POST a la URL configurada con un body JSON { prompt }. La respuesta debe ser un ReadableStream o texto plano. Usa este modo para una API compatible con OpenAI o un proxy personalizado.",
      modelPlaceholder: "Modelo (no se usa en fallback)",
      apiKeyLabel: "Clave API",
      apiKeyPlaceholder: "Opcional (se envía en la cabecera Authorization)",
      baseUrlLabel: "URL de la API",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
      ],
    },
  },
  [AiPanelLanguage.Ar]: {
    [ProviderType.Opencode]: {
      description: "اتصال أصلي بخادم OpenCode",
      help:
        "افتح محطة وأطلق الخادم:\n\n" +
        "  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\n" +
        "الافتراضي: port=4096، hostname=127.0.0.1.\n" +
        "يمكن تكرار --cors للسماح بعدة مصادر.\n\n" +
        "لتفعيل المصادقة، عرّف متغير البيئة:\n" +
        "  OPENCODE_SERVER_PASSWORD=كلمة-مرورك\n\n" +
        "ثم أدخل كلمة المرور أدناه.",
      modelPlaceholder: "النموذج (اتركه فارغًا للافتراضي للخادم)",
      apiKeyLabel: "كلمة المرور (اختياري)",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "عنوان URL للخادم",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "وثائق OpenCode", url: "https://opencode.ai/docs" },
        { label: "مستودع GitHub", url: "https://github.com/anomalyco/opencode" },
      ],
    },
    [ProviderType.Zen]: {
      description: "بوابة نماذج OpenCode Zen (واجهة متوافقة مع OpenAI)",
      help:
        "احصل على مفتاح API من https://opencode.ai/auth (لوحة Zen).\n\n" +
        "اللوحة تتصل مباشرة بـ https://opencode.ai/zen/v1 — لا حاجة لخادم محلي.\n\n" +
        "ملاحظة: Zen بوابة محادثة فقط (بدون وكيل): لا توجد أذونات أو أسئلة أو أدوات أو diff.",
      modelPlaceholder: "النموذج (مثال: big-pickle)",
      apiKeyLabel: "مفتاح API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "عنوان URL الأساسي",
      baseUrlPlaceholder: "https://opencode.ai/zen/v1",
      docLinks: [
        { label: "وثائق OpenCode Zen", url: "https://opencode.ai/docs/zen" },
      ],
    },
    [ProviderType.Shadcn]: {
      description: "يستخدم SDK @shadcn/helpers مع مزود ذكاء اصطناعي (OpenAI، Anthropic...)",
      help:
        "عيّن مفتاح API لدى مزودك (OpenAI، Anthropic، إلخ) وأدخله أدناه. يستخدم SDK النموذج المحدد لتوليد الاستجابات.",
      modelPlaceholder: "النموذج (مثال: gpt-4o)",
      apiKeyLabel: "مفتاح API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "عنوان URL الأساسي",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
        { label: "مفاتيح API من OpenAI", url: "https://platform.openai.com/api-keys" },
      ],
    },
    [ProviderType.Fallback]: {
      description: "طلب HTTP مباشر إلى API خارجية",
      help:
        "ترسل اللوحة طلب POST إلى عنوان URL المحدد بجسم JSON { prompt }. يجب أن تكون الاستجابة ReadableStream أو نصًا خامًا. استخدم هذا الوضع لواجهة متوافقة مع OpenAI أو وكيل مخصص.",
      modelPlaceholder: "النموذج (غير مستخدم في وضع الرجوع)",
      apiKeyLabel: "مفتاح API",
      apiKeyPlaceholder: "اختياري (يُرسل في ترويسة Authorization)",
      baseUrlLabel: "عنوان API",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" },
      ],
    },
  },
}
