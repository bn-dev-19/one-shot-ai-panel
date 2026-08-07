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
        "Base URL par défaut : /api/zen/v1 (proxy same-origin vers l'endpoint documenté https://opencode.ai/zen/v1/chat/completions). " +
        "Zen n'autorise pas le CORS navigateur : un proxy côté serveur est requis en navigateur. " +
        "En usage serveur/CLI, pointe directement sur https://opencode.ai/zen/v1.\n\n" +
        "Attention : Zen est un gateway chat (pas d'agent) : pas de permissions, questions, tools ni diff.",
      modelPlaceholder: "Modèle (ex: big-pickle)",
      apiKeyLabel: "Clé API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL de base",
      baseUrlPlaceholder: "/api/zen/v1",
      docLinks: [
        { label: "OpenCode Zen Docs", url: "https://opencode.ai/docs/zen" },
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
        "Default base URL: /api/zen/v1 (same-origin proxy to the documented endpoint https://opencode.ai/zen/v1/chat/completions). " +
        "Zen does not allow browser CORS: a server-side proxy is required in the browser. " +
        "For server/CLI usage, point directly to https://opencode.ai/zen/v1.\n\n" +
        "Note: Zen is a chat-only gateway (no agent): no permissions, questions, tools or diff.",
      modelPlaceholder: "Model (e.g. big-pickle)",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "Base URL",
      baseUrlPlaceholder: "/api/zen/v1",
      docLinks: [
        { label: "OpenCode Zen Docs", url: "https://opencode.ai/docs/zen" },
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
        "デフォルトのベース URL: /api/zen/v1（ドキュメント記載のエンドポイント https://opencode.ai/zen/v1/chat/completions への同一オリジン・プロキシ）。" +
        "Zen はブラウザー CORS を許可していません：ブラウザーではサーバー側プロキシが必要です。サーバー/CLI では https://opencode.ai/zen/v1 を直接指定してください。\n\n" +
        "注意：Zen はチャット専用ゲートウェイ（エージェントなし）：権限、質問、ツール、diff はありません。",
      modelPlaceholder: "モデル（例: big-pickle）",
      apiKeyLabel: "API キー",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "ベース URL",
      baseUrlPlaceholder: "/api/zen/v1",
      docLinks: [
        { label: "OpenCode Zen ドキュメント", url: "https://opencode.ai/docs/zen" },
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
        "默认基础 URL：/api/zen/v1（指向文档端点 https://opencode.ai/zen/v1/chat/completions 的同源代理）。" +
        "Zen 不允许浏览器 CORS：在浏览器中需要服务器端代理。服务端/CLI 使用时可直接指向 https://opencode.ai/zen/v1。\n\n" +
        "注意：Zen 仅提供聊天网关（无代理）：没有权限、问题、工具或 diff。",
      modelPlaceholder: "模型（例如 big-pickle）",
      apiKeyLabel: "API 密钥",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "基础 URL",
      baseUrlPlaceholder: "/api/zen/v1",
      docLinks: [
        { label: "OpenCode Zen 文档", url: "https://opencode.ai/docs/zen" },
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
        "URL base por defecto: /api/zen/v1 (proxy same-origin al endpoint documentado https://opencode.ai/zen/v1/chat/completions). " +
        "Zen no permite CORS de navegador: se requiere un proxy del lado del servidor en el navegador. " +
        "Para uso servidor/CLI, apunta directamente a https://opencode.ai/zen/v1.\n\n" +
        "Nota: Zen es un gateway solo de chat (sin agente): sin permisos, preguntas, herramientas ni diff.",
      modelPlaceholder: "Modelo (p. ej. big-pickle)",
      apiKeyLabel: "Clave API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL base",
      baseUrlPlaceholder: "/api/zen/v1",
      docLinks: [
        { label: "Documentación de OpenCode Zen", url: "https://opencode.ai/docs/zen" },
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
        "عنوان URL الأساسي الافتراضي: /api/zen/v1 (بروكسي same-origin إلى نقطة النهاية الموثقة https://opencode.ai/zen/v1/chat/completions). " +
        "Zen لا يسمح بـ CORS من المتصفح: يلزم بروكسي من جهة الخادم في المتصفح. " +
        "للاستخدام من الخادم/CLI، وجّه مباشرة إلى https://opencode.ai/zen/v1.\n\n" +
        "ملاحظة: Zen بوابة محادثة فقط (بدون وكيل): لا توجد أذونات أو أسئلة أو أدوات أو diff.",
      modelPlaceholder: "النموذج (مثال: big-pickle)",
      apiKeyLabel: "مفتاح API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "عنوان URL الأساسي",
      baseUrlPlaceholder: "/api/zen/v1",
      docLinks: [
        { label: "وثائق OpenCode Zen", url: "https://opencode.ai/docs/zen" },
      ],
    },
  },
}
