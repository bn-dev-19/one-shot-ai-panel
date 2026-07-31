export const AiPanelLanguage = {
  Fr: "fr",
  En: "en",
} as const

export type AiPanelLanguage = (typeof AiPanelLanguage)[keyof typeof AiPanelLanguage]
