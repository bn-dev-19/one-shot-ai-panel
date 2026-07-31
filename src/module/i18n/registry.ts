import type { AiPanelLabels } from "../types"
import { AiPanelLanguage } from "./types"
import { fr } from "./fr"
import { en } from "./en"

export const translations: Record<AiPanelLanguage, AiPanelLabels> = {
  [AiPanelLanguage.Fr]: fr,
  [AiPanelLanguage.En]: en,
}
