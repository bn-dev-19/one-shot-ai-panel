import type { AiPanelLabels } from "../types"
import { AiPanelLanguage } from "./types"
import { fr } from "./fr"
import { en } from "./en"
import { ja } from "./ja"
import { zh } from "./zh"
import { es } from "./es"
import { ar } from "./ar"

export const translations: Record<AiPanelLanguage, AiPanelLabels> = {
  [AiPanelLanguage.Fr]: fr,
  [AiPanelLanguage.En]: en,
  [AiPanelLanguage.Ja]: ja,
  [AiPanelLanguage.Zh]: zh,
  [AiPanelLanguage.Es]: es,
  [AiPanelLanguage.Ar]: ar,
}
