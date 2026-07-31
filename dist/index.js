// src/module/components/OneShotAiPanel.tsx
import { useState as useState11, useMemo as useMemo3, useCallback as useCallback4, useRef as useRef4 } from "react";
import { Bot as Bot2, Sparkles as Sparkles4, Eye, Copy, Check as Check4 } from "lucide-react";

// src/module/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatJson(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return text;
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : trimmed).trim();
  try {
    const parsed = JSON.parse(candidate);
    if (parsed === null || typeof parsed === "object") {
      return JSON.stringify(parsed, null, 2);
    }
  } catch {
  }
  return text;
}

// src/module/i18n/types.ts
var AiPanelLanguage = {
  Fr: "fr",
  En: "en"
};

// src/module/i18n/fr.ts
var fr = {
  title: "OneShot AI Panel",
  systemPrompt: "Prompt syst\xE8me",
  userPrompt: "Instructions suppl\xE9mentaires",
  userPromptPlaceholder: "Instructions suppl\xE9mentaires pour l'IA...",
  files: "Fichiers source",
  filesDescription: "Chaque fichier doit pointer vers un chemin absolu ou une URL (fichier local, CDN, serveur, drive...) que l'agent pourra consulter.",
  addFilePlaceholder: "Chemin ou URL du fichier...",
  addFileButton: "Ajouter",
  removeFile: "Retirer",
  tickets: "Tickets",
  ticketsDescription: "Les tickets d\xE9crivent les t\xE2ches concr\xE8tes \xE0 r\xE9aliser par l'agent. Chaque ticket peut avoir une description, une explication, et un sch\xE9ma de r\xE9ponse attendu. Un ticket marqu\xE9 \xAB fait \xBB est exclu du prompt.",
  response: "R\xE9ponse IA",
  noPrompt: "Aucun prompt",
  noPromptDesc: "D\xE9finissez un prompt syst\xE8me pour guider l'IA",
  noFiles: "Aucun fichier",
  noFilesDesc: "Ajoutez des fichiers source (sp\xE9cifications, sch\xE9mas)",
  noTickets: "Aucun ticket",
  noTicketsDesc: "Ajoutez des tickets pour structurer les t\xE2ches de l'IA",
  noResponse: "Aucune r\xE9ponse",
  noResponseDesc: "Cliquez sur \xAB G\xE9n\xE9rer \xBB pour obtenir une r\xE9ponse",
  generating: "G\xE9n\xE9ration en cours...",
  cancel: "Annuler",
  actionLabel: "G\xE9n\xE9rer",
  plugLabel: "Plugger",
  reasoning: "Raisonnement",
  status: "Statut",
  statusSystemPrompt: "Prompt syst\xE8me",
  statusUserPrompt: "Instructions suppl\xE9mentaires",
  statusAdditionalContext: "Contexte additionnel",
  statusFiles: "Fichiers source",
  statusTickets: "Tickets",
  statusFeedback: "Erreurs de parsing",
  score: "Score",
  include: "Inclure",
  exclude: "Exclure",
  show: "Afficher",
  hide: "Masquer",
  showCurrentContent: "Afficher le contenu actuel",
  hideCurrentContent: "Masquer le contenu actuel",
  details: "D\xE9tails",
  responseSchema: "Sch\xE9ma de r\xE9ponse",
  error: "Erreur",
  provider: "Provider IA",
  configureProvider: "Configurer le provider",
  systemPromptPlaceholder: "Modifiez le prompt syst\xE8me...",
  additionalContext: "Contexte additionnel",
  additionalContextPlaceholder: "Ajoutez des informations contextuelles suppl\xE9mentaires (extraits de code, logs, contraintes...)",
  viewPrompt: "Prompt Complet",
  copyPrompt: "Copier le prompt",
  promptCopied: "Prompt copi\xE9 !",
  promptPreview: "Prompt complet assembl\xE9",
  promptCharCount: "caract\xE8res",
  languageLabel: "Langue",
  languageDescription: "Langue d'affichage des libell\xE9s du panneau",
  settings: "Param\xE8tres",
  selectProvider: "Provider IA",
  enableProvider: "Activ\xE9",
  disableProvider: "D\xE9sactiv\xE9",
  helpSection: "Aide",
  docLinks: "Documentation",
  modelLabel: "Mod\xE8le",
  modelPlaceholder: "Mod\xE8le (ex: gpt-4o)",
  modelNone: "Aucun",
  apiKeyLabel: "Cl\xE9 API",
  apiKeyPlaceholder: "sk-...",
  baseUrlLabel: "URL de base",
  baseUrlPlaceholder: "https://...",
  promptSectionFiles: "--- Fichiers source ---",
  promptSectionTickets: "--- Tickets \xE0 traiter ---",
  promptSectionUserPrompt: "--- Instructions suppl\xE9mentaires ---",
  promptSectionAdditionalContext: "--- Contexte additionnel ---",
  promptSectionFeedback: "--- Erreurs de la g\xE9n\xE9ration pr\xE9c\xE9dente ---",
  feedbackDescription: "Voici les erreurs de parsing de la r\xE9ponse pr\xE9c\xE9dente. \xC9vite de reproduire ces erreurs et respecte strictement le format de r\xE9ponse demand\xE9.",
  includeErrorsInPrompt: "Inclure les erreurs dans le prompt",
  ticketDescription: "Description",
  ticketExplanation: "Explication",
  ticketExistingContent: "Contenu existant",
  ticketNoExistingContent: "Aucun contenu pr\xE9-existant",
  ticketMissingSchema: "Sch\xE9ma de r\xE9ponse requis",
  noExistingContent: "Aucun contenu",
  noExistingContentDesc: "Ce ticket n'a pas encore de valeur",
  responseValid: "Format de r\xE9ponse valide",
  responseInvalid: "Format de r\xE9ponse invalide",
  responseFormatInstruction: `R\xE9ponds UNIQUEMENT en JSON : un tableau d'objets, un par ticket actif. Chaque objet doit avoir exactement une cl\xE9 \xE9gale \xE0 la cl\xE9 du ticket, et sa valeur doit respecter le sch\xE9ma de r\xE9ponse du ticket correspondant. Exemple : [ { "cle-du-ticket" : { ... } } ]`,
  validationErrorNotJson: "La r\xE9ponse n'est pas un JSON valide",
  validationErrorNotArray: "La r\xE9ponse doit \xEAtre un tableau d'objets",
  validationErrorKeyExpected: "Chaque \xE9l\xE9ment doit avoir exactement une cl\xE9 de ticket",
  validationErrorUnknownTicket: "Cl\xE9 de ticket inconnue",
  validationErrorMissingTicket: "R\xE9ponse manquante pour le ticket",
  validationErrorSchema: "Ne respecte pas le sch\xE9ma de r\xE9ponse",
  errorNoStream: "Le handler n'a pas retourn\xE9 de stream",
  errorUnknown: "Erreur inconnue",
  errorStreaming: "Erreur de streaming",
  infoButton: "Info",
  infoSheetTitle: "OneShot AI Panel",
  infoSheetDescription: "Assistant de g\xE9n\xE9ration pilot\xE9 par IA : fichiers source, tickets \xE0 traiter, r\xE9ponses JSON valid\xE9es et boucle de correction.",
  infoOverviewTitle: "Vue d'ensemble",
  infoOverviewBody: "OneShot AI Panel est un g\xE9n\xE9rateur pilot\xE9 par un mod\xE8le de langage. Vous d\xE9crivez l'objectif, fournissez des fichiers source et des tickets \xE0 traiter, puis le mod\xE8le g\xE9n\xE8re une r\xE9ponse JSON valid\xE9e contre le sch\xE9ma de chaque ticket.\n\nLa g\xE9n\xE9ration s'affiche en temps r\xE9el (streaming) avec le raisonnement du mod\xE8le, et la r\xE9ponse est pr\xE9sent\xE9e en JSON indent\xE9. Une revue compare ensuite chaque proposition au contenu existant avant int\xE9gration.\n\nLe panel est configurable (provider, mod\xE8le, langue) et enti\xE8rement localisable. Cette aide s'affiche dans la langue active.",
  infoPromptTitle: "Le prompt",
  infoPromptBody: "Le prompt est compos\xE9 de trois zones :\n\u2022 Prompt syst\xE8me : le r\xF4le et les r\xE8gles du mod\xE8le (toujours envoy\xE9).\n\u2022 Instructions suppl\xE9mentaires : votre demande pr\xE9cise (optionnel).\n\u2022 Contexte additionnel : informations compl\xE9mentaires (optionnel).\n\nLe bouton \xAB Voir le prompt \xBB affiche le message exact qui sera envoy\xE9, et \xAB Copier \xBB permet de le r\xE9utiliser.",
  infoFilesTitle: "Les fichiers source",
  infoFilesBody: "Fournissez des fichiers ou des URLs (serveur, CDN, drive) que le mod\xE8le lira lui-m\xEAme.\n\n\u2022 Un fichier est d\xE9fini par un label et un chemin absolu ou une URL.\n\u2022 Inclure / Exclure active ou d\xE9sactive un fichier dans le prompt.\n\u2022 Un fichier marqu\xE9 \xAB non pr\xE9sent \xBB est simplement ignor\xE9 lors de l'envoi.\n\u2022 Le champ en bas de section ajoute un chemin ou une URL \xE0 la vol\xE9e.\n\nLe panel ne convertit pas le contenu des fichiers : c'est le mod\xE8le qui les lit.",
  infoTicketsTitle: "Les tickets",
  infoTicketsBody: "Les tickets d\xE9crivent les t\xE2ches \xE0 accomplir. Chaque ticket top-level exige un sch\xE9ma de r\xE9ponse (JSON Schema) qui d\xE9crit le format attendu pour sa sortie.\n\n\u2022 Description : l'objectif du ticket.\n\u2022 Explication : la m\xE9thode \xE0 suivre.\n\u2022 Contenu existant : du contenu d\xE9j\xE0 pr\xE9sent \xE0 enrichir ou remplacer. Il est compar\xE9 \xE0 la proposition de l'IA dans la revue des modifications avant int\xE9gration.\n\u2022 Sous-tickets : d\xE9coupage de la t\xE2che en sous-\xE9tapes.\n\nUn ticket top-level sans sch\xE9ma est signal\xE9 par un avertissement rouge.",
  infoValidationTitle: "Validation de la r\xE9ponse",
  infoValidationBody: "Le mod\xE8le doit r\xE9pondre UNIQUEMENT en JSON : un tableau d'objets, un par ticket actif, chacun au format { \xAB cl\xE9-du-ticket \xBB : valeur }. Chaque valeur doit respecter le sch\xE9ma de r\xE9ponse du ticket.\n\n\xC0 la fin de la g\xE9n\xE9ration, la r\xE9ponse est valid\xE9e automatiquement :\n\u2022 badge vert \xAB Format de r\xE9ponse valide \xBB ;\n\u2022 badge rouge \xAB Format de r\xE9ponse invalide \xBB avec le d\xE9tail des erreurs par ticket.\n\nLa r\xE9ponse affich\xE9e est automatiquement reformat\xE9e en JSON indent\xE9 (2 espaces) pour faciliter la lecture.\n\nLe mode de validation est configurable dans \xAB Param\xE8tres \xBB :\n\u2022 Avertir : la g\xE9n\xE9ration reste possible, l'invalidit\xE9 est simplement signal\xE9e.\n\u2022 Bloquer l'int\xE9gration : le bouton d'int\xE9gration reste d\xE9sactiv\xE9 tant que la r\xE9ponse est invalide.\n\nDepuis le code, vous pouvez aussi fournir votre propre parseur (prop \xAB parser \xBB) pour contr\xF4ler enti\xE8rement la lecture de la r\xE9ponse : il prend le pas sur la validation automatique.",
  infoFeedbackTitle: "Boucle de correction",
  infoFeedbackBody: "Quand la validation \xE9choue, un bloc \xAB Erreur \xBB appara\xEEt avec la liste d\xE9taill\xE9e des erreurs et une case \xAB Inclure les erreurs dans le prompt \xBB.\n\nEn relan\xE7ant la g\xE9n\xE9ration, ces erreurs sont inject\xE9es dans le prompt pour dire au mod\xE8le ce qu'il doit \xE9viter et lui rappeler le format attendu. D\xE9cochez la case pour relancer sans ce retour.",
  infoStatusTitle: "Statut & score",
  infoStatusBody: "La barre de statut r\xE9sume l'\xE9tat du panel : prompt syst\xE8me, instructions, contexte, fichiers, tickets et erreurs de parsing.\n\n\u2022 Vert : \xE9l\xE9ment requis correctement fourni.\n\u2022 Orange : attention (aucun fichier pr\xE9sent).\n\u2022 Rouge : \xE9l\xE9ment requis manquant.\n\nLe score global devient vert d\xE8s que tous les \xE9l\xE9ments requis sont fournis.",
  infoConfigTitle: "Provider & mod\xE8le",
  infoConfigBody: "Le bouton \xAB Param\xE8tres \xBB ouvre la configuration du panel :\n\u2022 Langue de l'interface.\n\u2022 Provider (OpenCode, shadcn, HTTP g\xE9n\xE9rique) et son activation.\n\u2022 Mod\xE8le, cl\xE9 API et URL de base selon le provider.",
  infoActionsTitle: "Actions",
  infoActionsBody: "En bas du panel :\n\u2022 \xAB Voir le prompt \xBB : aper\xE7u complet du prompt qui sera envoy\xE9.\n\u2022 \xAB G\xE9n\xE9rer \xBB : lance la g\xE9n\xE9ration en streaming (devient \xAB Annuler \xBB en cours).\n\u2022 \xAB Int\xE9grer la s\xE9lection \xBB : ouvre la revue des modifications (tickets coch\xE9s par d\xE9faut), compare chaque proposition au contenu existant et n'int\xE8gre que les tickets s\xE9lectionn\xE9s.",
  infoReviewTitle: "Revue des modifications",
  infoReviewBody: "Avant d'int\xE9grer la r\xE9ponse, le panel affiche une revue par ticket :\n\u2022 Chaque ticket est coch\xE9 par d\xE9faut ; d\xE9cochez ceux \xE0 exclure.\n\u2022 Le statut indique Identique, Modifi\xE9, Nouveau ou Supprim\xE9.\n\u2022 Les changements sont list\xE9s (ajouts, suppressions, modifications) avec le chemin concern\xE9.\n\u2022 Le bouton \xAB Diffs \xBB ouvre un dialogue c\xF4te \xE0 c\xF4te : contenu existant vs proposition, lignes num\xE9rot\xE9es, ajouts en vert et suppressions en rouge.\n\u2022 Les cl\xE9s inconnues (sans ticket associ\xE9) sont affich\xE9es mais non coch\xE9es par d\xE9faut.\n\nLe bouton \xAB Int\xE9grer la s\xE9lection (n) \xBB n'applique que les tickets coch\xE9s.",
  infoIntegrationTitle: "Int\xE9gration dans le code",
  infoIntegrationBody: "Le panel est un module React importable dans n'importe quel projet :\n\u2022 <OneShotAiPanel> : composant complet avec les props systemPrompt, files, tickets, invalidMode, parser, labels, language, adapter, onSend et onPlug.\n\u2022 onPlug(response, selectedKeys?) : re\xE7oit la r\xE9ponse et les cl\xE9s coch\xE9es dans la revue (toutes si le param\xE8tre est absent) ; appelez-le sans l'UI pour int\xE9grer la r\xE9ponse compl\xE8te.\n\u2022 useAiPanel() : hook headless pour piloter la g\xE9n\xE9ration sans l'UI (envoi du prompt, parsing, validation, streaming).\n\u2022 Revue des modifications : avant l'int\xE9gration, le panel compare chaque ticket au contenu existant (statut Identique / Modifi\xE9 / Nouveau / Supprim\xE9) et propose un dialogue \xAB Diffs \xBB c\xF4te \xE0 c\xF4te.\n\u2022 parser : fournissez votre propre fonction de parsing, prioritaire sur la validation automatique par sch\xE9ma.\n\u2022 invalidMode : \xAB warn \xBB (avertit) ou \xAB block \xBB (d\xE9sactive l'int\xE9gration tant que la r\xE9ponse est invalide).\n\u2022 showInfoIntegration / showInfoCredits / showInfoButton / showSettingsButton : masquer les blocs d'aide ou les boutons \xAB Info \xBB et \xAB Param\xE8tres \xBB ; sans l'UI, la configuration (language, adapter, invalidMode) passe par les props.\n\u2022 Adapters : OpenCode, shadcn et HTTP g\xE9n\xE9rique sont fournis ; register() permet d'ajouter vos propres providers.\n\u2022 labels : toutes les cha\xEEnes UI sont surchargeables (fr / en / par d\xE9faut) pour une localisation compl\xE8te.",
  infoCreditsTitle: "Cr\xE9dits",
  infoCreditsBody: "OneShot AI Panel est un composant React open source, con\xE7u pour \xEAtre r\xE9utilis\xE9 dans vos projets. Consultez la landing page et le d\xE9p\xF4t GitHub pour la documentation compl\xE8te, les exemples et les versions.",
  infoCreditsLandingLabel: "Landing page",
  infoCreditsGithubLabel: "D\xE9p\xF4t GitHub",
  invalidModeLabel: "Mode de validation",
  invalidModeDescription: "Comportement quand la r\xE9ponse ne respecte pas les sch\xE9mas de tickets.",
  invalidModeWarn: "Avertir",
  invalidModeBlock: "Bloquer l'int\xE9gration",
  reviewTitle: "V\xE9rification des modifications",
  reviewDescription: "Compare la r\xE9ponse de l'IA avec le contenu existant avant de l'int\xE9grer.",
  diffIdentical: "Identique",
  diffModified: "Modifi\xE9",
  diffAdded: "Nouveau",
  diffRemoved: "Supprim\xE9",
  diffSelectAll: "Tout cocher",
  diffDeselectAll: "Tout d\xE9cocher",
  diffNoChanges: "Aucun changement",
  diffUnknownTicket: "Cl\xE9 inconnue",
  diffEmptyValue: "(vide)",
  diffInclude: "Inclure ce ticket",
  plugSelected: "Int\xE9grer la s\xE9lection",
  diffViewFull: "Diffs",
  diffExisting: "Existant",
  diffProposed: "Propos\xE9",
  diffClose: "Fermer"
};

// src/module/i18n/en.ts
var en = {
  title: "OneShot AI Panel",
  systemPrompt: "System prompt",
  userPrompt: "Additional instructions",
  userPromptPlaceholder: "Additional instructions for the AI...",
  files: "Source files",
  filesDescription: "Each file must point to an absolute path or URL (local file, CDN, server, drive...) that the agent can read.",
  addFilePlaceholder: "File path or URL...",
  addFileButton: "Add",
  removeFile: "Remove",
  tickets: "Tickets",
  ticketsDescription: "Tickets describe concrete tasks for the agent to complete. Each ticket may have a description, an explanation, and an expected response schema. A ticket marked \xAB done \xBB is excluded from the prompt.",
  response: "AI Response",
  noPrompt: "No prompt",
  noPromptDesc: "Set a system prompt to guide the AI",
  noFiles: "No files",
  noFilesDesc: "Add source files (specifications, schemas)",
  noTickets: "No tickets",
  noTicketsDesc: "Add tickets to structure the AI tasks",
  noResponse: "No response",
  noResponseDesc: "Click \xAB Generate \xBB to get a response",
  generating: "Generating...",
  cancel: "Cancel",
  actionLabel: "Generate",
  plugLabel: "Plug",
  reasoning: "Reasoning",
  status: "Status",
  statusSystemPrompt: "System prompt",
  statusUserPrompt: "Additional instructions",
  statusAdditionalContext: "Additional context",
  statusFiles: "Source files",
  statusTickets: "Tickets",
  statusFeedback: "Parsing errors",
  score: "Score",
  include: "Include",
  exclude: "Exclude",
  show: "Show",
  hide: "Hide",
  showCurrentContent: "Show current content",
  hideCurrentContent: "Hide current content",
  details: "Details",
  responseSchema: "Response schema",
  error: "Error",
  provider: "AI Provider",
  configureProvider: "Configure provider",
  systemPromptPlaceholder: "Edit the system prompt...",
  additionalContext: "Additional context",
  additionalContextPlaceholder: "Add extra contextual information (code snippets, logs, constraints...)",
  viewPrompt: "Full Prompt",
  copyPrompt: "Copy prompt",
  promptCopied: "Prompt copied!",
  promptPreview: "Complete assembled prompt",
  promptCharCount: "characters",
  languageLabel: "Language",
  languageDescription: "Display language for panel labels",
  settings: "Settings",
  selectProvider: "AI Provider",
  enableProvider: "Enabled",
  disableProvider: "Disabled",
  helpSection: "Help",
  docLinks: "Documentation",
  modelLabel: "Model",
  modelPlaceholder: "Model (e.g. gpt-4o)",
  modelNone: "None",
  apiKeyLabel: "API Key",
  apiKeyPlaceholder: "sk-...",
  baseUrlLabel: "Base URL",
  baseUrlPlaceholder: "https://...",
  promptSectionFiles: "--- Source files ---",
  promptSectionTickets: "--- Tickets ---",
  promptSectionUserPrompt: "--- Additional instructions ---",
  promptSectionAdditionalContext: "--- Additional context ---",
  promptSectionFeedback: "--- Previous generation errors ---",
  feedbackDescription: "Here are the parsing errors of the previous response. Avoid repeating these errors and strictly respect the requested response format.",
  includeErrorsInPrompt: "Include errors in the prompt",
  ticketDescription: "Description",
  ticketExplanation: "Explanation",
  ticketExistingContent: "Existing content",
  ticketNoExistingContent: "No pre-existing content",
  ticketMissingSchema: "Response schema required",
  noExistingContent: "No content",
  noExistingContentDesc: "This ticket has no value yet",
  responseValid: "Valid response format",
  responseInvalid: "Invalid response format",
  responseFormatInstruction: 'Reply ONLY in JSON: an array of objects, one per active ticket. Each object must have exactly one key equal to the ticket key, and its value must respect the response schema of the matching ticket. Example: [ { "ticket-key" : { ... } } ]',
  validationErrorNotJson: "Response is not valid JSON",
  validationErrorNotArray: "Response must be an array of objects",
  validationErrorKeyExpected: "Each element must have exactly one ticket key",
  validationErrorUnknownTicket: "Unknown ticket key",
  validationErrorMissingTicket: "Missing response for ticket",
  validationErrorSchema: "Does not match the response schema",
  errorNoStream: "The handler did not return a stream",
  errorUnknown: "Unknown error",
  errorStreaming: "Streaming error",
  infoButton: "Info",
  infoSheetTitle: "OneShot AI Panel",
  infoSheetDescription: "AI-driven generation assistant: source files, tickets to process, validated JSON responses and a correction loop.",
  infoOverviewTitle: "Overview",
  infoOverviewBody: "OneShot AI Panel is an assistant driven by a language model. Describe the goal, provide source files and tickets to process, then the model generates a JSON response validated against each ticket's schema.\n\nGeneration streams in real time with the model's reasoning, and the response is displayed as indented JSON. A review then compares each proposal against the existing content before plugging it in.\n\nThe panel is configurable (provider, model, language) and fully localizable. This help is shown in the active language.",
  infoPromptTitle: "The prompt",
  infoPromptBody: "The prompt is made of three fields:\n\u2022 System prompt: the model's role and rules (always sent).\n\u2022 Additional instructions: your precise request (optional).\n\u2022 Additional context: complementary information (optional).\n\nThe 'View prompt' button shows the exact message that will be sent, and 'Copy' lets you reuse it.",
  infoFilesTitle: "Source files",
  infoFilesBody: "Provide files or URLs (server, CDN, drive) that the model reads by itself.\n\n\u2022 A file is defined by a label and an absolute path or URL.\n\u2022 Include / Exclude enables or disables a file in the prompt.\n\u2022 A file marked 'not present' is simply ignored when sending.\n\u2022 The field at the bottom of the section adds a path or URL on the fly.\n\nThe panel does not convert file contents: the model reads them.",
  infoTicketsTitle: "Tickets",
  infoTicketsBody: "Tickets describe the tasks to complete. Every top-level ticket requires a response schema (JSON Schema) describing the expected output format.\n\n\u2022 Description: the ticket's goal.\n\u2022 Explanation: the method to follow.\n\u2022 Existing content: content already present to enrich or replace. It is compared against the AI proposal in the review before plugging in.\n\u2022 Sub-tickets: splitting the task into sub-steps.\n\nA top-level ticket without a schema is flagged with a red warning.",
  infoValidationTitle: "Response validation",
  infoValidationBody: "The model must answer in JSON ONLY: an array of objects, one per active ticket, each shaped { 'ticket-key': value }. Every value must follow the ticket's response schema.\n\nWhen generation ends, the response is validated automatically:\n\u2022 green badge 'Valid response format';\n\u2022 red badge 'Invalid response format' with per-ticket error details.\n\nThe displayed response is automatically reformatted as indented JSON (2 spaces) for easier reading.\n\nThe validation mode is configurable in 'Settings':\n\u2022 Warn: generation stays possible, invalid responses are simply flagged.\n\u2022 Block integration: the integration button stays disabled while the response is invalid.\n\nFrom code, you can also provide your own parser (the 'parser' prop) to fully control how the response is read: it takes precedence over the automatic validation.",
  infoFeedbackTitle: "Correction loop",
  infoFeedbackBody: "When validation fails, an 'Error' block appears with the detailed error list and a checkbox 'Include errors in the prompt'.\n\nRestarting generation injects these errors into the prompt so the model knows what to avoid and is reminded of the expected format. Uncheck the box to restart without this feedback.",
  infoStatusTitle: "Status & score",
  infoStatusBody: "The status bar summarizes the panel state: system prompt, instructions, context, files, tickets and parsing errors.\n\n\u2022 Green: required element correctly provided.\n\u2022 Orange: warning (no file present).\n\u2022 Red: required element missing.\n\nThe global score turns green as soon as every required element is provided.",
  infoConfigTitle: "Provider & model",
  infoConfigBody: "The 'Settings' button opens the panel configuration:\n\u2022 Interface language.\n\u2022 Provider (OpenCode, shadcn, generic HTTP) and its enablement.\n\u2022 Model, API key and base URL depending on the provider.",
  infoActionsTitle: "Actions",
  infoActionsBody: "At the bottom of the panel:\n\u2022 'View prompt': full preview of the prompt that will be sent.\n\u2022 'Generate': starts streaming generation (becomes 'Cancel' while running).\n\u2022 'Plug selection': opens the review (tickets checked by default), compares each proposal against the existing content, and only plugs in the selected tickets.",
  infoReviewTitle: "Review changes",
  infoReviewBody: "Before plugging the response in, the panel shows a per-ticket review:\n\u2022 Each ticket is checked by default; uncheck the ones to exclude.\n\u2022 The status shows Identical, Modified, New or Removed.\n\u2022 Changes are listed (additions, removals, edits) with the affected path.\n\u2022 The 'Diffs' button opens a side-by-side dialog: existing vs proposed content, numbered lines, additions in green and removals in red.\n\u2022 Unknown keys (no associated ticket) are shown but not checked by default.\n\nThe 'Plug selection (n)' button only applies the checked tickets.",
  infoIntegrationTitle: "Code integration",
  infoIntegrationBody: "The panel is an importable React module in any project:\n\u2022 <OneShotAiPanel>: full component with the props systemPrompt, files, tickets, invalidMode, parser, labels, language, adapter, onSend and onPlug.\n\u2022 onPlug(response, selectedKeys?): receives the response and the keys checked in the review (all of them when the parameter is omitted); call it without the UI to plug in the full response.\n\u2022 useAiPanel(): headless hook to drive generation without the UI (prompt sending, parsing, validation, streaming).\n\u2022 Review: before plugging in, the panel compares each ticket against the existing content (Identical / Modified / New / Removed status) and offers a side-by-side 'Diffs' dialog.\n\u2022 parser: provide your own parsing function, taking precedence over the automatic schema-based validation.\n\u2022 invalidMode: 'warn' (warns) or 'block' (disables integration while the response is invalid).\n\u2022 showInfoIntegration / showInfoCredits / showInfoButton / showSettingsButton: hide help blocks or the 'Info' and 'Settings' buttons; without the UI, the configuration (language, adapter, invalidMode) goes through the props.\n\u2022 Adapters: OpenCode, shadcn and generic HTTP are provided; register() lets you add your own providers.\n\u2022 labels: every UI string is overridable (fr / en / defaults) for full localization.",
  infoCreditsTitle: "Credits",
  infoCreditsBody: "OneShot AI Panel is an open-source React component, built to be reused in your projects. Check out the landing page and the GitHub repository for full documentation, examples and releases.",
  infoCreditsLandingLabel: "Landing page",
  infoCreditsGithubLabel: "GitHub repository",
  invalidModeLabel: "Validation mode",
  invalidModeDescription: "Behavior when the response does not match the ticket schemas.",
  invalidModeWarn: "Warn",
  invalidModeBlock: "Block integration",
  reviewTitle: "Review changes",
  reviewDescription: "Compare the AI response with the existing content before plugging it in.",
  diffIdentical: "Identical",
  diffModified: "Modified",
  diffAdded: "New",
  diffRemoved: "Removed",
  diffSelectAll: "Select all",
  diffDeselectAll: "Deselect all",
  diffNoChanges: "No changes",
  diffUnknownTicket: "Unknown key",
  diffEmptyValue: "(empty)",
  diffInclude: "Include this ticket",
  plugSelected: "Plug selection",
  diffViewFull: "Diffs",
  diffExisting: "Existing",
  diffProposed: "Proposed",
  diffClose: "Close"
};

// src/module/i18n/registry.ts
var translations = {
  [AiPanelLanguage.Fr]: fr,
  [AiPanelLanguage.En]: en
};

// src/module/adapters/models.ts
var OpenCodeModels = {
  None: "",
  BigPickle: "big-pickle",
  Gpt4o: "gpt-4o",
  Gpt4oMini: "gpt-4o-mini",
  ClaudeSonnet35: "claude-3.5-sonnet",
  DeepseekChat: "deepseek-chat",
  DeepSeekV4FlashFree: "deepseek-v4-flash-free",
  MiMoV25Free: "mimo-v2.5-free",
  LagunaS21Free: "laguna-s-2.1-free",
  Ling30FlashFree: "ling-3.0-flash-free",
  NorthMiniCodeFree: "north-mini-code-free",
  Nemotron3UltraFree: "nemotron-3-ultra-free",
  Nemotron3SuperFree: "nemotron-3-super-free",
  MiniMaxM3: "minimax-m3",
  MiniMaxM27: "minimax-m2.7",
  MiniMaxM25: "minimax-m2.5",
  MiniMaxM25Free: "minimax-m2.5-free",
  GLM52: "glm-5.2",
  GLM51: "glm-5.1",
  KimiK25: "kimi-k2.5",
  KimiK26: "kimi-k2.6",
  KimiK2Thinking: "kimi-k2-thinking",
  KimiK2: "kimi-k2",
  Qwen3Coder480B: "qwen3-coder",
  Qwen36Plus: "qwen3.6-plus",
  Qwen35Plus: "qwen3.5-plus",
  Qwen37Max: "qwen3.7-max",
  Qwen37Plus: "qwen3.7-plus",
  GoGrok45: "opencode-go/grok-4.5",
  GoGLM52: "opencode-go/glm-5.2",
  GoGLM51: "opencode-go/glm-5.1",
  GoKimiK3: "opencode-go/kimi-k3",
  GoKimiK27Code: "opencode-go/kimi-k2.7-code",
  GoKimiK26: "opencode-go/kimi-k2.6",
  GoMiMoV25Pro: "opencode-go/mimo-v2.5-pro",
  GoMiMoV25: "opencode-go/mimo-v2.5",
  GoQwen37Max: "opencode-go/qwen3.7-max",
  GoQwen37Plus: "opencode-go/qwen3.7-plus",
  GoQwen36Plus: "opencode-go/qwen3.6-plus",
  GoMiniMaxM27: "opencode-go/minimax-m2.7",
  GoMiniMaxM3: "opencode-go/minimax-m3",
  GoDeepSeekV4Pro: "opencode-go/deepseek-v4-pro",
  GoDeepSeekV4Flash: "opencode-go/deepseek-v4-flash",
  GoHy3: "opencode-go/hy3"
};
var ShadcnModels = {
  None: "",
  Gpt4o: "gpt-4o",
  Gpt4oMini: "gpt-4o-mini",
  Gpt41: "gpt-4.1",
  ClaudeSonnet4: "claude-sonnet-4-20250514",
  ClaudeSonnet35: "claude-3.5-sonnet",
  ClaudeHaiku35: "claude-3.5-haiku",
  Gemini20Flash: "gemini-2.0-flash"
};
var MODEL_NAMES = {
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-4.1": "GPT-4.1",
  "claude-sonnet-4-20250514": "Claude Sonnet 4",
  "claude-3.5-sonnet": "Claude 3.5 Sonnet",
  "claude-3.5-haiku": "Claude 3.5 Haiku",
  "gemini-2.0-flash": "Gemini 2.0 Flash",
  "deepseek-chat": "DeepSeek Chat",
  "big-pickle": "Big Pickle",
  "deepseek-v4-flash-free": "DeepSeek V4 Flash Free",
  "mimo-v2.5-free": "MiMo-V2.5 Free",
  "laguna-s-2.1-free": "Laguna S 2.1 Free",
  "ling-3.0-flash-free": "Ling-3.0 Flash Free",
  "north-mini-code-free": "North Mini Code Free",
  "nemotron-3-ultra-free": "Nemotron 3 Ultra Free",
  "nemotron-3-super-free": "Nemotron 3 Super Free",
  "minimax-m3": "MiniMax M3",
  "minimax-m2.7": "MiniMax M2.7",
  "minimax-m2.5": "MiniMax M2.5",
  "minimax-m2.5-free": "MiniMax M2.5 Free",
  "glm-5.2": "GLM 5.2",
  "glm-5.1": "GLM 5.1",
  "kimi-k2.5": "Kimi K2.5",
  "kimi-k2.6": "Kimi K2.6",
  "kimi-k2-thinking": "Kimi K2 Thinking",
  "kimi-k2": "Kimi K2",
  "qwen3-coder": "Qwen3 Coder 480B",
  "qwen3.6-plus": "Qwen3.6 Plus",
  "qwen3.5-plus": "Qwen3.5 Plus",
  "qwen3.7-max": "Qwen3.7 Max",
  "qwen3.7-plus": "Qwen3.7 Plus",
  "opencode-go/grok-4.5": "Go \xB7 Grok 4.5",
  "opencode-go/glm-5.2": "Go \xB7 GLM 5.2",
  "opencode-go/glm-5.1": "Go \xB7 GLM 5.1",
  "opencode-go/kimi-k3": "Go \xB7 Kimi K3",
  "opencode-go/kimi-k2.7-code": "Go \xB7 Kimi K2.7 Code",
  "opencode-go/kimi-k2.6": "Go \xB7 Kimi K2.6",
  "opencode-go/mimo-v2.5-pro": "Go \xB7 MiMo-V2.5 Pro",
  "opencode-go/mimo-v2.5": "Go \xB7 MiMo-V2.5",
  "opencode-go/qwen3.7-max": "Go \xB7 Qwen3.7 Max",
  "opencode-go/qwen3.7-plus": "Go \xB7 Qwen3.7 Plus",
  "opencode-go/qwen3.6-plus": "Go \xB7 Qwen3.6 Plus",
  "opencode-go/minimax-m2.7": "Go \xB7 MiniMax M2.7",
  "opencode-go/minimax-m3": "Go \xB7 MiniMax M3",
  "opencode-go/deepseek-v4-pro": "Go \xB7 DeepSeek V4 Pro",
  "opencode-go/deepseek-v4-flash": "Go \xB7 DeepSeek V4 Flash",
  "opencode-go/hy3": "Go \xB7 Hy3"
};
function modelDisplayName(model) {
  if (!model) return "";
  return MODEL_NAMES[model] ?? model;
}

// src/module/adapters/types.ts
var ProviderType = {
  Opencode: "opencode",
  Shadcn: "shadcn",
  Fallback: "fallback"
};
var PROVIDER_META = {
  [ProviderType.Opencode]: {
    value: ProviderType.Opencode,
    label: "OpenCode",
    description: "Connexion native via le SDK OpenCode",
    models: Object.values(OpenCodeModels).filter(Boolean),
    docLinks: [
      { label: "OpenCode Docs", url: "https://opencode.ai/docs" }
    ]
  },
  [ProviderType.Shadcn]: {
    value: ProviderType.Shadcn,
    label: "shadcn AI SDK",
    description: "D\xE9mo / d\xE9veloppement via @shadcn/helpers",
    models: Object.values(ShadcnModels).filter(Boolean),
    docLinks: [
      { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" }
    ]
  },
  [ProviderType.Fallback]: {
    value: ProviderType.Fallback,
    label: "HTTP Fallback",
    description: "API HTTP directe (sans SDK)",
    models: [],
    docLinks: [
      { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" }
    ]
  }
};

// src/module/adapters/registry.ts
var registry = /* @__PURE__ */ new Map();
function register(type, factory) {
  registry.set(type, factory);
}
function buildSend(config) {
  const AdapterClass = registry.get(config.type);
  if (!AdapterClass) {
    throw new Error(`Unknown adapter type: ${config.type}`);
  }
  const adapter = new AdapterClass(config);
  return (prompt) => adapter.send(prompt);
}

// src/module/adapters/fallback.ts
var FallbackAdapter = class {
  constructor(config) {
    this.type = ProviderType.Fallback;
    this.apiUrl = config.apiUrl ?? "/api/ai/generate";
  }
  async send(prompt) {
    const res = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      throw new Error(`AI request failed: ${res.status} ${res.statusText}`);
    }
    return res.body;
  }
};

// src/module/adapters/shadcn.ts
var ShadcnAdapter = class {
  constructor(_config) {
    this.type = ProviderType.Shadcn;
  }
  async send(prompt) {
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        const words = prompt.split(/\s+/);
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 30));
        }
        controller.close();
      }
    });
  }
};

// src/module/adapters/opencode.ts
import { createOpencodeClient } from "@opencode-ai/sdk/client";
var DEFAULT_OPENCODE_URL = "http://localhost:4096";
var OpenCodeAdapter = class {
  constructor(config) {
    this.type = ProviderType.Opencode;
    this.baseUrl = config.apiUrl ?? DEFAULT_OPENCODE_URL;
    this.modelId = config.model;
    this.client = createOpencodeClient({
      baseUrl: this.baseUrl,
      throwOnError: true,
      headers: config.password ? { Authorization: `Bearer ${config.password}` } : void 0
    });
  }
  async createSession() {
    let session;
    try {
      session = await this.client.session.create({ body: { title: "ai-panel" } });
    } catch (err) {
      throw new Error(
        `Impossible de contacter le serveur OpenCode (${this.baseUrl}). V\xE9rifie qu'il est lanc\xE9.
${err?.message ?? ""}`
      );
    }
    const sid = session?.data?.id;
    if (!sid) {
      throw new Error("\xC9chec de cr\xE9ation de session OpenCode");
    }
    return sid;
  }
  async send(prompt) {
    const sessionId = await this.createSession();
    const body = {
      model: this.modelId ? { providerID: "opencode", modelID: this.modelId } : void 0,
      parts: [{ type: "text", text: prompt }]
    };
    let events;
    try {
      const sse = await this.client.event.subscribe({});
      events = sse.stream;
    } catch {
      events = void 0;
    }
    const promptPromise = this.client.session.prompt({
      path: { id: sessionId },
      body
    });
    const encoder = new TextEncoder();
    let closed = false;
    return new ReadableStream({
      start: async (controller) => {
        const emit = (frame) => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(`${JSON.stringify(frame)}
`));
          } catch {
            closed = true;
          }
        };
        const close = () => {
          if (closed) return;
          closed = true;
          void events?.return(void 0);
          try {
            controller.close();
          } catch {
          }
        };
        const fail = (err) => {
          if (closed) return;
          closed = true;
          void events?.return(void 0);
          try {
            controller.error(err);
          } catch {
          }
        };
        const consumeEvents = async () => {
          if (!events) return;
          const reasoningSeen = /* @__PURE__ */ new Set();
          try {
            for await (const evt of events) {
              if (closed) return;
              if (evt.type === "message.part.delta") {
                const props2 = evt.properties;
                if (props2.sessionID !== sessionId) continue;
                if (props2.field === "reasoning") {
                  if (props2.partID) reasoningSeen.add(props2.partID);
                  if (props2.delta) emit({ t: "reasoning", d: props2.delta });
                } else if (props2.field === "text" && props2.delta) {
                  emit({ t: "text", d: props2.delta });
                }
                continue;
              }
              if (evt.type !== "message.part.updated") continue;
              const props = evt.properties;
              const part = props.part;
              if (!part || part.sessionID !== sessionId || part.type !== "reasoning") continue;
              if (!part.id || reasoningSeen.has(part.id)) continue;
              if (part.text) emit({ t: "reasoning", d: part.text, snapshot: true });
            }
          } catch {
          }
        };
        const consumePrompt = async () => {
          try {
            const result = await promptPromise;
            if (closed) return;
            const responseData = result?.data;
            if (!responseData) {
              fail(new Error("Le serveur n'a pas retourn\xE9 de r\xE9ponse valide"));
              return;
            }
            const info = responseData.info;
            const structured = info?.structured ?? info?.structured_output;
            if (structured) {
              const text = JSON.stringify(structured, null, 2);
              emit({ t: "text", d: text, snapshot: true });
            } else {
              const parts = responseData.parts ?? [];
              let text = "";
              for (const p of parts) {
                if (p.type === "text" && "text" in p) {
                  text += (p.text ?? "") + "\n";
                }
              }
              text = text.trimEnd();
              if (text) emit({ t: "text", d: text, snapshot: true });
            }
            close();
          } catch (err) {
            fail(err);
          }
        };
        void consumeEvents();
        await consumePrompt();
      },
      cancel: async () => {
        closed = true;
        try {
          await this.client.session.abort({ path: { id: sessionId } });
        } catch {
        }
      }
    });
  }
};

// src/module/adapters/register-defaults.ts
var registered = false;
function registerDefaultAdapters() {
  if (registered) return;
  registered = true;
  register(ProviderType.Opencode, OpenCodeAdapter);
  register(ProviderType.Fallback, FallbackAdapter);
  register(ProviderType.Shadcn, ShadcnAdapter);
}

// src/module/i18n/provider-info.ts
var PROVIDER_INFO = {
  [AiPanelLanguage.Fr]: {
    [ProviderType.Opencode]: {
      description: "Connexion native au serveur OpenCode",
      help: "Ouvre un terminal et lance le serveur :\n\n  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\nD\xE9fauts : port=4096, hostname=127.0.0.1.\n--cors peut \xEAtre r\xE9p\xE9t\xE9 pour autoriser plusieurs origines.\n\nPour activer l'authentification, d\xE9finis la variable d'environnement :\n  OPENCODE_SERVER_PASSWORD=ton-mot-de-passe\n\nPuis renseigne le mot de passe ci-dessous.",
      modelPlaceholder: "Mod\xE8le (laiss\xE9 vide pour le d\xE9faut du serveur)",
      apiKeyLabel: "Mot de passe (optionnel)",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "URL du serveur",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "Documentation OpenCode", url: "https://opencode.ai/docs" },
        { label: "D\xE9p\xF4t GitHub", url: "https://github.com/anomalyco/opencode" }
      ]
    },
    [ProviderType.Shadcn]: {
      description: "Utilise le SDK @shadcn/helpers avec un provider AI (OpenAI, Anthropic...)",
      help: "Configure une cl\xE9 API aupr\xE8s de ton provider (OpenAI, Anthropic, etc.) et renseigne-la ci-dessous. Le SDK utilise le mod\xE8le s\xE9lectionn\xE9 pour g\xE9n\xE9rer les r\xE9ponses.",
      modelPlaceholder: "Mod\xE8le (ex: gpt-4o)",
      apiKeyLabel: "Cl\xE9 API",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "URL de base",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://ui.shadcn.com/docs/helpers/ai-sdk" },
        { label: "OpenAI API Keys", url: "https://platform.openai.com/api-keys" }
      ]
    },
    [ProviderType.Fallback]: {
      description: "Requ\xEAte HTTP directe vers une API externe",
      help: "Le panel envoie une requ\xEAte POST \xE0 l'URL configur\xE9e avec un body JSON { prompt }. La r\xE9ponse doit \xEAtre un ReadableStream ou du texte brut. Utilise ce mode pour une API compatible OpenAI ou un proxy custom.",
      modelPlaceholder: "Mod\xE8le (non utilis\xE9 en fallback)",
      apiKeyLabel: "Cl\xE9 API",
      apiKeyPlaceholder: "Optionnelle (transmise dans l'en-t\xEAte Authorization)",
      baseUrlLabel: "URL de l'API",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" }
      ]
    }
  },
  [AiPanelLanguage.En]: {
    [ProviderType.Opencode]: {
      description: "Native connection to the OpenCode server",
      help: "Open a terminal and start the server:\n\n  opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]\n\nDefaults: port=4096, hostname=127.0.0.1.\n--cors can be repeated to allow multiple origins.\n\nTo enable authentication, set the environment variable:\n  OPENCODE_SERVER_PASSWORD=your-password\n\nThen enter the password below.",
      modelPlaceholder: "Model (leave empty for server default)",
      apiKeyLabel: "Password (optional)",
      apiKeyPlaceholder: "OPENCODE_SERVER_PASSWORD",
      baseUrlLabel: "Server URL",
      baseUrlPlaceholder: "http://localhost:4096",
      docLinks: [
        { label: "OpenCode Docs", url: "https://opencode.ai/docs" },
        { label: "GitHub Repository", url: "https://github.com/anomalyco/opencode" }
      ]
    },
    [ProviderType.Shadcn]: {
      description: "Uses the @shadcn/helpers SDK with an AI provider (OpenAI, Anthropic...)",
      help: "Configure an API key from your provider (OpenAI, Anthropic, etc.) and enter it below. The SDK uses the selected model to generate responses.",
      modelPlaceholder: "Model (e.g. gpt-4o)",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "sk-...",
      baseUrlLabel: "Base URL",
      baseUrlPlaceholder: "https://api.openai.com/v1",
      docLinks: [
        { label: "@shadcn/helpers", url: "https://shadcn.com/docs/helpers/ai-sdk" },
        { label: "OpenAI API Keys", url: "https://platform.openai.com/api-keys" }
      ]
    },
    [ProviderType.Fallback]: {
      description: "Direct HTTP request to an external API",
      help: "The panel sends a POST request to the configured URL with a JSON body { prompt }. The response must be a ReadableStream or raw text. Use this mode for an OpenAI-compatible API or a custom proxy.",
      modelPlaceholder: "Model (not used in fallback mode)",
      apiKeyLabel: "API Key",
      apiKeyPlaceholder: "Optional (sent in the Authorization header)",
      baseUrlLabel: "API URL",
      baseUrlPlaceholder: "/api/ai/generate",
      docLinks: [
        { label: "MDN fetch", url: "https://developer.mozilla.org/en-US/docs/Web/API/fetch" }
      ]
    }
  }
};

// src/module/hooks/useAiPanel.ts
import { useState as useState2, useCallback as useCallback2, useRef as useRef2 } from "react";

// src/module/types.ts
var AiPanelStatus = {
  Idle: "idle",
  Loading: "loading",
  Streaming: "streaming",
  Done: "done",
  Error: "error"
};
var AiPanelJsonType = {
  Object: "object",
  Array: "array",
  String: "string",
  Number: "number",
  Integer: "integer",
  Boolean: "boolean",
  Null: "null"
};
var AiPanelInvalidMode = {
  Warn: "warn",
  Block: "block"
};

// src/module/hooks/useStreaming.ts
import { useState, useRef, useCallback } from "react";
function parseFrame(line) {
  const trimmed = line.endsWith("\n") ? line.slice(0, -1) : line;
  if (!trimmed.startsWith("{")) return null;
  try {
    const obj = JSON.parse(trimmed);
    if (obj && typeof obj === "object" && (obj.t === "text" || obj.t === "reasoning") && typeof obj.d === "string") {
      return obj;
    }
  } catch {
  }
  return null;
}
function useStreaming() {
  const [text, setText] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);
  const start = useCallback(async (stream, onComplete, onError) => {
    const abort = new AbortController();
    abortRef.current = abort;
    setIsStreaming(true);
    setText("");
    setReasoning("");
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    const appendText = (s) => {
      fullText += s;
      setText((prev) => prev + s);
    };
    const setTextSnapshot = (s) => {
      fullText = s;
      setText(s);
    };
    const applyFrame = (frame) => {
      if (frame.t === "reasoning") {
        if (frame.snapshot) setReasoning(frame.d);
        else setReasoning((prev) => prev + frame.d);
      } else if (frame.snapshot) {
        setTextSnapshot(frame.d);
      } else {
        appendText(frame.d);
      }
    };
    try {
      const reader = stream.getReader();
      while (true) {
        if (abort.signal.aborted) {
          reader.cancel();
          break;
        }
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        let nlIndex;
        while ((nlIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nlIndex + 1);
          buffer = buffer.slice(nlIndex + 1);
          const frame = parseFrame(line);
          if (frame) {
            applyFrame(frame);
          } else {
            appendText(line);
          }
        }
      }
      if (buffer) {
        const frame = parseFrame(buffer);
        if (frame) {
          applyFrame(frame);
        } else {
          appendText(buffer);
        }
      }
      setIsStreaming(false);
      if (!abort.signal.aborted) {
        onComplete?.(fullText);
      }
    } catch (err) {
      setIsStreaming(false);
      if (abort.signal.aborted) return;
      onError?.(err);
    }
  }, []);
  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);
  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setText("");
    setReasoning("");
    setIsStreaming(false);
  }, []);
  return { text, reasoning, isStreaming, start, cancel, reset };
}

// src/module/lib/validate.ts
import { z } from "zod";
function extractJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : trimmed).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}
function validateTicketsResponse(raw, activeTickets, labels) {
  const parsed = extractJson(raw);
  if (parsed === null) {
    return { validation: { ok: false, errors: [labels.validationErrorNotJson] } };
  }
  if (!Array.isArray(parsed)) {
    return { parsed, validation: { ok: false, errors: [labels.validationErrorNotArray] } };
  }
  const errors = [];
  const ticketErrors = [];
  const covered = /* @__PURE__ */ new Set();
  parsed.forEach((item, index) => {
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      ticketErrors.push({ ticketKey: String(index), index, errors: [labels.validationErrorKeyExpected] });
      return;
    }
    const entry = item;
    const keys = Object.keys(entry);
    if (keys.length !== 1) {
      ticketErrors.push({ ticketKey: keys.join(", ") || String(index), index, errors: [labels.validationErrorKeyExpected] });
      return;
    }
    const ticketKey = keys[0];
    const ticket = activeTickets.find((t) => t.key === ticketKey);
    if (!ticket) {
      ticketErrors.push({ ticketKey, index, errors: [labels.validationErrorUnknownTicket] });
      return;
    }
    covered.add(ticketKey);
    if (ticket.responseSchema) {
      try {
        const zodSchema = z.fromJSONSchema(ticket.responseSchema);
        const result = zodSchema.safeParse(entry[ticketKey]);
        if (!result.success) {
          ticketErrors.push({ ticketKey, index, errors: result.error.issues.map((issue) => issue.message) });
        }
      } catch {
        ticketErrors.push({ ticketKey, index, errors: [labels.validationErrorSchema] });
      }
    }
  });
  const missing = activeTickets.filter((t) => !covered.has(t.key));
  if (missing.length > 0) {
    errors.push(`${labels.validationErrorMissingTicket} : ${missing.map((t) => t.label).join(", ")}`);
  }
  const validation = {
    ok: errors.length === 0 && ticketErrors.length === 0,
    errors,
    ...ticketErrors.length > 0 ? { ticketErrors } : {}
  };
  return { parsed, validation };
}

// src/module/lib/defaults.ts
var defaultLabels = {
  title: "OneShot AI Panel",
  systemPrompt: "Prompt syst\xE8me",
  userPrompt: "Instructions suppl\xE9mentaires",
  userPromptPlaceholder: "Instructions suppl\xE9mentaires pour l'IA...",
  files: "Fichiers source",
  filesDescription: "Chaque fichier doit pointer vers un chemin absolu ou une URL (fichier local, CDN, serveur, drive...) que l'agent pourra consulter.",
  addFilePlaceholder: "Chemin ou URL du fichier...",
  addFileButton: "Ajouter",
  removeFile: "Retirer",
  tickets: "Tickets",
  ticketsDescription: "Les tickets d\xE9crivent les t\xE2ches concr\xE8tes \xE0 r\xE9aliser par l'agent. Chaque ticket peut avoir une description, une explication, et un sch\xE9ma de r\xE9ponse attendu. Un ticket marqu\xE9 \xAB fait \xBB est exclu du prompt.",
  response: "R\xE9ponse IA",
  noPrompt: "Aucun prompt",
  noPromptDesc: "D\xE9finissez un prompt syst\xE8me pour guider l'IA",
  noFiles: "Aucun fichier",
  noFilesDesc: "Ajoutez des fichiers source (sp\xE9cifications, sch\xE9mas)",
  noTickets: "Aucun ticket",
  noTicketsDesc: "Ajoutez des tickets pour structurer les t\xE2ches de l'IA",
  noResponse: "Aucune r\xE9ponse",
  noResponseDesc: "Cliquez sur \xAB G\xE9n\xE9rer \xBB pour obtenir une r\xE9ponse",
  generating: "G\xE9n\xE9ration en cours...",
  cancel: "Annuler",
  actionLabel: "G\xE9n\xE9rer",
  plugLabel: "Plugger",
  reasoning: "Raisonnement",
  status: "Statut",
  statusSystemPrompt: "Prompt syst\xE8me",
  statusUserPrompt: "Instructions suppl\xE9mentaires",
  statusAdditionalContext: "Contexte additionnel",
  statusFiles: "Fichiers source",
  statusTickets: "Tickets",
  statusFeedback: "Erreurs de parsing",
  score: "Score",
  include: "Inclure",
  exclude: "Exclure",
  show: "Afficher",
  hide: "Masquer",
  showCurrentContent: "Afficher le contenu actuel",
  hideCurrentContent: "Masquer le contenu actuel",
  details: "D\xE9tails",
  responseSchema: "Sch\xE9ma de r\xE9ponse",
  error: "Erreur",
  provider: "Provider IA",
  configureProvider: "Configurer le provider",
  systemPromptPlaceholder: "Modifiez le prompt syst\xE8me...",
  additionalContext: "Contexte additionnel",
  additionalContextPlaceholder: "Ajoutez des informations contextuelles suppl\xE9mentaires (extraits de code, logs, contraintes...)",
  viewPrompt: "Voir le prompt complet",
  copyPrompt: "Copier le prompt",
  promptCopied: "Prompt copi\xE9 !",
  promptPreview: "Prompt complet assembl\xE9",
  promptCharCount: "caract\xE8res",
  languageLabel: "Langue",
  languageDescription: "Langue d'affichage des libell\xE9s du panneau",
  settings: "Param\xE8tres",
  selectProvider: "Provider IA",
  enableProvider: "Activ\xE9",
  disableProvider: "D\xE9sactiv\xE9",
  helpSection: "Aide",
  docLinks: "Documentation",
  modelLabel: "Mod\xE8le",
  modelPlaceholder: "Mod\xE8le (ex: gpt-4o)",
  modelNone: "Aucun",
  apiKeyLabel: "Cl\xE9 API",
  apiKeyPlaceholder: "sk-...",
  baseUrlLabel: "URL de base",
  baseUrlPlaceholder: "https://...",
  promptSectionFiles: "--- Fichiers source ---",
  promptSectionTickets: "--- Tickets \xE0 traiter ---",
  promptSectionUserPrompt: "--- Instructions suppl\xE9mentaires ---",
  promptSectionAdditionalContext: "--- Contexte additionnel ---",
  promptSectionFeedback: "--- Erreurs de la g\xE9n\xE9ration pr\xE9c\xE9dente ---",
  feedbackDescription: "Voici les erreurs de parsing de la r\xE9ponse pr\xE9c\xE9dente. \xC9vite de reproduire ces erreurs et respecte strictement le format de r\xE9ponse demand\xE9.",
  includeErrorsInPrompt: "Inclure les erreurs dans le prompt",
  ticketDescription: "Description",
  ticketExplanation: "Explication",
  ticketExistingContent: "Contenu existant",
  ticketNoExistingContent: "Aucun contenu pr\xE9-existant",
  ticketMissingSchema: "Sch\xE9ma de r\xE9ponse requis",
  noExistingContent: "Aucun contenu",
  noExistingContentDesc: "Ce ticket n'a pas encore de valeur",
  responseValid: "Format de r\xE9ponse valide",
  responseInvalid: "Format de r\xE9ponse invalide",
  responseFormatInstruction: `R\xE9ponds UNIQUEMENT en JSON : un tableau d'objets, un par ticket actif. Chaque objet doit avoir exactement une cl\xE9 \xE9gale \xE0 la cl\xE9 du ticket, et sa valeur doit respecter le sch\xE9ma de r\xE9ponse du ticket correspondant. Exemple : [ { "cle-du-ticket" : { ... } } ]`,
  validationErrorNotJson: "La r\xE9ponse n'est pas un JSON valide",
  validationErrorNotArray: "La r\xE9ponse doit \xEAtre un tableau d'objets",
  validationErrorKeyExpected: "Chaque \xE9l\xE9ment doit avoir exactement une cl\xE9 de ticket",
  validationErrorUnknownTicket: "Cl\xE9 de ticket inconnue",
  validationErrorMissingTicket: "R\xE9ponse manquante pour le ticket",
  validationErrorSchema: "Ne respecte pas le sch\xE9ma de r\xE9ponse",
  errorNoStream: "Le handler n'a pas retourn\xE9 de stream",
  errorUnknown: "Erreur inconnue",
  errorStreaming: "Erreur de streaming",
  infoButton: "Info",
  infoSheetTitle: "OneShot AI Panel",
  infoSheetDescription: "Assistant de g\xE9n\xE9ration pilot\xE9 par IA : fichiers source, tickets \xE0 traiter, r\xE9ponses JSON valid\xE9es et boucle de correction.",
  infoOverviewTitle: "Vue d'ensemble",
  infoOverviewBody: "OneShot AI Panel est un g\xE9n\xE9rateur pilot\xE9 par un mod\xE8le de langage. Vous d\xE9crivez l'objectif, fournissez des fichiers source et des tickets \xE0 traiter, puis le mod\xE8le g\xE9n\xE8re une r\xE9ponse JSON valid\xE9e contre le sch\xE9ma de chaque ticket.\n\nLa g\xE9n\xE9ration s'affiche en temps r\xE9el (streaming) avec le raisonnement du mod\xE8le, et la r\xE9ponse est pr\xE9sent\xE9e en JSON indent\xE9. Une revue compare ensuite chaque proposition au contenu existant avant int\xE9gration.\n\nLe panel est configurable (provider, mod\xE8le, langue) et enti\xE8rement localisable. Cette aide s'affiche dans la langue active.",
  infoPromptTitle: "Le prompt",
  infoPromptBody: "Le prompt est compos\xE9 de trois zones :\n\u2022 Prompt syst\xE8me : le r\xF4le et les r\xE8gles du mod\xE8le (toujours envoy\xE9).\n\u2022 Instructions suppl\xE9mentaires : votre demande pr\xE9cise (optionnel).\n\u2022 Contexte additionnel : informations compl\xE9mentaires (optionnel).\n\nLe bouton \xAB Voir le prompt \xBB affiche le message exact qui sera envoy\xE9, et \xAB Copier \xBB permet de le r\xE9utiliser.",
  infoFilesTitle: "Les fichiers source",
  infoFilesBody: "Fournissez des fichiers ou des URLs (serveur, CDN, drive) que le mod\xE8le lira lui-m\xEAme.\n\n\u2022 Un fichier est d\xE9fini par un label et un chemin absolu ou une URL.\n\u2022 Inclure / Exclure active ou d\xE9sactive un fichier dans le prompt.\n\u2022 Un fichier marqu\xE9 \xAB non pr\xE9sent \xBB est simplement ignor\xE9 lors de l'envoi.\n\u2022 Le champ en bas de section ajoute un chemin ou une URL \xE0 la vol\xE9e.\n\nLe panel ne convertit pas le contenu des fichiers : c'est le mod\xE8le qui les lit.",
  infoTicketsTitle: "Les tickets",
  infoTicketsBody: "Les tickets d\xE9crivent les t\xE2ches \xE0 accomplir. Chaque ticket top-level exige un sch\xE9ma de r\xE9ponse (JSON Schema) qui d\xE9crit le format attendu pour sa sortie.\n\n\u2022 Description : l'objectif du ticket.\n\u2022 Explication : la m\xE9thode \xE0 suivre.\n\u2022 Contenu existant : du contenu d\xE9j\xE0 pr\xE9sent \xE0 enrichir ou remplacer. Il est compar\xE9 \xE0 la proposition de l'IA dans la revue des modifications avant int\xE9gration.\n\u2022 Sous-tickets : d\xE9coupage de la t\xE2che en sous-\xE9tapes.\n\nUn ticket top-level sans sch\xE9ma est signal\xE9 par un avertissement rouge.",
  infoValidationTitle: "Validation de la r\xE9ponse",
  infoValidationBody: "Le mod\xE8le doit r\xE9pondre UNIQUEMENT en JSON : un tableau d'objets, un par ticket actif, chacun au format { \xAB cl\xE9-du-ticket \xBB : valeur }. Chaque valeur doit respecter le sch\xE9ma de r\xE9ponse du ticket.\n\n\xC0 la fin de la g\xE9n\xE9ration, la r\xE9ponse est valid\xE9e automatiquement :\n\u2022 badge vert \xAB Format de r\xE9ponse valide \xBB ;\n\u2022 badge rouge \xAB Format de r\xE9ponse invalide \xBB avec le d\xE9tail des erreurs par ticket.\n\nLa r\xE9ponse affich\xE9e est automatiquement reformat\xE9e en JSON indent\xE9 (2 espaces) pour faciliter la lecture.\n\nLe mode de validation est configurable dans \xAB Param\xE8tres \xBB :\n\u2022 Avertir : la g\xE9n\xE9ration reste possible, l'invalidit\xE9 est simplement signal\xE9e.\n\u2022 Bloquer l'int\xE9gration : le bouton d'int\xE9gration reste d\xE9sactiv\xE9 tant que la r\xE9ponse est invalide.\n\nDepuis le code, vous pouvez aussi fournir votre propre parseur (prop \xAB parser \xBB) pour contr\xF4ler enti\xE8rement la lecture de la r\xE9ponse : il prend le pas sur la validation automatique.",
  infoFeedbackTitle: "Boucle de correction",
  infoFeedbackBody: "Quand la validation \xE9choue, un bloc \xAB Erreur \xBB appara\xEEt avec la liste d\xE9taill\xE9e des erreurs et une case \xAB Inclure les erreurs dans le prompt \xBB.\n\nEn relan\xE7ant la g\xE9n\xE9ration, ces erreurs sont inject\xE9es dans le prompt pour dire au mod\xE8le ce qu'il doit \xE9viter et lui rappeler le format attendu. D\xE9cochez la case pour relancer sans ce retour.",
  infoStatusTitle: "Statut & score",
  infoStatusBody: "La barre de statut r\xE9sume l'\xE9tat du panel : prompt syst\xE8me, instructions, contexte, fichiers, tickets et erreurs de parsing.\n\n\u2022 Vert : \xE9l\xE9ment requis correctement fourni.\n\u2022 Orange : attention (aucun fichier pr\xE9sent).\n\u2022 Rouge : \xE9l\xE9ment requis manquant.\n\nLe score global devient vert d\xE8s que tous les \xE9l\xE9ments requis sont fournis.",
  infoConfigTitle: "Provider & mod\xE8le",
  infoConfigBody: "Le bouton \xAB Param\xE8tres \xBB ouvre la configuration du panel :\n\u2022 Langue de l'interface.\n\u2022 Provider (OpenCode, shadcn, HTTP g\xE9n\xE9rique) et son activation.\n\u2022 Mod\xE8le, cl\xE9 API et URL de base selon le provider.",
  infoActionsTitle: "Actions",
  infoActionsBody: "En bas du panel :\n\u2022 \xAB Voir le prompt \xBB : aper\xE7u complet du prompt qui sera envoy\xE9.\n\u2022 \xAB G\xE9n\xE9rer \xBB : lance la g\xE9n\xE9ration en streaming (devient \xAB Annuler \xBB en cours).\n\u2022 \xAB Int\xE9grer la s\xE9lection \xBB : ouvre la revue des modifications (tickets coch\xE9s par d\xE9faut), compare chaque proposition au contenu existant et n'int\xE8gre que les tickets s\xE9lectionn\xE9s.",
  infoReviewTitle: "Revue des modifications",
  infoReviewBody: "Avant d'int\xE9grer la r\xE9ponse, le panel affiche une revue par ticket :\n\u2022 Chaque ticket est coch\xE9 par d\xE9faut ; d\xE9cochez ceux \xE0 exclure.\n\u2022 Le statut indique Identique, Modifi\xE9, Nouveau ou Supprim\xE9.\n\u2022 Les changements sont list\xE9s (ajouts, suppressions, modifications) avec le chemin concern\xE9.\n\u2022 Le bouton \xAB Diffs \xBB ouvre un dialogue c\xF4te \xE0 c\xF4te : contenu existant vs proposition, lignes num\xE9rot\xE9es, ajouts en vert et suppressions en rouge.\n\u2022 Les cl\xE9s inconnues (sans ticket associ\xE9) sont affich\xE9es mais non coch\xE9es par d\xE9faut.\n\nLe bouton \xAB Int\xE9grer la s\xE9lection (n) \xBB n'applique que les tickets coch\xE9s.",
  infoIntegrationTitle: "Int\xE9gration dans le code",
  infoIntegrationBody: "Le panel est un module React importable dans n'importe quel projet :\n\u2022 <OneShotAiPanel> : composant complet avec les props systemPrompt, files, tickets, invalidMode, parser, labels, language, adapter, onSend et onPlug.\n\u2022 onPlug(response, selectedKeys?) : re\xE7oit la r\xE9ponse et les cl\xE9s coch\xE9es dans la revue (toutes si le param\xE8tre est absent) ; appelez-le sans l'UI pour int\xE9grer la r\xE9ponse compl\xE8te.\n\u2022 useAiPanel() : hook headless pour piloter la g\xE9n\xE9ration sans l'UI (envoi du prompt, parsing, validation, streaming).\n\u2022 Revue des modifications : avant l'int\xE9gration, le panel compare chaque ticket au contenu existant (statut Identique / Modifi\xE9 / Nouveau / Supprim\xE9) et propose un dialogue \xAB Diffs \xBB c\xF4te \xE0 c\xF4te.\n\u2022 parser : fournissez votre propre fonction de parsing, prioritaire sur la validation automatique par sch\xE9ma.\n\u2022 invalidMode : \xAB warn \xBB (avertit) ou \xAB block \xBB (d\xE9sactive l'int\xE9gration tant que la r\xE9ponse est invalide).\n\u2022 showInfoIntegration / showInfoCredits / showInfoButton / showSettingsButton : masquer les blocs d'aide ou les boutons \xAB Info \xBB et \xAB Param\xE8tres \xBB ; sans l'UI, la configuration (language, adapter, invalidMode) passe par les props.\n\u2022 Adapters : OpenCode, shadcn et HTTP g\xE9n\xE9rique sont fournis ; register() permet d'ajouter vos propres providers.\n\u2022 labels : toutes les cha\xEEnes UI sont surchargeables (fr / en / par d\xE9faut) pour une localisation compl\xE8te.",
  infoCreditsTitle: "Cr\xE9dits",
  infoCreditsBody: "OneShot AI Panel est un composant React open source, con\xE7u pour \xEAtre r\xE9utilis\xE9 dans vos projets. Consultez la landing page et le d\xE9p\xF4t GitHub pour la documentation compl\xE8te, les exemples et les versions.",
  infoCreditsLandingLabel: "Landing page",
  infoCreditsGithubLabel: "D\xE9p\xF4t GitHub",
  invalidModeLabel: "Mode de validation",
  invalidModeDescription: "Comportement quand la r\xE9ponse ne respecte pas les sch\xE9mas de tickets.",
  invalidModeWarn: "Avertir",
  invalidModeBlock: "Bloquer l'int\xE9gration",
  reviewTitle: "V\xE9rification des modifications",
  reviewDescription: "Compare la r\xE9ponse de l'IA avec le contenu existant avant de l'int\xE9grer.",
  diffIdentical: "Identique",
  diffModified: "Modifi\xE9",
  diffAdded: "Nouveau",
  diffRemoved: "Supprim\xE9",
  diffSelectAll: "Tout cocher",
  diffDeselectAll: "Tout d\xE9cocher",
  diffNoChanges: "Aucun changement",
  diffUnknownTicket: "Cl\xE9 inconnue",
  diffEmptyValue: "(vide)",
  diffInclude: "Inclure ce ticket",
  plugSelected: "Int\xE9grer la s\xE9lection",
  diffViewFull: "Diffs",
  diffExisting: "Existant",
  diffProposed: "Propos\xE9",
  diffClose: "Fermer"
};

// src/module/hooks/useAiPanel.ts
function useAiPanel(options) {
  const { sendHandler, labels, parser } = options;
  const [status, setStatus] = useState2(AiPanelStatus.Idle);
  const [response, setResponse] = useState2(null);
  const streaming = useStreaming();
  const sendInFlight = useRef2(false);
  const activeTicketsRef = useRef2(void 0);
  const handleComplete = useCallback2((raw) => {
    const activeTickets = activeTicketsRef.current;
    let parsed;
    let validation;
    if (parser) {
      const result = parser(raw);
      parsed = result.parsed;
      validation = result.validation;
    } else if (activeTickets && activeTickets.length > 0 && labels) {
      const result = validateTicketsResponse(raw, activeTickets, labels);
      parsed = result.parsed;
      validation = result.validation;
    } else {
      const extracted = extractJson(raw);
      parsed = extracted !== null ? extracted : void 0;
    }
    setStatus(AiPanelStatus.Done);
    setResponse({ raw, parsed, validation });
    sendInFlight.current = false;
  }, [parser, labels]);
  const handleStreamError = useCallback2((error) => {
    const message = error instanceof Error && error.message ? error.message : labels?.errorStreaming ?? defaultLabels.errorStreaming;
    setStatus(AiPanelStatus.Error);
    setResponse({ raw: "", error: message });
    sendInFlight.current = false;
  }, [labels]);
  const send = useCallback2(async (fullPrompt, activeTickets) => {
    if (!sendHandler || sendInFlight.current) return;
    sendInFlight.current = true;
    activeTicketsRef.current = activeTickets;
    setStatus(AiPanelStatus.Loading);
    setResponse(null);
    streaming.reset();
    try {
      const stream = await sendHandler(fullPrompt);
      if (!stream) {
        throw new Error(labels?.errorNoStream ?? defaultLabels.errorNoStream);
      }
      setStatus(AiPanelStatus.Streaming);
      streaming.start(stream, handleComplete, handleStreamError);
    } catch (err) {
      const msg = err instanceof Error ? err.message : labels?.errorUnknown ?? defaultLabels.errorUnknown;
      setStatus(AiPanelStatus.Error);
      setResponse({ raw: "", error: msg });
      sendInFlight.current = false;
    }
  }, [sendHandler, streaming, handleComplete, handleStreamError, labels]);
  const cancel = useCallback2(() => {
    streaming.cancel();
    setStatus(AiPanelStatus.Idle);
    sendInFlight.current = false;
  }, [streaming]);
  const reset = useCallback2(() => {
    streaming.reset();
    setStatus(AiPanelStatus.Idle);
    setResponse(null);
    sendInFlight.current = false;
  }, [streaming]);
  return {
    status,
    response: streaming.text && status === AiPanelStatus.Streaming ? { raw: streaming.text } : response,
    streamingText: streaming.text,
    streamingReasoning: streaming.reasoning,
    send,
    cancel,
    reset
  };
}

// src/primitives/loading-button.tsx
import { forwardRef } from "react";

// src/primitives/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";

// src/primitives/lib/utils.ts
import { clsx as clsx2 } from "clsx";
import { twMerge as twMerge2 } from "tailwind-merge";
function cn2(...inputs) {
  return twMerge2(clsx2(inputs));
}

// src/primitives/button.tsx
import { jsx } from "react/jsx-runtime";
var buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ButtonPrimitive,
    {
      "data-slot": "button",
      className: cn2(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/primitives/loading-button.tsx
import { Loader2 } from "lucide-react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var LoadingButton = forwardRef(
  ({ label, loading, hideLabelOnLoading, disableOnLoading = true, children, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(Button, { ref, disabled: disableOnLoading && loading || props.disabled, ...props, children: [
      loading ? /* @__PURE__ */ jsx2(Loader2, { className: hideLabelOnLoading ? "size-4 animate-spin" : "size-4 animate-spin mr-1.5" }) : children,
      (!loading || !hideLabelOnLoading) && /* @__PURE__ */ jsx2("span", { children: label })
    ] });
  }
);
LoadingButton.displayName = "LoadingButton";

// src/primitives/sheet.tsx
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx3(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({ ...props }) {
  return /* @__PURE__ */ jsx3(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ jsx3(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({ className, ...props }) {
  return /* @__PURE__ */ jsx3(
    SheetPrimitive.Backdrop,
    {
      "data-slot": "sheet-overlay",
      className: cn2(
        "fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs2(SheetPortal, { children: [
    /* @__PURE__ */ jsx3(SheetOverlay, {}),
    /* @__PURE__ */ jsxs2(
      SheetPrimitive.Popup,
      {
        "data-slot": "sheet-content",
        "data-side": side,
        className: cn2(
          "fixed z-50 flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:data-ending-style:translate-x-[-2.5rem] rtl:data-[side=left]:data-ending-style:-translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] rtl:data-[side=left]:data-starting-style:-translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-[2.5rem] rtl:data-[side=right]:data-ending-style:-translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] rtl:data-[side=right]:data-starting-style:-translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs2(
            SheetPrimitive.Close,
            {
              "data-slot": "sheet-close",
              render: /* @__PURE__ */ jsx3(
                Button,
                {
                  variant: "ghost",
                  className: "absolute top-4 end-4",
                  size: "icon-sm"
                }
              ),
              children: [
                /* @__PURE__ */ jsx3(
                  XIcon,
                  {}
                ),
                /* @__PURE__ */ jsx3("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx3(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn2("flex flex-col gap-1.5 p-6", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx3(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn2(
        "font-heading text-sm font-medium text-foreground",
        className
      ),
      ...props
    }
  );
}

// src/module/components/status-bar.tsx
import { useState as useState3 } from "react";
import { Check, X, Minus, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function scoreSegment(label, ok, required, warning = false) {
  return /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-1.5", children: [
    ok ? /* @__PURE__ */ jsx4(Check, { className: "size-3 text-green-500 shrink-0" }) : warning ? /* @__PURE__ */ jsx4(AlertTriangle, { className: "size-3 text-orange-500 shrink-0" }) : required ? /* @__PURE__ */ jsx4(X, { className: "size-3 text-red-500 shrink-0" }) : /* @__PURE__ */ jsx4(Minus, { className: "size-3 text-muted-foreground shrink-0" }),
    /* @__PURE__ */ jsx4("span", { className: ok ? "text-foreground" : warning ? "text-orange-500" : required ? "text-red-500" : "text-muted-foreground", children: label })
  ] });
}
function StatusBar({ labels, promptPresent, userPromptPresent, additionalContextPresent, files, tickets, hasFeedback }) {
  const [showStatus, setShowStatus] = useState3(false);
  const enabledFiles = (files ?? []).filter((f) => f.enabled !== false);
  const hasPresentFiles = enabledFiles.some((f) => f.present);
  const filesOk = enabledFiles.length === 0 || hasPresentFiles;
  const filesWarning = enabledFiles.length > 0 && !hasPresentFiles;
  const enabledTickets = (tickets ?? []).filter((t) => t.enabled !== false);
  const hasActiveTickets = enabledTickets.some((t) => !t.done);
  const ticketsOk = enabledTickets.length === 0 || hasActiveTickets;
  const scoreOk = [
    promptPresent,
    userPromptPresent,
    additionalContextPresent,
    filesOk,
    ticketsOk,
    !hasFeedback
  ];
  const scoreCount = scoreOk.filter(Boolean).length;
  const scoreTotal = scoreOk.length;
  const requiredOk = promptPresent && filesOk && ticketsOk;
  const globalColor = requiredOk ? "text-green-500" : "text-red-500";
  return /* @__PURE__ */ jsxs3("div", { className: "border-b", children: [
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between px-4 py-2", children: [
      /* @__PURE__ */ jsx4("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: labels.status }),
      /* @__PURE__ */ jsxs3(
        Button,
        {
          variant: "secondary",
          size: "sm",
          onClick: () => setShowStatus(!showStatus),
          className: "h-6 gap-1 px-2",
          children: [
            showStatus ? /* @__PURE__ */ jsx4(ChevronDown, { className: "size-3" }) : /* @__PURE__ */ jsx4(ChevronRight, { className: "size-3" }),
            /* @__PURE__ */ jsx4("span", { className: "text-xs", children: showStatus ? labels.hide : labels.show })
          ]
        }
      )
    ] }),
    showStatus && /* @__PURE__ */ jsxs3("div", { className: "px-4 pb-2 space-y-1 text-xs", children: [
      scoreSegment(labels.statusSystemPrompt, promptPresent, true),
      scoreSegment(labels.statusUserPrompt, userPromptPresent, false),
      scoreSegment(labels.statusAdditionalContext, additionalContextPresent, false),
      scoreSegment(labels.statusFiles, filesOk, enabledFiles.length > 0, filesWarning),
      scoreSegment(labels.statusTickets, ticketsOk, enabledTickets.length > 0),
      scoreSegment(labels.statusFeedback, !hasFeedback, false, hasFeedback),
      /* @__PURE__ */ jsxs3("div", { className: cn("pt-1 font-semibold", globalColor), children: [
        labels.score,
        " : ",
        scoreCount,
        "/",
        scoreTotal
      ] })
    ] })
  ] });
}

// src/module/components/prompt-section.tsx
import { useState as useState4 } from "react";
import { Sparkles, FileText, ChevronDown as ChevronDown2, ChevronRight as ChevronRight2 } from "lucide-react";

// src/primitives/textarea.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx5(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn2(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-input bg-input/20 px-2 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}

// src/module/components/prompt-section.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function PromptSection({
  labels,
  systemPrompt,
  onSystemPromptChange,
  userPrompt,
  onUserPromptChange,
  additionalContext,
  onAdditionalContextChange
}) {
  const [collapsed, setCollapsed] = useState4({
    system: true,
    user: true,
    context: true
  });
  const toggle = (key) => setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  const renderHeader = (key, icon, label, extraClass) => /* @__PURE__ */ jsxs4("div", { className: cn("flex items-center gap-1.5 mb-2", extraClass), children: [
    icon,
    /* @__PURE__ */ jsx6("span", { className: "font-semibold text-foreground flex-1", children: label }),
    /* @__PURE__ */ jsx6(
      "button",
      {
        type: "button",
        onClick: () => toggle(key),
        className: "text-muted-foreground hover:text-foreground transition-colors",
        "aria-label": collapsed[key] ? labels.show : labels.hide,
        children: collapsed[key] ? /* @__PURE__ */ jsx6(ChevronRight2, { className: "size-3.5" }) : /* @__PURE__ */ jsx6(ChevronDown2, { className: "size-3.5" })
      }
    )
  ] });
  return /* @__PURE__ */ jsxs4("section", { children: [
    renderHeader("system", /* @__PURE__ */ jsx6(Sparkles, { className: "size-3" }), labels.systemPrompt),
    !collapsed.system && /* @__PURE__ */ jsx6(
      Textarea,
      {
        placeholder: labels.systemPromptPlaceholder,
        value: systemPrompt,
        onChange: (e) => onSystemPromptChange(e.target.value),
        className: "min-h-[80px] text-xs text-foreground"
      }
    ),
    renderHeader("user", /* @__PURE__ */ jsx6(Sparkles, { className: "size-3" }), labels.userPrompt, "mt-4"),
    !collapsed.user && /* @__PURE__ */ jsx6(
      Textarea,
      {
        placeholder: labels.userPromptPlaceholder,
        value: userPrompt,
        onChange: (e) => onUserPromptChange(e.target.value),
        className: "min-h-[60px] text-xs text-foreground"
      }
    ),
    renderHeader("context", /* @__PURE__ */ jsx6(FileText, { className: "size-3" }), labels.additionalContext, "mt-4"),
    !collapsed.context && /* @__PURE__ */ jsx6(
      Textarea,
      {
        placeholder: labels.additionalContextPlaceholder,
        value: additionalContext,
        onChange: (e) => onAdditionalContextChange(e.target.value),
        className: "min-h-[60px] text-xs text-foreground"
      }
    )
  ] });
}

// src/module/components/files-section.tsx
import { useState as useState5 } from "react";
import { Check as Check2, X as X2, Plus, FileText as FileText2 } from "lucide-react";

// src/primitives/input.tsx
import { Input as InputPrimitive } from "@base-ui/react/input";
import { jsx as jsx7 } from "react/jsx-runtime";
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx7(
    InputPrimitive,
    {
      type,
      "data-slot": "input",
      className: cn2(
        "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}

// src/primitives/empty.tsx
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
function Empty({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "empty",
      className: cn2(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance",
        className
      ),
      ...props
    }
  );
}
function EmptyHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "empty-header",
      className: cn2("flex max-w-sm flex-col items-center gap-1", className),
      ...props
    }
  );
}
var emptyMediaVariants = cva2(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function EmptyMedia({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "empty-icon",
      "data-variant": variant,
      className: cn2(emptyMediaVariants({ variant, className })),
      ...props
    }
  );
}
function EmptyDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "empty-description",
      className: cn2(
        "text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      ),
      ...props
    }
  );
}
function EmptyContent({ className, ...props }) {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      "data-slot": "empty-content",
      className: cn2(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-2 text-xs/relaxed text-balance",
        className
      ),
      ...props
    }
  );
}

// src/module/components/empty-state.tsx
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
function EmptyState({ icon, title, description, action, className, children }) {
  return /* @__PURE__ */ jsx9(Empty, { className, children: /* @__PURE__ */ jsxs5(EmptyContent, { children: [
    icon && /* @__PURE__ */ jsx9(EmptyMedia, { children: icon }),
    /* @__PURE__ */ jsxs5(EmptyHeader, { children: [
      title && /* @__PURE__ */ jsx9("div", { className: "font-heading text-sm font-medium", children: title }),
      description && /* @__PURE__ */ jsx9(EmptyDescription, { children: description })
    ] }),
    children ?? (action && /* @__PURE__ */ jsx9(Button, { variant: "outline", size: "sm", onClick: action.onClick, children: action.label }))
  ] }) });
}

// src/module/components/files-section.tsx
import { jsx as jsx10, jsxs as jsxs6 } from "react/jsx-runtime";
function FilesSection({
  labels,
  files,
  resolvedFiles,
  customFileKeys,
  onToggleFile,
  onAddCustomFile,
  onRemoveCustomFile
}) {
  const [inputValue, setInputValue] = useState5("");
  function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAddCustomFile(trimmed);
    setInputValue("");
  }
  return /* @__PURE__ */ jsxs6("section", { children: [
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1.5 mb-1", children: [
      /* @__PURE__ */ jsx10(FileText2, { className: "size-3" }),
      /* @__PURE__ */ jsx10("span", { className: "font-semibold text-foreground", children: labels.files })
    ] }),
    /* @__PURE__ */ jsx10("p", { className: "text-xs text-muted-foreground mb-2", children: labels.filesDescription }),
    files.length > 0 ? /* @__PURE__ */ jsx10("div", { className: "space-y-1.5 mb-2", children: resolvedFiles.map((f) => /* @__PURE__ */ jsxs6("div", { className: cn("flex items-start gap-2", !f.enabled && "opacity-50"), children: [
      f.present ? /* @__PURE__ */ jsx10(Check2, { className: "size-3 text-green-500 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx10(X2, { className: "size-3 text-red-500 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs6("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx10("div", { className: cn("text-xs", f.present && f.enabled ? "text-foreground" : ""), children: f.label }),
        /* @__PURE__ */ jsx10("div", { className: "text-xs text-muted-foreground truncate", children: f.path })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-1 shrink-0 mt-0.5", children: [
        customFileKeys.has(f.key) && /* @__PURE__ */ jsx10(
          "button",
          {
            onClick: () => onRemoveCustomFile(f.key),
            className: "flex items-center gap-0.5 rounded-md px-1 py-0.5 transition-colors text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer",
            title: labels.removeFile,
            children: /* @__PURE__ */ jsx10(X2, { className: "size-3" })
          }
        ),
        /* @__PURE__ */ jsxs6(
          "button",
          {
            onClick: () => onToggleFile(f.key),
            className: cn(
              "flex items-center gap-0.5 rounded-md px-1 py-0.5 transition-colors text-xs",
              f.enabled ? "bg-green-500/20 hover:bg-green-500/30 text-green-600" : "bg-red-500/20 hover:bg-red-500/30 text-red-600"
            ),
            title: f.enabled ? labels.include : labels.exclude,
            children: [
              f.enabled ? /* @__PURE__ */ jsx10(Check2, { className: "size-3" }) : /* @__PURE__ */ jsx10(X2, { className: "size-3" }),
              /* @__PURE__ */ jsx10("span", { children: f.enabled ? labels.include : labels.exclude })
            ]
          }
        )
      ] })
    ] }, f.key)) }) : /* @__PURE__ */ jsx10(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx10(FileText2, { className: "size-5" }),
        title: labels.noFiles,
        description: labels.noFilesDesc,
        className: "border mb-2"
      }
    ),
    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx10(
        Input,
        {
          className: "text-xs text-foreground flex-1 h-6",
          placeholder: labels.addFilePlaceholder,
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") handleAdd();
          }
        }
      ),
      /* @__PURE__ */ jsxs6(Button, { variant: "secondary", size: "sm", onClick: handleAdd, className: "gap-1 shrink-0 cursor-pointer", children: [
        /* @__PURE__ */ jsx10(Plus, { className: "size-3" }),
        /* @__PURE__ */ jsx10("span", { className: "text-xs", children: labels.addFileButton })
      ] })
    ] })
  ] });
}

// src/module/components/tickets-section.tsx
import { Circle as Circle2 } from "lucide-react";

// src/module/components/ticket-item.tsx
import { useState as useState6, useId } from "react";
import { Check as Check3, X as X3, ChevronDown as ChevronDown3, ChevronRight as ChevronRight3, Circle, TriangleAlert } from "lucide-react";
import { jsx as jsx11, jsxs as jsxs7 } from "react/jsx-runtime";
function TicketItem({ ticket, depth = 0, enabled, labels, onToggleEnabled }) {
  const [expanded, setExpanded] = useState6(false);
  const [showExisting, setShowExisting] = useState6(false);
  const contentId = useId();
  const hasExpandable = ticket.explication || ticket.responseSchema !== void 0 || ticket.subTickets && ticket.subTickets.length > 0;
  const hasExistingContent = ticket.existingContent !== void 0;
  return /* @__PURE__ */ jsxs7("div", { className: cn("border rounded-md p-3", depth > 0 && "ml-4", enabled === false && "opacity-50"), children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx11("span", { className: "mt-0.5 shrink-0", children: ticket.done ? /* @__PURE__ */ jsx11(Check3, { className: "size-3.5 text-green-500" }) : /* @__PURE__ */ jsx11(Circle, { className: "size-3.5 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxs7("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx11(
          "span",
          {
            className: cn(
              "font-medium text-xs",
              ticket.done ? "text-foreground line-through opacity-60" : "text-foreground"
            ),
            children: ticket.label
          }
        ),
        ticket.description && /* @__PURE__ */ jsx11("p", { className: "text-xs text-muted-foreground mt-0.5", children: ticket.description }),
        depth === 0 && ticket.responseSchema === void 0 && /* @__PURE__ */ jsxs7("p", { className: "text-xs text-red-500 mt-0.5 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx11(TriangleAlert, { className: "size-3 shrink-0" }),
          /* @__PURE__ */ jsx11("span", { children: labels.ticketMissingSchema })
        ] })
      ] }),
      onToggleEnabled && /* @__PURE__ */ jsxs7(
        "button",
        {
          onClick: onToggleEnabled,
          className: cn(
            "flex items-center gap-0.5 rounded-md px-1 py-0.5 transition-colors shrink-0 text-xs",
            enabled ? "bg-green-500/20 hover:bg-green-500/30 text-green-600" : "bg-red-500/20 hover:bg-red-500/30 text-red-600"
          ),
          title: enabled ? labels.exclude : labels.include,
          children: [
            enabled ? /* @__PURE__ */ jsx11(Check3, { className: "size-3" }) : /* @__PURE__ */ jsx11(X3, { className: "size-3" }),
            /* @__PURE__ */ jsx11("span", { children: enabled ? labels.include : labels.exclude })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "mt-2 ml-6", children: [
      /* @__PURE__ */ jsxs7(
        "button",
        {
          onClick: () => setShowExisting(!showExisting),
          className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
          children: [
            showExisting ? /* @__PURE__ */ jsx11(ChevronDown3, { className: "size-3" }) : /* @__PURE__ */ jsx11(ChevronRight3, { className: "size-3" }),
            /* @__PURE__ */ jsx11("span", { children: showExisting ? labels.hideCurrentContent : labels.showCurrentContent })
          ]
        }
      ),
      showExisting && (hasExistingContent ? /* @__PURE__ */ jsx11("pre", { className: "mt-1 text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto border", children: JSON.stringify(ticket.existingContent, null, 2) }) : /* @__PURE__ */ jsx11(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsx11(Circle, { className: "size-4" }),
          title: labels.noExistingContent,
          description: labels.noExistingContentDesc,
          className: "border py-2"
        }
      ))
    ] }),
    hasExpandable && /* @__PURE__ */ jsxs7("div", { className: "mt-2 ml-6", children: [
      /* @__PURE__ */ jsxs7(
        Button,
        {
          variant: "secondary",
          size: "sm",
          onClick: () => setExpanded(!expanded),
          className: "h-6 gap-1 px-2",
          "aria-expanded": expanded,
          "aria-controls": contentId,
          children: [
            expanded ? /* @__PURE__ */ jsx11(ChevronDown3, { className: "size-3" }) : /* @__PURE__ */ jsx11(ChevronRight3, { className: "size-3" }),
            /* @__PURE__ */ jsx11("span", { className: "text-xs", children: expanded ? labels.hide : labels.details })
          ]
        }
      ),
      expanded && /* @__PURE__ */ jsxs7("div", { id: contentId, className: "mt-2 space-y-2", children: [
        ticket.explication && /* @__PURE__ */ jsx11("p", { className: "text-xs text-muted-foreground leading-relaxed", children: ticket.explication }),
        ticket.responseSchema !== void 0 && /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx11("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: labels.responseSchema }),
          /* @__PURE__ */ jsx11("pre", { className: "mt-1 text-xs font-mono bg-muted p-2 rounded-md overflow-x-auto", children: JSON.stringify(ticket.responseSchema, null, 2) })
        ] }),
        ticket.subTickets?.map((st) => /* @__PURE__ */ jsx11(TicketItem, { ticket: st, depth: depth + 1, labels }, st.key))
      ] })
    ] })
  ] });
}

// src/module/components/tickets-section.tsx
import { jsx as jsx12, jsxs as jsxs8 } from "react/jsx-runtime";
function TicketsSection({ labels, tickets, resolvedTickets, onToggleTicket }) {
  return /* @__PURE__ */ jsxs8("section", { children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-1.5 mb-1", children: [
      /* @__PURE__ */ jsx12(Circle2, { className: "size-3" }),
      /* @__PURE__ */ jsx12("span", { className: "font-semibold text-foreground", children: labels.tickets })
    ] }),
    /* @__PURE__ */ jsx12("p", { className: "text-xs text-muted-foreground mb-2", children: labels.ticketsDescription }),
    tickets.length > 0 ? /* @__PURE__ */ jsx12("div", { className: "space-y-2", children: resolvedTickets.map((t) => /* @__PURE__ */ jsx12(
      TicketItem,
      {
        ticket: t,
        enabled: t.enabled,
        labels,
        onToggleEnabled: () => onToggleTicket(t.key)
      },
      t.key
    )) }) : /* @__PURE__ */ jsx12(
      EmptyState,
      {
        icon: /* @__PURE__ */ jsx12(Circle2, { className: "size-5" }),
        title: labels.noTickets,
        description: labels.noTicketsDesc,
        className: "border"
      }
    )
  ] });
}

// src/module/components/response-section.tsx
import { useState as useState8, useRef as useRef3, useEffect, useCallback as useCallback3, useMemo as useMemo2 } from "react";
import { Bot, Loader2 as Loader22, AlertTriangle as AlertTriangle3, Sparkles as Sparkles2, CircleCheck, CircleX, Brain, ChevronDown as ChevronDown4, ChevronRight as ChevronRight4 } from "lucide-react";

// src/module/components/diff-section.tsx
import { useState as useState7 } from "react";
import { Plus as Plus2, Minus as Minus2, ArrowRight, AlertTriangle as AlertTriangle2, Expand } from "lucide-react";

// src/primitives/checkbox.tsx
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { jsx as jsx13 } from "react/jsx-runtime";
function Checkbox({ className, ...props }) {
  return /* @__PURE__ */ jsx13(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn2(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx13(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
          children: /* @__PURE__ */ jsx13(
            CheckIcon,
            {}
          )
        }
      )
    }
  );
}

// src/primitives/badge.tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva as cva3 } from "class-variance-authority";
var badgeVariants = cva3(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  render,
  ...props
}) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps(
      {
        className: cn2(badgeVariants({ variant }), className)
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant
    }
  });
}

// src/module/components/diff-dialog.tsx
import { useMemo } from "react";
import { Dialog as DialogPrimitive2 } from "@base-ui/react/dialog";

// src/primitives/dialog.tsx
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon as XIcon2 } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
function Dialog({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({ ...props }) {
  return /* @__PURE__ */ jsx14(DialogPrimitive.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx14(
    DialogPrimitive.Backdrop,
    {
      "data-slot": "dialog-overlay",
      className: cn2(
        "fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      ),
      ...props
    }
  );
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn2("flex flex-col gap-1", className),
      ...props
    }
  );
}
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn2(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsx14(DialogPrimitive.Close, { render: /* @__PURE__ */ jsx14(Button, { variant: "outline" }), children: "Close" })
      ]
    }
  );
}
function DialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx14(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn2("font-heading text-sm font-medium", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx14(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn2(
        "text-xs/relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      ),
      ...props
    }
  );
}

// src/module/components/diff-dialog.tsx
import { XIcon as XIcon3 } from "lucide-react";

// src/module/lib/diff.ts
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  const aa = a;
  const bb = b;
  const keysA = Object.keys(aa);
  const keysB = Object.keys(bb);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => deepEqual(aa[k], bb[k]));
}
function identityKey(value) {
  if (!isPlainObject(value)) return null;
  if (typeof value.slug === "string" && value.slug !== "") return "slug";
  if (typeof value.name === "string" && value.name !== "") return "name";
  return null;
}
function alignArrays(oldArr, newArr) {
  const keyOf = (v) => {
    const k = identityKey(v);
    if (!k) return void 0;
    return String(v[k]);
  };
  const oldItems = oldArr.map((v, i) => ({ v, i, key: keyOf(v) }));
  const newItems = newArr.map((v, i) => ({ v, i, key: keyOf(v) }));
  const used = /* @__PURE__ */ new Set();
  const pairs = [];
  for (const ni of newItems) {
    if (ni.key !== void 0) {
      const match = oldItems.find((o) => o.key === ni.key && !used.has(o.i));
      if (match) {
        used.add(match.i);
        pairs.push({ old: match.v, new: ni.v, path: `[${ni.key}]` });
        continue;
      }
    }
    pairs.push({ old: void 0, new: ni.v, path: `[${ni.i}]` });
  }
  for (const oi of oldItems) {
    if (used.has(oi.i)) continue;
    pairs.push({ old: oi.v, new: void 0, path: `[${oi.key ?? oi.i}]` });
  }
  return pairs;
}
function diffJson(oldValue, newValue, path = "$") {
  if (deepEqual(oldValue, newValue)) return [];
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const changes = [];
    for (const pair of alignArrays(oldValue, newValue)) {
      if (pair.old === void 0) {
        changes.push({ path: `${path}${pair.path}`, kind: "added", new: pair.new });
      } else if (pair.new === void 0) {
        changes.push({ path: `${path}${pair.path}`, kind: "removed", old: pair.old });
      } else {
        changes.push(...diffJson(pair.old, pair.new, `${path}${pair.path}`));
      }
    }
    return changes;
  }
  if (isPlainObject(oldValue) && isPlainObject(newValue)) {
    const changes = [];
    const keys = /* @__PURE__ */ new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
    for (const key of keys) {
      const p = `${path}.${key}`;
      if (!(key in newValue)) {
        changes.push({ path: p, kind: "removed", old: oldValue[key] });
      } else if (!(key in oldValue)) {
        changes.push({ path: p, kind: "added", new: newValue[key] });
      } else if (!deepEqual(oldValue[key], newValue[key])) {
        changes.push(...diffJson(oldValue[key], newValue[key], p));
      }
    }
    return changes;
  }
  return [{ path, kind: "changed", old: oldValue, new: newValue }];
}
function diffStatus(changes) {
  if (changes.length === 0) return "identical";
  if (changes.every((c) => c.kind === "added")) return "added";
  if (changes.every((c) => c.kind === "removed")) return "removed";
  return "modified";
}
function isEmptyValue(value) {
  if (value === void 0 || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (isPlainObject(value) && Object.keys(value).length === 0) return true;
  return false;
}
function formatValue(value, max = 120) {
  if (value === void 0 || value === null) return "null";
  if (typeof value === "string") return value === "" ? `""` : JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const json = JSON.stringify(value);
  return json.length > max ? `${json.slice(0, max)}\u2026` : json;
}
function serializeValue(value) {
  if (isEmptyValue(value)) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}
var LCS_LIMIT = 1500;
function computeOps(oldLines, newLines) {
  const n = oldLines.length;
  const m = newLines.length;
  if (n > LCS_LIMIT || m > LCS_LIMIT) {
    const ops2 = [];
    const len = Math.max(n, m);
    for (let i2 = 0; i2 < len; i2++) {
      const o = i2 < n ? oldLines[i2] : void 0;
      const no = i2 < m ? newLines[i2] : void 0;
      if (o === no) ops2.push({ kind: "same", text: o });
      else if (o !== void 0 && no !== void 0) {
        ops2.push({ kind: "removed", text: o });
        ops2.push({ kind: "added", text: no });
      } else if (o !== void 0) ops2.push({ kind: "removed", text: o });
      else if (no !== void 0) ops2.push({ kind: "added", text: no });
    }
    return ops2;
  }
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i2 = n - 1; i2 >= 0; i2--) {
    for (let j2 = m - 1; j2 >= 0; j2--) {
      dp[i2][j2] = oldLines[i2] === newLines[j2] ? dp[i2 + 1][j2 + 1] + 1 : Math.max(dp[i2 + 1][j2], dp[i2][j2 + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (oldLines[i] === newLines[j]) {
      ops.push({ kind: "same", text: oldLines[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ kind: "removed", text: oldLines[i] });
      i++;
    } else {
      ops.push({ kind: "added", text: newLines[j] });
      j++;
    }
  }
  while (i < n) {
    ops.push({ kind: "removed", text: oldLines[i] });
    i++;
  }
  while (j < m) {
    ops.push({ kind: "added", text: newLines[j] });
    j++;
  }
  return ops;
}
function buildRows(ops) {
  const rows = [];
  let i = 0;
  while (i < ops.length) {
    const op = ops[i];
    if (op.kind === "same") {
      rows.push({
        left: { text: op.text, status: "same" },
        right: { text: op.text, status: "same" }
      });
      i++;
      continue;
    }
    if (op.kind === "added") {
      rows.push({ right: { text: op.text, status: "added" } });
      i++;
      continue;
    }
    const removedRun = [];
    while (i < ops.length && ops[i].kind === "removed") {
      removedRun.push(ops[i].text);
      i++;
    }
    const addedRun = [];
    while (i < ops.length && ops[i].kind === "added") {
      addedRun.push(ops[i].text);
      i++;
    }
    const paired = Math.min(removedRun.length, addedRun.length);
    for (let k = 0; k < paired; k++) {
      rows.push({
        left: { text: removedRun[k], status: "removed" },
        right: { text: addedRun[k], status: "added" }
      });
    }
    for (let k = paired; k < removedRun.length; k++) {
      rows.push({ left: { text: removedRun[k], status: "removed" } });
    }
    for (let k = paired; k < addedRun.length; k++) {
      rows.push({ right: { text: addedRun[k], status: "added" } });
    }
  }
  return rows;
}
function diffLines(oldValue, newValue) {
  const oldText = serializeValue(oldValue);
  const newText = serializeValue(newValue);
  if (oldText === newText) {
    return oldText.split("\n").map((line, index) => ({
      left: { text: line, status: "same" },
      right: { text: line, status: "same" },
      leftNo: index + 1,
      rightNo: index + 1
    }));
  }
  const oldLines = oldText === "" ? [] : oldText.split("\n");
  const newLines = newText === "" ? [] : newText.split("\n");
  const rows = buildRows(computeOps(oldLines, newLines));
  let leftNo = 0;
  let rightNo = 0;
  for (const row of rows) {
    if (row.left) {
      leftNo += 1;
      row.leftNo = leftNo;
    }
    if (row.right) {
      rightNo += 1;
      row.rightNo = rightNo;
    }
  }
  return rows;
}

// src/module/components/diff-dialog.tsx
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
function Cell({ text, number, marker, tone }) {
  return /* @__PURE__ */ jsxs10("div", { className: cn("flex min-w-0", tone === "added" && "bg-green-500/10", tone === "removed" && "bg-red-500/10"), children: [
    /* @__PURE__ */ jsx15("span", { className: "w-10 shrink-0 select-none border-r border-muted/60 pr-2 text-right text-muted-foreground/60", children: number ?? "" }),
    /* @__PURE__ */ jsx15("span", { className: cn(
      "w-4 shrink-0 select-none text-center",
      tone === "added" && "text-green-600 dark:text-green-400",
      tone === "removed" && "text-red-500"
    ), children: marker }),
    /* @__PURE__ */ jsx15("span", { className: cn(
      "min-w-0 whitespace-pre-wrap break-all px-2",
      tone === "added" && "text-green-700 dark:text-green-400",
      tone === "removed" && "text-red-500"
    ), children: text })
  ] });
}
function DiffRow({ row }) {
  return /* @__PURE__ */ jsxs10("tr", { children: [
    /* @__PURE__ */ jsx15("td", { className: "border-b border-r border-muted/40 align-top", children: /* @__PURE__ */ jsx15(
      Cell,
      {
        text: row.left?.text,
        number: row.leftNo,
        marker: row.left?.status === "removed" ? "\u2212" : "",
        tone: row.left?.status === "removed" ? "removed" : void 0
      }
    ) }),
    /* @__PURE__ */ jsx15("td", { className: "border-b border-muted/40 align-top", children: /* @__PURE__ */ jsx15(
      Cell,
      {
        text: row.right?.text,
        number: row.rightNo,
        marker: row.right?.status === "added" ? "+" : "",
        tone: row.right?.status === "added" ? "added" : void 0
      }
    ) })
  ] });
}
function DiffDialog({
  labels,
  title,
  subtitle,
  statusLabel: statusLabel2,
  statusClass,
  oldValue,
  newValue,
  open,
  onOpenChange
}) {
  const rows = useMemo(() => diffLines(oldValue, newValue), [oldValue, newValue]);
  return /* @__PURE__ */ jsx15(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs10(DialogPortal, { children: [
    /* @__PURE__ */ jsx15(DialogOverlay, { forceRender: true }),
    /* @__PURE__ */ jsxs10(
      DialogPrimitive2.Popup,
      {
        "data-slot": "dialog-content",
        className: cn(
          "fixed top-1/2 start-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          "flex h-[85vh] w-full flex-col gap-3 sm:max-w-5xl"
        ),
        children: [
          /* @__PURE__ */ jsxs10(
            DialogPrimitive2.Close,
            {
              "data-slot": "dialog-close",
              render: /* @__PURE__ */ jsx15(
                Button,
                {
                  variant: "ghost",
                  className: "absolute top-2 end-2",
                  size: "icon-sm"
                }
              ),
              children: [
                /* @__PURE__ */ jsx15(XIcon3, {}),
                /* @__PURE__ */ jsx15("span", { className: "sr-only", children: labels.diffClose })
              ]
            }
          ),
          /* @__PURE__ */ jsxs10(DialogHeader, { children: [
            /* @__PURE__ */ jsxs10(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx15("span", { className: "min-w-0 truncate", children: title }),
              statusLabel2 && statusClass && /* @__PURE__ */ jsx15("span", { className: cn("shrink-0 rounded-md border px-2 py-0.5", statusClass), children: statusLabel2 })
            ] }),
            subtitle && /* @__PURE__ */ jsx15(DialogDescription, { className: "truncate font-mono", children: subtitle })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "grid shrink-0 grid-cols-2 overflow-hidden rounded-md border", children: [
            /* @__PURE__ */ jsx15("div", { className: "border-r border-muted/60 bg-muted/40 px-2 py-1 text-xs font-medium text-foreground", children: labels.diffExisting }),
            /* @__PURE__ */ jsx15("div", { className: "bg-muted/40 px-2 py-1 text-xs font-medium text-foreground", children: labels.diffProposed })
          ] }),
          /* @__PURE__ */ jsx15("div", { className: "min-h-0 flex-1 overflow-auto rounded-md border", children: /* @__PURE__ */ jsx15("table", { className: "w-full border-collapse font-mono text-xs leading-relaxed", children: /* @__PURE__ */ jsx15("tbody", { children: rows.length === 0 ? /* @__PURE__ */ jsx15("tr", { children: /* @__PURE__ */ jsx15("td", { className: "px-3 py-2 text-muted-foreground", colSpan: 2, children: labels.diffNoChanges }) }) : rows.map((row, i) => /* @__PURE__ */ jsx15(DiffRow, { row }, i)) }) }) }),
          /* @__PURE__ */ jsx15(DialogFooter, { className: "shrink-0", children: /* @__PURE__ */ jsx15(DialogClose, { render: /* @__PURE__ */ jsx15(Button, { variant: "outline", size: "sm" }), children: labels.diffClose }) })
        ]
      }
    )
  ] }) });
}

// src/module/components/diff-section.tsx
import { jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
function normalizeEntries(response) {
  const parsed = response.parsed;
  if (Array.isArray(parsed)) {
    return parsed.flatMap((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const keys = Object.keys(item);
        if (keys.length === 1) return [{ key: keys[0], value: item[keys[0]] }];
        return keys.map((key) => ({ key, value: item[key] }));
      }
      return [];
    });
  }
  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed).map(([key, value]) => ({ key, value }));
  }
  return [];
}
function statusStyles(status) {
  switch (status) {
    case "added":
      return "border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400";
    case "removed":
      return "border-red-500/30 bg-red-500/5 text-red-500";
    case "modified":
      return "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400";
    default:
      return "border-border bg-muted/40 text-muted-foreground";
  }
}
function statusLabel(status, labels) {
  switch (status) {
    case "added":
      return labels.diffAdded;
    case "removed":
      return labels.diffRemoved;
    case "modified":
      return labels.diffModified;
    default:
      return labels.diffIdentical;
  }
}
function renderValue(value, labels) {
  if (isEmptyValue(value)) return labels.diffEmptyValue;
  return formatValue(value);
}
function DiffSection({
  labels,
  response,
  tickets,
  selectedKeys,
  onToggle,
  onSelectAll,
  onDeselectAll
}) {
  const ticketErrors = response.validation?.ticketErrors ?? [];
  const [openKey, setOpenKey] = useState7(null);
  const entries = normalizeEntries(response).map(({ key, value }) => {
    const ticket = tickets.find((t) => t.key === key);
    const changes = diffJson(ticket?.existingContent, value);
    return {
      key,
      value,
      label: ticket?.label ?? key,
      unknown: !ticket,
      changes,
      status: diffStatus(changes),
      errors: ticketErrors.find((te) => te.ticketKey === key)?.errors
    };
  });
  const openEntry = entries.find((e) => e.key === openKey) ?? null;
  return /* @__PURE__ */ jsxs11("div", { className: "mb-2 border border-muted rounded-md", children: [
    /* @__PURE__ */ jsxs11("div", { className: "px-2 py-1.5 border-b border-muted/60 space-y-3", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx16("span", { className: "font-semibold text-foreground flex-1", children: labels.reviewTitle }),
        /* @__PURE__ */ jsx16(
          "button",
          {
            type: "button",
            onClick: onSelectAll,
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
            children: labels.diffSelectAll
          }
        ),
        /* @__PURE__ */ jsx16("span", { className: "text-muted-foreground/50", children: "\xB7" }),
        /* @__PURE__ */ jsx16(
          "button",
          {
            type: "button",
            onClick: onDeselectAll,
            className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
            children: labels.diffDeselectAll
          }
        )
      ] }),
      /* @__PURE__ */ jsx16("p", { className: "text-xs text-muted-foreground mt-0.5", children: labels.reviewDescription })
    ] }),
    /* @__PURE__ */ jsx16("div", { className: "divide-y divide-muted/60", children: entries.length === 0 ? /* @__PURE__ */ jsx16("p", { className: "px-2 py-2 text-xs text-muted-foreground", children: labels.diffNoChanges }) : entries.map((entry) => {
      const selected = selectedKeys.includes(entry.key);
      return /* @__PURE__ */ jsxs11("div", { className: "px-2 py-2 space-y-1.5", children: [
        /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx16(
            Checkbox,
            {
              id: `diff-${entry.key}`,
              checked: selected,
              onCheckedChange: () => onToggle(entry.key),
              "aria-label": labels.diffInclude
            }
          ),
          /* @__PURE__ */ jsx16("label", { htmlFor: `diff-${entry.key}`, className: "font-medium text-foreground text-xs flex-1 cursor-pointer min-w-0", children: /* @__PURE__ */ jsx16("span", { className: "truncate inline-block align-middle max-w-full", children: entry.label }) }),
          /* @__PURE__ */ jsx16("code", { className: "text-xs font-mono text-muted-foreground/60 truncate hidden sm:inline", children: entry.key }),
          entry.unknown && /* @__PURE__ */ jsx16(Badge, { variant: "outline", className: "text-xs text-muted-foreground border-dashed", children: labels.diffUnknownTicket }),
          /* @__PURE__ */ jsxs11(
            Button,
            {
              type: "button",
              variant: "secondary",
              size: "sm",
              onClick: () => setOpenKey(entry.key),
              className: "shrink-0 gap-1",
              title: labels.diffViewFull,
              children: [
                /* @__PURE__ */ jsx16(Expand, { className: "size-3.5" }),
                labels.diffViewFull
              ]
            }
          ),
          /* @__PURE__ */ jsxs11(Badge, { variant: "outline", className: cn("text-xs border rounded-md", statusStyles(entry.status)), children: [
            entry.status === "identical" && labels.diffIdentical,
            entry.status === "modified" && labels.diffModified,
            entry.status === "added" && labels.diffAdded,
            entry.status === "removed" && labels.diffRemoved
          ] })
        ] }),
        entry.errors && entry.errors.length > 0 && /* @__PURE__ */ jsxs11("div", { className: "ml-6 flex items-start gap-1.5 text-xs text-red-500", children: [
          /* @__PURE__ */ jsx16(AlertTriangle2, { className: "size-3 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsx16("ul", { className: "space-y-0.5", children: entry.errors.map((err, i) => /* @__PURE__ */ jsx16("li", { children: err }, i)) })
        ] }),
        /* @__PURE__ */ jsx16("div", { className: "ml-6", children: entry.changes.length === 0 ? /* @__PURE__ */ jsx16("p", { className: "text-xs text-muted-foreground", children: labels.diffNoChanges }) : /* @__PURE__ */ jsx16("ul", { className: "space-y-0.5 text-xs", children: entry.changes.map((change, i) => {
          const path = change.path.replace(/^\$\.?/, "");
          if (change.kind === "added") {
            return /* @__PURE__ */ jsxs11("li", { className: "flex items-start gap-1 text-green-600 dark:text-green-400", children: [
              /* @__PURE__ */ jsx16(Plus2, { className: "size-3 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsx16("code", { className: "font-mono break-all", children: path }),
              /* @__PURE__ */ jsx16("span", { className: "text-muted-foreground", children: "=" }),
              /* @__PURE__ */ jsx16("span", { className: "break-all", children: renderValue(change.new, labels) })
            ] }, i);
          }
          if (change.kind === "removed") {
            return /* @__PURE__ */ jsxs11("li", { className: "flex items-start gap-1 text-red-500", children: [
              /* @__PURE__ */ jsx16(Minus2, { className: "size-3 mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsx16("code", { className: "font-mono break-all", children: path }),
              /* @__PURE__ */ jsx16("span", { className: "text-muted-foreground", children: "=" }),
              /* @__PURE__ */ jsx16("span", { className: "break-all", children: renderValue(change.old, labels) })
            ] }, i);
          }
          return /* @__PURE__ */ jsxs11("li", { className: "flex items-start gap-1 text-amber-600 dark:text-amber-400", children: [
            /* @__PURE__ */ jsx16("code", { className: "font-mono break-all", children: path }),
            /* @__PURE__ */ jsxs11("span", { className: "min-w-0 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx16("span", { className: "break-all line-through opacity-70", children: renderValue(change.old, labels) }),
              /* @__PURE__ */ jsx16(ArrowRight, { className: "size-3 shrink-0" }),
              /* @__PURE__ */ jsx16("span", { className: "break-all", children: renderValue(change.new, labels) })
            ] })
          ] }, i);
        }) }) })
      ] }, entry.key);
    }) }),
    /* @__PURE__ */ jsx16(
      DiffDialog,
      {
        labels,
        title: openEntry?.label ?? "",
        subtitle: openEntry?.key,
        statusLabel: openEntry ? statusLabel(openEntry.status, labels) : void 0,
        statusClass: openEntry ? statusStyles(openEntry.status) : void 0,
        oldValue: openEntry ? tickets.find((t) => t.key === openEntry.key)?.existingContent : void 0,
        newValue: openEntry?.value,
        open: !!openEntry,
        onOpenChange: (open) => {
          if (!open) setOpenKey(null);
        }
      }
    )
  ] });
}

// src/module/components/response-section.tsx
import { Fragment, jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
function formatElapsed(ms) {
  const total = Math.floor(ms / 1e3);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
function defaultSelectedKeys(response, tickets) {
  if (!response?.parsed) return [];
  const parsed = response.parsed;
  const known = new Set(tickets.map((t) => t.key));
  const keys = [];
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const itemKeys = Object.keys(item);
        if (itemKeys.length === 1 && known.has(itemKeys[0])) keys.push(itemKeys[0]);
      }
    }
  } else if (parsed && typeof parsed === "object") {
    for (const key of Object.keys(parsed)) {
      if (known.has(key)) keys.push(key);
    }
  }
  return keys;
}
function ResponseSection({
  labels,
  status,
  response,
  streamingText,
  streamingReasoning = "",
  invalidMode = "warn",
  tickets = [],
  onPlug
}) {
  const isLoading = status === AiPanelStatus.Loading;
  const isStreaming = status === AiPanelStatus.Streaming;
  const isError = status === AiPanelStatus.Error;
  const isDone = status === AiPanelStatus.Done;
  const isBusy = isLoading || isStreaming;
  const validation = response?.validation;
  const plugBlocked = invalidMode === "block" && !!validation && !validation.ok;
  const rawDisplay = streamingText || response?.raw || "";
  const displayText = useMemo2(() => formatJson(rawDisplay), [rawDisplay]);
  const [elapsed, setElapsed] = useState8(0);
  const startTimeRef = useRef3(null);
  const [prevBusy, setPrevBusy] = useState8(false);
  const [reasoningOpen, setReasoningOpen] = useState8(true);
  const [selectedKeys, setSelectedKeys] = useState8([]);
  const [prevResponse, setPrevResponse] = useState8(null);
  if (isBusy && !prevBusy) {
    setElapsed(0);
  }
  if (prevBusy !== isBusy) {
    setPrevBusy(isBusy);
  }
  if (response !== prevResponse) {
    setPrevResponse(response);
    setSelectedKeys(defaultSelectedKeys(response, tickets));
  }
  useEffect(() => {
    if (!isBusy) {
      startTimeRef.current = null;
      return;
    }
    startTimeRef.current = startTimeRef.current ?? Date.now();
    const id = setInterval(() => {
      if (startTimeRef.current !== null) setElapsed(Date.now() - startTimeRef.current);
    }, 1e3);
    return () => clearInterval(id);
  }, [isBusy]);
  const handleToggle = useCallback3((key) => {
    setSelectedKeys((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }, []);
  const handleSelectAll = useCallback3(() => {
    setSelectedKeys(defaultSelectedKeys(response, tickets));
  }, [response, tickets]);
  const handleDeselectAll = useCallback3(() => {
    setSelectedKeys([]);
  }, []);
  const showDiff = isDone && !!response?.parsed && !!onPlug;
  return /* @__PURE__ */ jsxs12("section", { children: [
    /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-1.5 mb-2", children: [
      /* @__PURE__ */ jsx17(Bot, { className: "size-3" }),
      /* @__PURE__ */ jsx17("span", { className: "font-semibold text-foreground flex-1", children: labels.response }),
      isBusy && /* @__PURE__ */ jsx17("span", { className: "text-xs text-muted-foreground tabular-nums", children: isLoading ? labels.generating : `\u23F1 ${formatElapsed(elapsed)}` })
    ] }),
    isLoading ? /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2 p-3 text-muted-foreground", children: [
      /* @__PURE__ */ jsx17(Loader22, { className: "size-4 animate-spin" }),
      /* @__PURE__ */ jsx17("span", { children: labels.generating })
    ] }) : isError ? /* @__PURE__ */ jsxs12("div", { className: "border border-red-500/20 rounded-md p-3 space-y-1", children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-1.5 text-red-500", children: [
        /* @__PURE__ */ jsx17(AlertTriangle3, { className: "size-3.5" }),
        /* @__PURE__ */ jsx17("span", { className: "font-semibold text-xs", children: labels.error })
      ] }),
      /* @__PURE__ */ jsx17("p", { className: "text-xs text-red-500/80", children: response?.error })
    ] }) : /* @__PURE__ */ jsxs12(Fragment, { children: [
      streamingReasoning && /* @__PURE__ */ jsxs12("div", { className: "mb-2 border border-muted rounded-md", children: [
        /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-1.5 px-2 py-1.5", children: [
          /* @__PURE__ */ jsx17(Brain, { className: "size-3 text-muted-foreground" }),
          /* @__PURE__ */ jsx17("span", { className: "font-semibold text-foreground flex-1", children: labels.reasoning }),
          /* @__PURE__ */ jsxs12("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
            "\u23F1 ",
            formatElapsed(elapsed)
          ] }),
          /* @__PURE__ */ jsx17(
            "button",
            {
              type: "button",
              onClick: () => setReasoningOpen((v) => !v),
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": reasoningOpen ? labels.hide : labels.show,
              children: reasoningOpen ? /* @__PURE__ */ jsx17(ChevronDown4, { className: "size-3.5" }) : /* @__PURE__ */ jsx17(ChevronRight4, { className: "size-3.5" })
            }
          )
        ] }),
        reasoningOpen && /* @__PURE__ */ jsxs12("pre", { className: "text-xs font-mono bg-muted/50 p-2 rounded-b-md overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto", children: [
          streamingReasoning,
          isStreaming && /* @__PURE__ */ jsx17("span", { className: "animate-pulse", children: "\u258A" })
        ] })
      ] }),
      showDiff && response && /* @__PURE__ */ jsx17(
        DiffSection,
        {
          labels,
          response,
          tickets,
          selectedKeys,
          onToggle: handleToggle,
          onSelectAll: handleSelectAll,
          onDeselectAll: handleDeselectAll
        }
      ),
      displayText ? /* @__PURE__ */ jsxs12(Fragment, { children: [
        /* @__PURE__ */ jsxs12("pre", { className: "text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap leading-relaxed", children: [
          displayText,
          isStreaming && /* @__PURE__ */ jsx17("span", { className: "animate-pulse", children: "\u258A" })
        ] }),
        isDone && validation && /* @__PURE__ */ jsx17("div", { className: "mt-2 space-y-1", children: validation.ok ? /* @__PURE__ */ jsxs12("p", { className: "flex items-center gap-1.5 text-xs text-green-600", children: [
          /* @__PURE__ */ jsx17(CircleCheck, { className: "size-3.5 shrink-0" }),
          /* @__PURE__ */ jsx17("span", { className: "font-semibold", children: labels.responseValid })
        ] }) : /* @__PURE__ */ jsxs12("p", { className: "flex items-center gap-1.5 text-xs text-red-500", children: [
          /* @__PURE__ */ jsx17(CircleX, { className: "size-3.5 shrink-0" }),
          /* @__PURE__ */ jsx17("span", { className: "font-semibold", children: labels.responseInvalid })
        ] }) }),
        isDone && onPlug && /* @__PURE__ */ jsxs12(
          Button,
          {
            variant: "secondary",
            size: "default",
            disabled: plugBlocked,
            onClick: () => response && onPlug(response, selectedKeys),
            className: "mt-2 w-full gap-1",
            children: [
              /* @__PURE__ */ jsx17(Sparkles2, { className: "size-3" }),
              showDiff ? `${labels.plugSelected} (${selectedKeys.length})` : labels.plugLabel
            ]
          }
        )
      ] }) : isStreaming ? /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2 p-3 text-muted-foreground", children: [
        /* @__PURE__ */ jsx17(Loader22, { className: "size-4 animate-spin" }),
        /* @__PURE__ */ jsx17("span", { children: labels.generating })
      ] }) : /* @__PURE__ */ jsx17(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsx17(Sparkles2, { className: "size-5" }),
          title: labels.noResponse,
          description: labels.noResponseDesc,
          className: "border"
        }
      )
    ] })
  ] });
}

// src/module/components/feedback-section.tsx
import { CircleX as CircleX2 } from "lucide-react";
import { jsx as jsx18, jsxs as jsxs13 } from "react/jsx-runtime";
function FeedbackSection({ labels, feedback, enabled, onToggleEnabled }) {
  if (!feedback || feedback.ok) return null;
  return /* @__PURE__ */ jsxs13("section", { className: "border border-red-500/20 rounded-md p-3 space-y-2", children: [
    /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-1.5 text-red-500", children: [
        /* @__PURE__ */ jsx18(CircleX2, { className: "size-3.5 shrink-0" }),
        /* @__PURE__ */ jsx18("span", { className: "font-semibold text-xs", children: labels.error })
      ] }),
      /* @__PURE__ */ jsxs13("label", { className: "flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none", children: [
        /* @__PURE__ */ jsx18(
          Checkbox,
          {
            checked: enabled,
            onCheckedChange: (checked) => onToggleEnabled(checked === true)
          }
        ),
        /* @__PURE__ */ jsx18("span", { children: labels.includeErrorsInPrompt })
      ] })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "text-xs text-red-500/80 space-y-1", children: [
      feedback.errors.map((err) => /* @__PURE__ */ jsxs13("p", { children: [
        "\u2022 ",
        err
      ] }, err)),
      feedback.ticketErrors?.map((ticketErr) => /* @__PURE__ */ jsxs13("div", { children: [
        /* @__PURE__ */ jsxs13("span", { className: "font-semibold", children: [
          "[",
          ticketErr.ticketKey,
          "]"
        ] }),
        /* @__PURE__ */ jsx18("ul", { className: "pl-4 space-y-0.5", children: ticketErr.errors.map((err) => /* @__PURE__ */ jsxs13("li", { children: [
          "\u2022 ",
          err
        ] }, err)) })
      ] }, ticketErr.ticketKey))
    ] })
  ] });
}

// src/module/components/config-sheet.tsx
import { useState as useState9 } from "react";
import { Settings, ExternalLink, Info } from "lucide-react";

// src/primitives/label.tsx
import { jsx as jsx19 } from "react/jsx-runtime";
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx19(
    "label",
    {
      "data-slot": "label",
      className: cn2(
        "flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

// src/primitives/switch.tsx
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { jsx as jsx20 } from "react/jsx-runtime";
function Switch({ className, ...props }) {
  return /* @__PURE__ */ jsx20(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      className: cn2(
        "peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-input transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx20(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn2(
            "pointer-events-none block size-3.5 rounded-full bg-foreground shadow-sm ring-0 transition-transform data-checked:translate-x-[14px] data-unchecked:translate-x-[2px]"
          )
        }
      )
    }
  );
}

// src/primitives/select.tsx
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ChevronDownIcon, CheckIcon as CheckIcon2, ChevronUpIcon } from "lucide-react";
import { jsx as jsx21, jsxs as jsxs14 } from "react/jsx-runtime";
var Select = SelectPrimitive.Root;
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs14(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn2(
        "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-7 data-[size=sm]:h-6 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx21(
          SelectPrimitive.Icon,
          {
            render: /* @__PURE__ */ jsx21(ChevronDownIcon, { className: "pointer-events-none size-3.5 text-muted-foreground" })
          }
        )
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}) {
  return /* @__PURE__ */ jsx21(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsx21(
    SelectPrimitive.Positioner,
    {
      side,
      sideOffset,
      align,
      alignOffset,
      alignItemWithTrigger,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsxs14(
        SelectPrimitive.Popup,
        {
          "data-slot": "select-content",
          "data-align-trigger": alignItemWithTrigger,
          className: cn2("isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!", className),
          ...props,
          children: [
            /* @__PURE__ */ jsx21(SelectScrollUpButton, {}),
            /* @__PURE__ */ jsx21(SelectPrimitive.List, { children }),
            /* @__PURE__ */ jsx21(SelectScrollDownButton, {})
          ]
        }
      )
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs14(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn2(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx21(SelectPrimitive.ItemText, { className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap", children }),
        /* @__PURE__ */ jsx21(
          SelectPrimitive.ItemIndicator,
          {
            render: /* @__PURE__ */ jsx21("span", { className: "pointer-events-none absolute end-2 flex items-center justify-center" }),
            children: /* @__PURE__ */ jsx21(CheckIcon2, { className: "pointer-events-none" })
          }
        )
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx21(
    SelectPrimitive.ScrollUpArrow,
    {
      "data-slot": "select-scroll-up-button",
      className: cn2(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx21(
        ChevronUpIcon,
        {}
      )
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx21(
    SelectPrimitive.ScrollDownArrow,
    {
      "data-slot": "select-scroll-down-button",
      className: cn2(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-3.5",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx21(
        ChevronDownIcon,
        {}
      )
    }
  );
}

// src/module/components/config-sheet.tsx
import { Fragment as Fragment2, jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
var LANGUAGE_NAMES = {
  [AiPanelLanguage.Fr]: "Fran\xE7ais",
  [AiPanelLanguage.En]: "English"
};
var INVALID_MODE_NAMES = {
  [AiPanelInvalidMode.Warn]: (labels) => labels.invalidModeWarn,
  [AiPanelInvalidMode.Block]: (labels) => labels.invalidModeBlock
};
var DEFAULT_CONFIGS = {
  [ProviderType.Opencode]: { type: ProviderType.Opencode, enabled: true, model: "big-pickle" },
  [ProviderType.Shadcn]: { type: ProviderType.Shadcn, enabled: false, apiKey: "", baseUrl: "", model: "" },
  [ProviderType.Fallback]: { type: ProviderType.Fallback, enabled: false, apiUrl: "/api/ai/generate" }
};
function ConfigSheet({ labels, language, onLanguageChange, adapter, onAdapterChange, invalidMode, onInvalidModeChange }) {
  const [config, setConfig] = useState9(adapter ?? DEFAULT_CONFIGS[ProviderType.Opencode]);
  const info = PROVIDER_INFO[language]?.[config.type];
  const meta = PROVIDER_META[config.type];
  const isEnabled = config.enabled ?? true;
  function setAndNotify(next) {
    setConfig(next);
    onAdapterChange?.(next);
  }
  return /* @__PURE__ */ jsxs15(Sheet, { children: [
    /* @__PURE__ */ jsxs15(SheetTrigger, { render: /* @__PURE__ */ jsx22(Button, { variant: "secondary", size: "sm", className: "gap-1 cursor-pointer" }), children: [
      /* @__PURE__ */ jsx22(Settings, { className: "size-3.5" }),
      labels.settings
    ] }),
    /* @__PURE__ */ jsx22(SheetContent, { side: "right", className: "w-[400px] sm:w-[440px] p-0", children: /* @__PURE__ */ jsxs15("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsx22(SheetHeader, { className: "px-4 py-3 shrink-0 border-b space-y-1", children: /* @__PURE__ */ jsx22(SheetTitle, { className: "text-sm", children: labels.settings }) }),
      /* @__PURE__ */ jsxs15("div", { className: "flex-1 overflow-y-auto no-scrollbar p-4 space-y-5", children: [
        /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: labels.languageLabel }),
          /* @__PURE__ */ jsx22("p", { className: "text-xs text-muted-foreground", children: labels.languageDescription }),
          /* @__PURE__ */ jsxs15(Select, { value: language, onValueChange: (v) => onLanguageChange(v), children: [
            /* @__PURE__ */ jsx22(SelectTrigger, { className: "h-8 text-xs w-full cursor-pointer", children: LANGUAGE_NAMES[language] }),
            /* @__PURE__ */ jsx22(SelectContent, { children: [AiPanelLanguage.Fr, AiPanelLanguage.En].map((lang) => /* @__PURE__ */ jsx22(SelectItem, { value: lang, className: "text-xs cursor-pointer", children: LANGUAGE_NAMES[lang] }, lang)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: labels.invalidModeLabel }),
          /* @__PURE__ */ jsx22("p", { className: "text-xs text-muted-foreground", children: labels.invalidModeDescription }),
          /* @__PURE__ */ jsxs15(
            Select,
            {
              value: invalidMode,
              onValueChange: (v) => onInvalidModeChange(v),
              children: [
                /* @__PURE__ */ jsx22(SelectTrigger, { className: "h-8 text-xs w-full cursor-pointer", children: INVALID_MODE_NAMES[invalidMode](labels) }),
                /* @__PURE__ */ jsx22(SelectContent, { children: [AiPanelInvalidMode.Warn, AiPanelInvalidMode.Block].map((mode) => /* @__PURE__ */ jsx22(SelectItem, { value: mode, className: "text-xs cursor-pointer", children: INVALID_MODE_NAMES[mode](labels) }, mode)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx22("div", { className: "border-t" }),
        /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: labels.selectProvider }),
          /* @__PURE__ */ jsx22("p", { className: "text-xs text-muted-foreground", children: meta?.description }),
          /* @__PURE__ */ jsxs15(
            Select,
            {
              value: config.type,
              onValueChange: (v) => {
                const pt = v;
                const cfg = DEFAULT_CONFIGS[pt];
                setAndNotify(cfg);
              },
              children: [
                /* @__PURE__ */ jsx22(SelectTrigger, { className: "h-8 text-xs w-full cursor-pointer", children: meta?.label }),
                /* @__PURE__ */ jsx22(SelectContent, { children: Object.values(ProviderType).map((pt) => /* @__PURE__ */ jsx22(SelectItem, { value: pt, className: "text-xs cursor-pointer", children: PROVIDER_META[pt]?.label ?? pt }, pt)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx22("div", { className: "space-y-0.5", children: /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium cursor-pointer", children: isEnabled ? labels.enableProvider : labels.disableProvider }) }),
          /* @__PURE__ */ jsx22(
            Switch,
            {
              checked: isEnabled,
              onCheckedChange: (checked) => {
                setAndNotify({ ...config, enabled: checked });
              }
            }
          )
        ] }),
        info && /* @__PURE__ */ jsxs15(Fragment2, { children: [
          /* @__PURE__ */ jsxs15("div", { className: "rounded-lg bg-muted/50 border p-3 space-y-1.5", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-1.5 text-xs font-medium text-foreground", children: [
              /* @__PURE__ */ jsx22(Info, { className: "size-3" }),
              labels.helpSection
            ] }),
            /* @__PURE__ */ jsx22("p", { className: "text-xs text-muted-foreground whitespace-pre-wrap", children: info.help }),
            info.docLinks.length > 0 && /* @__PURE__ */ jsxs15("div", { className: "pt-1 space-y-1", children: [
              /* @__PURE__ */ jsx22("p", { className: "text-xs font-medium text-foreground", children: labels.docLinks }),
              info.docLinks.map((link, i) => /* @__PURE__ */ jsxs15(
                "a",
                {
                  href: link.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx22(ExternalLink, { className: "size-3" }),
                    link.label
                  ]
                },
                i
              ))
            ] })
          ] }),
          config.type === ProviderType.Opencode && /* @__PURE__ */ jsx22(
            OpenCodeFields,
            {
              config,
              labels,
              info,
              onChange: setAndNotify
            }
          ),
          config.type === ProviderType.Shadcn && /* @__PURE__ */ jsx22(
            ShadcnFields,
            {
              config,
              labels,
              info,
              onChange: setAndNotify
            }
          ),
          config.type === ProviderType.Fallback && /* @__PURE__ */ jsx22(
            FallbackFields,
            {
              config,
              labels,
              info,
              onChange: setAndNotify
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function OpenCodeFields({
  config,
  labels,
  info,
  onChange
}) {
  return /* @__PURE__ */ jsxs15("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: info.baseUrlLabel }),
      /* @__PURE__ */ jsx22(
        Input,
        {
          className: "h-8 text-xs",
          placeholder: info.baseUrlPlaceholder,
          value: config.apiUrl ?? "",
          onChange: (e) => onChange({ ...config, apiUrl: e.target.value || void 0 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: info.apiKeyLabel }),
      /* @__PURE__ */ jsx22(
        Input,
        {
          className: "h-8 text-xs",
          type: "password",
          placeholder: info.apiKeyPlaceholder,
          value: config.password ?? "",
          onChange: (e) => onChange({ ...config, password: e.target.value || void 0 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: labels.modelLabel }),
      /* @__PURE__ */ jsxs15(
        Select,
        {
          value: config.model ?? "",
          onValueChange: (v) => onChange({ ...config, model: v || void 0 }),
          children: [
            /* @__PURE__ */ jsx22(SelectTrigger, { className: "h-8 text-xs w-full cursor-pointer", children: config.model ? modelDisplayName(config.model) : labels.modelNone }),
            /* @__PURE__ */ jsxs15(SelectContent, { children: [
              /* @__PURE__ */ jsx22(SelectItem, { value: "", className: "text-xs cursor-pointer", children: labels.modelNone }),
              Object.values(OpenCodeModels).filter(Boolean).map((m) => /* @__PURE__ */ jsx22(SelectItem, { value: m, className: "text-xs cursor-pointer", children: modelDisplayName(m) }, m))
            ] })
          ]
        }
      )
    ] })
  ] });
}
function ShadcnFields({
  config,
  labels,
  info,
  onChange
}) {
  return /* @__PURE__ */ jsxs15("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: info.apiKeyLabel }),
      /* @__PURE__ */ jsx22(
        Input,
        {
          className: "h-8 text-xs",
          placeholder: info.apiKeyPlaceholder,
          value: config.apiKey ?? "",
          onChange: (e) => onChange({ ...config, apiKey: e.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: info.baseUrlLabel }),
      /* @__PURE__ */ jsx22(
        Input,
        {
          className: "h-8 text-xs",
          placeholder: info.baseUrlPlaceholder,
          value: config.baseUrl ?? "",
          onChange: (e) => onChange({ ...config, baseUrl: e.target.value || void 0 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: labels.modelLabel }),
      /* @__PURE__ */ jsxs15(
        Select,
        {
          value: config.model ?? "",
          onValueChange: (v) => onChange({ ...config, model: v || void 0 }),
          children: [
            /* @__PURE__ */ jsx22(SelectTrigger, { className: "h-8 text-xs w-full cursor-pointer", children: config.model ? modelDisplayName(config.model) : labels.modelNone }),
            /* @__PURE__ */ jsxs15(SelectContent, { children: [
              /* @__PURE__ */ jsx22(SelectItem, { value: "", className: "text-xs cursor-pointer", children: labels.modelNone }),
              Object.values(ShadcnModels).filter(Boolean).map((m) => /* @__PURE__ */ jsx22(SelectItem, { value: m, className: "text-xs cursor-pointer", children: modelDisplayName(m) }, m))
            ] })
          ]
        }
      )
    ] })
  ] });
}
function FallbackFields({
  config,
  info,
  onChange
}) {
  return /* @__PURE__ */ jsx22("div", { className: "space-y-3", children: /* @__PURE__ */ jsxs15("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx22(Label, { className: "text-xs font-medium", children: info.baseUrlLabel }),
    /* @__PURE__ */ jsx22(
      Input,
      {
        className: "h-8 text-xs",
        placeholder: info.baseUrlPlaceholder,
        value: config.apiUrl ?? "",
        onChange: (e) => onChange({ ...config, apiUrl: e.target.value || void 0 })
      }
    )
  ] }) });
}

// src/module/components/info-sheet.tsx
import { useState as useState10 } from "react";
import {
  Info as Info2,
  Sparkles as Sparkles3,
  PenLine,
  FolderOpen,
  ListChecks,
  ShieldCheck,
  RefreshCcw,
  Gauge,
  Settings2,
  Zap,
  Braces,
  Heart,
  ArrowLeftRight
} from "lucide-react";

// src/module/project-links.ts
var AI_PANEL_PROJECT_LINKS = {
  landingPage: "https://oneshot-aipanel.asistem19.com",
  github: "https://github.com/bn-dev-19/one-shot-ai-panel"
};

// src/module/components/info-sheet.tsx
import { Fragment as Fragment3, jsx as jsx23, jsxs as jsxs16 } from "react/jsx-runtime";
function InfoSheet({ labels, showIntegration = true, showCredits = true }) {
  const [open, setOpen] = useState10(false);
  const links = [
    { label: labels.infoCreditsLandingLabel, url: AI_PANEL_PROJECT_LINKS.landingPage },
    { label: labels.infoCreditsGithubLabel, url: AI_PANEL_PROJECT_LINKS.github }
  ].filter((link) => link.url.length > 0);
  const sections = [
    {
      key: "overview",
      icon: /* @__PURE__ */ jsx23(Sparkles3, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoOverviewTitle,
      body: labels.infoOverviewBody
    },
    {
      key: "prompt",
      icon: /* @__PURE__ */ jsx23(PenLine, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoPromptTitle,
      body: labels.infoPromptBody
    },
    {
      key: "files",
      icon: /* @__PURE__ */ jsx23(FolderOpen, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoFilesTitle,
      body: labels.infoFilesBody
    },
    {
      key: "tickets",
      icon: /* @__PURE__ */ jsx23(ListChecks, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoTicketsTitle,
      body: labels.infoTicketsBody
    },
    {
      key: "validation",
      icon: /* @__PURE__ */ jsx23(ShieldCheck, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoValidationTitle,
      body: labels.infoValidationBody
    },
    {
      key: "feedback",
      icon: /* @__PURE__ */ jsx23(RefreshCcw, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoFeedbackTitle,
      body: labels.infoFeedbackBody
    },
    {
      key: "status",
      icon: /* @__PURE__ */ jsx23(Gauge, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoStatusTitle,
      body: labels.infoStatusBody
    },
    {
      key: "config",
      icon: /* @__PURE__ */ jsx23(Settings2, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoConfigTitle,
      body: labels.infoConfigBody
    },
    {
      key: "review",
      icon: /* @__PURE__ */ jsx23(ArrowLeftRight, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoReviewTitle,
      body: labels.infoReviewBody
    },
    {
      key: "actions",
      icon: /* @__PURE__ */ jsx23(Zap, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoActionsTitle,
      body: labels.infoActionsBody
    },
    {
      key: "integration",
      icon: /* @__PURE__ */ jsx23(Braces, { className: "size-3.5 text-muted-foreground" }),
      title: labels.infoIntegrationTitle,
      body: labels.infoIntegrationBody
    }
  ];
  const visibleSections = sections.filter((section) => section.key !== "integration" || showIntegration);
  return /* @__PURE__ */ jsxs16(Fragment3, { children: [
    /* @__PURE__ */ jsxs16(
      Button,
      {
        variant: "secondary",
        size: "sm",
        className: "gap-1 cursor-pointer",
        onClick: () => setOpen(true),
        title: labels.infoButton,
        "aria-label": labels.infoButton,
        children: [
          /* @__PURE__ */ jsx23(Info2, { className: "size-3.5" }),
          labels.infoButton
        ]
      }
    ),
    /* @__PURE__ */ jsx23(Sheet, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsx23(SheetContent, { side: "right", className: "w-[440px] sm:w-[520px] p-0", children: /* @__PURE__ */ jsxs16("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs16(SheetHeader, { className: "px-4 py-3 shrink-0 border-b space-y-1", children: [
        /* @__PURE__ */ jsxs16(SheetTitle, { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx23(Sparkles3, { className: "size-4 text-muted-foreground" }),
          labels.infoSheetTitle
        ] }),
        /* @__PURE__ */ jsx23("p", { className: "text-xs text-muted-foreground", children: labels.infoSheetDescription })
      ] }),
      /* @__PURE__ */ jsxs16("div", { className: "flex-1 overflow-y-auto no-scrollbar p-4 space-y-5", children: [
        visibleSections.map((section) => /* @__PURE__ */ jsxs16("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-1.5", children: [
            section.icon,
            /* @__PURE__ */ jsx23("span", { className: "text-xs font-semibold text-foreground", children: section.title })
          ] }),
          section.body.split("\n\n").map((paragraph, index) => /* @__PURE__ */ jsx23(
            "p",
            {
              className: "text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap",
              children: paragraph
            },
            index
          ))
        ] }, section.key)),
        showCredits && /* @__PURE__ */ jsxs16("div", { className: "border-t pt-3 space-y-1.5", children: [
          /* @__PURE__ */ jsxs16("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx23(Heart, { className: "size-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsx23("span", { className: "text-xs font-semibold text-foreground", children: labels.infoCreditsTitle })
          ] }),
          /* @__PURE__ */ jsx23("p", { className: "text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap", children: labels.infoCreditsBody }),
          links.length > 0 && /* @__PURE__ */ jsx23("div", { className: "flex flex-wrap gap-x-3 gap-y-1 pt-0.5", children: links.map((link) => /* @__PURE__ */ jsx23(
            "a",
            {
              href: link.url,
              target: "_blank",
              rel: "noreferrer",
              className: "text-xs text-foreground underline underline-offset-4 hover:text-primary",
              children: link.label
            },
            link.url
          )) })
        ] })
      ] })
    ] }) }) })
  ] });
}

// src/module/components/OneShotAiPanel.tsx
import { jsx as jsx24, jsxs as jsxs17 } from "react/jsx-runtime";
registerDefaultAdapters();
function assembleFullPrompt(labels, systemPrompt, userPrompt, additionalContext, resolvedFiles, resolvedTickets, feedback, includeFeedback) {
  const parts = [];
  if (systemPrompt) parts.push(systemPrompt);
  const ctxParts = [];
  const enabledFiles = resolvedFiles.filter((f) => f.enabled && f.present);
  if (enabledFiles.length > 0) {
    ctxParts.push(labels.promptSectionFiles);
    for (const f of enabledFiles) {
      ctxParts.push(f.path ? `[${f.label}] \u2192 ${f.path}` : `[${f.label}]`);
    }
  }
  const enabledTickets = resolvedTickets.filter((t) => t.enabled && !t.done);
  if (enabledTickets.length > 0) {
    ctxParts.push(labels.promptSectionTickets);
    for (const t of enabledTickets) {
      let line = `[${t.label}]`;
      if (t.description) line += `
${labels.ticketDescription} : ${t.description}`;
      if (t.explication) line += `
${labels.ticketExplanation} : ${t.explication}`;
      line += `
${labels.responseSchema} :
\`\`\`json
${JSON.stringify(t.responseSchema, null, 2)}
\`\`\``;
      if (t.existingContent) {
        const serialized = typeof t.existingContent === "string" ? t.existingContent : JSON.stringify(t.existingContent, null, 2);
        line += `
${labels.ticketExistingContent} :
\`\`\`
${serialized}
\`\`\``;
      } else {
        line += `
${labels.ticketNoExistingContent}`;
      }
      ctxParts.push(line);
    }
    ctxParts.push(labels.responseFormatInstruction);
  }
  if (includeFeedback && feedback && !feedback.ok) {
    ctxParts.push(`${labels.promptSectionFeedback}
${labels.feedbackDescription}`);
    for (const err of feedback.errors) {
      ctxParts.push(`- ${err}`);
    }
    for (const ticketErr of feedback.ticketErrors ?? []) {
      ctxParts.push(`- [${ticketErr.ticketKey}] :`);
      for (const err of ticketErr.errors) {
        ctxParts.push(`  - ${err}`);
      }
    }
  }
  if (ctxParts.length > 0) parts.push(ctxParts.join("\n"));
  if (userPrompt) parts.push(`${labels.promptSectionUserPrompt}
${userPrompt}`);
  if (additionalContext) parts.push(`${labels.promptSectionAdditionalContext}
${additionalContext}`);
  return parts.join("\n\n");
}
function OneShotAiPanel({
  title,
  systemPrompt: systemPromptProp,
  initialUserPrompt,
  files,
  tickets,
  actionLabel,
  language = AiPanelLanguage.Fr,
  labels: labelsProp,
  onPlug,
  children,
  className,
  adapter,
  onSend,
  parser,
  invalidMode: invalidModeProp = AiPanelInvalidMode.Warn,
  showInfoIntegration = true,
  showInfoCredits = true,
  showInfoButton = true,
  showSettingsButton = true
}) {
  const [currentLanguage, setCurrentLanguage] = useState11(language);
  const labels = useMemo3(() => ({ ...translations[currentLanguage], ...labelsProp }), [currentLanguage, labelsProp]);
  const [currentAdapter, setCurrentAdapter] = useState11(adapter);
  const [invalidMode, setInvalidMode] = useState11(invalidModeProp);
  const [systemPrompt, setSystemPrompt] = useState11(systemPromptProp ?? "");
  const [userPrompt, setUserPrompt] = useState11(initialUserPrompt ?? "");
  const [additionalContext, setAdditionalContext] = useState11("");
  const [fileEnabled, setFileEnabled] = useState11({});
  const [ticketEnabled, setTicketEnabled] = useState11({});
  const [customFiles, setCustomFiles] = useState11([]);
  const customIdRef = useRef4(0);
  const [previewOpen, setPreviewOpen] = useState11(false);
  const [copied, setCopied] = useState11(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState11(true);
  const activeConfig = useMemo3(() => {
    if (currentAdapter && "enabled" in currentAdapter && !currentAdapter.enabled) return void 0;
    return currentAdapter;
  }, [currentAdapter]);
  const sendHandler = useMemo3(() => {
    if (onSend) return onSend;
    if (!activeConfig) return void 0;
    try {
      return buildSend(activeConfig);
    } catch {
      return void 0;
    }
  }, [onSend, activeConfig]);
  const { status, response, streamingText, streamingReasoning, send, cancel, reset } = useAiPanel({
    sendHandler,
    files,
    tickets,
    labels,
    parser
  });
  const feedback = response?.validation && !response.validation.ok ? response.validation : null;
  const allFiles = useMemo3(() => [...files ?? [], ...customFiles], [files, customFiles]);
  const resolvedFiles = useMemo3(() => allFiles.map((f) => ({
    ...f,
    enabled: fileEnabled[f.key] ?? f.enabled ?? true
  })), [allFiles, fileEnabled]);
  const resolvedTickets = useMemo3(() => (tickets ?? []).map((t) => ({
    ...t,
    enabled: ticketEnabled[t.key] ?? t.enabled ?? true
  })), [tickets, ticketEnabled]);
  const promptPresent = !!systemPrompt;
  const isBusy = status === AiPanelStatus.Loading || status === AiPanelStatus.Streaming;
  const fullPrompt = useMemo3(() => assembleFullPrompt(
    labels,
    systemPrompt,
    userPrompt,
    additionalContext,
    resolvedFiles,
    resolvedTickets,
    feedback,
    feedbackEnabled
  ), [labels, systemPrompt, userPrompt, additionalContext, resolvedFiles, resolvedTickets, feedback, feedbackEnabled]);
  const handleAction = () => {
    if (isBusy) {
      cancel();
      return;
    }
    reset();
    const activeTickets = resolvedTickets.filter((t) => t.enabled && !t.done);
    send(fullPrompt, activeTickets);
  };
  const handleAddCustomFile = useCallback4((path) => {
    customIdRef.current += 1;
    const key = `_custom-${customIdRef.current}`;
    const label = path.split("/").filter(Boolean).pop() ?? path;
    setCustomFiles((prev) => [...prev, { key, label, present: true, enabled: true, path }]);
  }, []);
  const handleRemoveCustomFile = useCallback4((key) => {
    setCustomFiles((prev) => prev.filter((f) => f.key !== key));
    setFileEnabled((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);
  const handleCopy = useCallback4(async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [fullPrompt]);
  return /* @__PURE__ */ jsxs17("div", { className: cn("flex flex-col h-full divide-y", className), children: [
    /* @__PURE__ */ jsxs17("div", { className: "flex items-center justify-between gap-2 px-4  py-3 border-b shrink-0", children: [
      /* @__PURE__ */ jsxs17("div", { className: "w-full flex items-center gap-2", children: [
        /* @__PURE__ */ jsx24(Bot2, { className: "size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx24("span", { className: "text-xs font-semibold text-foreground uppercase tracking-wider flex-1", children: title ?? labels.title })
      ] }),
      /* @__PURE__ */ jsxs17("div", { className: "flex items-end gap-1", children: [
        showInfoButton && /* @__PURE__ */ jsx24(InfoSheet, { labels, showIntegration: showInfoIntegration, showCredits: showInfoCredits }),
        showSettingsButton && /* @__PURE__ */ jsx24(
          ConfigSheet,
          {
            labels,
            language: currentLanguage,
            onLanguageChange: setCurrentLanguage,
            adapter: currentAdapter,
            onAdapterChange: setCurrentAdapter,
            invalidMode,
            onInvalidModeChange: setInvalidMode
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx24(
      StatusBar,
      {
        labels,
        promptPresent,
        userPromptPresent: userPrompt.trim().length > 0,
        additionalContextPresent: additionalContext.trim().length > 0,
        files: resolvedFiles,
        tickets: resolvedTickets,
        hasFeedback: feedback !== null
      }
    ),
    /* @__PURE__ */ jsxs17("div", { className: "flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-4 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx24(
        PromptSection,
        {
          labels,
          systemPrompt,
          onSystemPromptChange: setSystemPrompt,
          userPrompt,
          onUserPromptChange: setUserPrompt,
          additionalContext,
          onAdditionalContextChange: setAdditionalContext
        }
      ),
      /* @__PURE__ */ jsx24(
        FilesSection,
        {
          labels,
          files: allFiles,
          resolvedFiles,
          customFileKeys: new Set(customFiles.map((f) => f.key)),
          onToggleFile: (key) => setFileEnabled((prev) => ({ ...prev, [key]: !(prev[key] ?? allFiles.find((f) => f.key === key)?.enabled ?? true) })),
          onAddCustomFile: handleAddCustomFile,
          onRemoveCustomFile: handleRemoveCustomFile
        }
      ),
      /* @__PURE__ */ jsx24(
        TicketsSection,
        {
          labels,
          tickets: tickets ?? [],
          resolvedTickets,
          onToggleTicket: (key) => setTicketEnabled((prev) => ({ ...prev, [key]: !(prev[key] ?? tickets?.find((t) => t.key === key)?.enabled ?? true) }))
        }
      ),
      /* @__PURE__ */ jsx24(
        ResponseSection,
        {
          labels,
          status,
          response,
          streamingText,
          streamingReasoning,
          tickets: resolvedTickets,
          onPlug,
          invalidMode
        }
      ),
      /* @__PURE__ */ jsx24(
        FeedbackSection,
        {
          labels,
          feedback,
          enabled: feedbackEnabled,
          onToggleEnabled: setFeedbackEnabled
        }
      ),
      children
    ] }),
    /* @__PURE__ */ jsx24("div", { className: "px-4 py-3 shrink-0", children: /* @__PURE__ */ jsxs17("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxs17(
        Button,
        {
          variant: "secondary",
          size: "default",
          onClick: () => setPreviewOpen(true),
          className: "gap-1",
          children: [
            /* @__PURE__ */ jsx24(Eye, { className: "size-3" }),
            labels.viewPrompt
          ]
        }
      ),
      /* @__PURE__ */ jsx24(
        LoadingButton,
        {
          label: isBusy ? labels.cancel : actionLabel ?? labels.actionLabel,
          loading: isBusy,
          disableOnLoading: false,
          onClick: handleAction,
          size: "default",
          children: /* @__PURE__ */ jsx24(Sparkles4, { className: "size-3.5" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx24(Sheet, { open: previewOpen, onOpenChange: setPreviewOpen, children: /* @__PURE__ */ jsx24(SheetContent, { side: "right", className: "w-[480px] sm:w-[540px] p-0", children: /* @__PURE__ */ jsxs17("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs17(SheetHeader, { className: "px-4 py-3 shrink-0 border-b space-y-1", children: [
        /* @__PURE__ */ jsx24(SheetTitle, { className: "text-sm", children: labels.promptPreview }),
        /* @__PURE__ */ jsxs17("p", { className: "text-xs text-muted-foreground", children: [
          fullPrompt.length,
          " ",
          labels.promptCharCount
        ] }),
        /* @__PURE__ */ jsxs17(Button, { variant: "secondary", size: "sm", onClick: handleCopy, className: "gap-1 h-7", children: [
          copied ? /* @__PURE__ */ jsx24(Check4, { className: "size-3 text-green-500" }) : /* @__PURE__ */ jsx24(Copy, { className: "size-3" }),
          /* @__PURE__ */ jsx24("span", { className: "text-xs", children: copied ? labels.promptCopied : labels.copyPrompt })
        ] })
      ] }),
      /* @__PURE__ */ jsx24("div", { className: "flex-1 overflow-y-auto no-scrollbar p-4", children: /* @__PURE__ */ jsx24("p", { className: "text-xs whitespace-pre-wrap break-words leading-relaxed", children: fullPrompt || "\u2014" }) })
    ] }) }) })
  ] });
}

// src/module/index.ts
var ProviderType2 = ProviderType;
export {
  AI_PANEL_PROJECT_LINKS,
  AiPanelInvalidMode,
  AiPanelJsonType,
  AiPanelLanguage,
  FallbackAdapter,
  FeedbackSection,
  FilesSection,
  InfoSheet,
  OneShotAiPanel,
  OpenCodeAdapter,
  OpenCodeModels,
  PROVIDER_INFO,
  PROVIDER_META,
  PromptSection,
  ProviderType2 as ProviderType,
  ResponseSection,
  ShadcnAdapter,
  ShadcnModels,
  StatusBar,
  TicketItem,
  TicketsSection,
  buildSend,
  defaultLabels,
  modelDisplayName,
  register,
  registerDefaultAdapters,
  translations,
  useAiPanel,
  useStreaming
};
//# sourceMappingURL=index.js.map