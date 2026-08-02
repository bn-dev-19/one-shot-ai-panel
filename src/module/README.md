# OneShot AiPanel

Reusable React module: language-model-driven generation with source files, tickets to process, schema-validated JSON responses and an automatic correction loop.

## Prerequisites (host project)

The module depends on UI primitives and a `@/` path alias in the host project. The exact list is in [`primitives.json`](./primitives.json):

- shadcn/ui primitives: `badge`, `button`, `checkbox`, `dialog`, `empty`, `input`, `label`, `select`, `sheet`, `switch`, `textarea` — installable via the shadcn registry: `npx shadcn@latest add bn-dev-19/one-shot-ai-panel/<item>`
- these primitives are **base-ui** based (`@base-ui/react`) — see the root README for the radix vs base-ui integration rule
- `@/components/loading-button`
- `cn()` (provided in `lib/utils.ts`, based on `clsx` + `tailwind-merge`)
- Runtime: `lucide-react`, `zod` (>= 4.4), `@opencode-ai/sdk` (>= 1.18, OpenCode adapter)

## Usage

### Full component

```tsx
import { OneShotAiPanel, AiPanelLanguage, AiPanelJsonType, AiPanelInvalidMode } from "@/external-modules/ai-panel"

<OneShotAiPanel
  title="OneShot AI Panel"
  systemPrompt="You are a technical assistant. Answer in French."
  language={AiPanelLanguage.Fr}
  adapter={{ type: "opencode", enabled: true, model: "big-pickle" }}
  files={[
    { key: "contracts", label: "API contracts", present: true, path: "/home/project/specs/contracts.yml" },
  ]}
  tickets={[
    {
      key: "node",
      label: "Node to generate",
      done: false,
      description: "Generate an API node from the context",
      responseSchema: { type: AiPanelJsonType.Object, properties: { id: { type: AiPanelJsonType.String } } },
    },
  ]}
  onPlug={(response, selectedKeys) => console.log(response.parsed, selectedKeys)}
/>
```

### Headless hook (without the UI)

```tsx
import { useAiPanel, buildSend } from "@/external-modules/ai-panel"

const { status, response, streamingText, send, cancel, reset } = useAiPanel({
  sendHandler: buildSend({ type: "opencode", model: "big-pickle" }),
  files,
  tickets,
  parser, // optional
  labels,
})
```

### Without the configuration UI

All settings sheet values are passed as props; the buttons can be hidden:

```tsx
<OneShotAiPanel
  language={AiPanelLanguage.En}
  invalidMode={AiPanelInvalidMode.Block}
  adapter={{ type: "opencode", enabled: true, model: "big-pickle" }}
  showInfoButton={false}
  showSettingsButton={false}
  showInfoIntegration={false}
  showInfoCredits={false}
/>
```

## Response contract

The model must respond in JSON ONLY: an array of objects, one per active ticket, each shaped `{ "ticket-key": value }`. The value is validated against the ticket's schema (`responseSchema`) via Zod.

A custom parser can be provided via the `parser` prop; it takes precedence over automatic validation.

## `OneShotAiPanel` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | label | Header title |
| `systemPrompt` | `string` | — | Model role/rules |
| `files` | `AiPanelContextFile[]` | — | Files/URLs provided to the model |
| `tickets` | `AiPanelTicket[]` | — | Tickets with `responseSchema` required (top-level) |
| `actionLabel` | `string` | label | Generate button label |
| `language` | `AiPanelLanguage` | `Fr` | Interface language |
| `labels` | `Partial<AiPanelLabels>` | — | i18n override |
| `onPlug` | `(response, selectedKeys?) => void` | — | Response integration callback; receives the response and the keys checked in the review (all keys when omitted) |
| `adapter` | `AiAdapterConfig` | — | Provider config (type, enabled, model, apiKey, baseUrl) |
| `onSend` | `AiPanelSendHandler` | — | Custom send handler (takes precedence over the adapter) |
| `parser` | `AiPanelResponseParser` | — | Custom parser |
| `invalidMode` | `AiPanelInvalidMode` | `Warn` | `Warn` or `Block` (disables integration while invalid) |
| `showInfoIntegration` | `boolean` | `true` | Shows the "Code integration" block in the Info sheet |
| `showInfoCredits` | `boolean` | `true` | Shows the credits block in the Info sheet |
| `showInfoButton` | `boolean` | `true` | Shows the "Info" button |
| `showSettingsButton` | `boolean` | `true` | Shows the "Settings" button |

## Provider configuration

Three adapters provided (`adapters/`): `opencode` (local server, optional Bearer password, default `http://localhost:4096`), `shadcn` (@shadcn/helpers SDK), `fallback` (direct HTTP). `register()` lets you add custom providers.

## Internationalization

Every string goes through `AiPanelLabels` (French, English, Japanese, Simplified Chinese, Spanish, Arabic, defaults). Set the language via the `language` prop or the settings sheet; override individual strings via the `labels` prop:

```tsx
<OneShotAiPanel labels={{ generate: "Launch", plugLabel: "Insert" }} />
```

The Info sheet credit links are centralized in `project-links.ts` (`AI_PANEL_PROJECT_LINKS`), exported and editable.

## Exports

`OneShotAiPanel`, `StatusBar`, `PromptSection`, `FilesSection`, `TicketsSection`, `TicketItem`, `ResponseSection`, `FeedbackSection`, `InfoSheet`, `useAiPanel`, `useStreaming`, adapters, `PROVIDER_META`, `ProviderType`, `AiPanelJsonType`, `AiPanelInvalidMode`, `defaultLabels`, `translations`, `AI_PANEL_PROJECT_LINKS`.
