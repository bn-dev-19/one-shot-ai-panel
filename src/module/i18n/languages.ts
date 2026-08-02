import { AiPanelLanguage } from "./types"

export const AiPanelLanguageNames: Record<AiPanelLanguage, string> = {
  [AiPanelLanguage.Fr]: "Français",
  [AiPanelLanguage.En]: "English",
  [AiPanelLanguage.Ja]: "日本語",
  [AiPanelLanguage.Zh]: "简体中文",
  [AiPanelLanguage.Es]: "Español",
  [AiPanelLanguage.Ar]: "العربية",
}

export const AI_PANEL_LANGUAGES = Object.values(AiPanelLanguage)

export function aiPanelLanguageFromLocale(locale: string): AiPanelLanguage {
  switch (locale) {
    case "ja":
      return AiPanelLanguage.Ja
    case "zh":
      return AiPanelLanguage.Zh
    case "es":
      return AiPanelLanguage.Es
    case "ar":
      return AiPanelLanguage.Ar
    case "en":
      return AiPanelLanguage.En
    default:
      return AiPanelLanguage.Fr
  }
}
