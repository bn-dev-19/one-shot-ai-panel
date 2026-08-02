export const AiPanelLanguage = {
  Fr: "fr",
  En: "en",
  Ja: "ja",
  Zh: "zh",
  Es: "es",
  Ar: "ar",
} as const

export type AiPanelLanguage = (typeof AiPanelLanguage)[keyof typeof AiPanelLanguage]
