# OneShotAiPanel

A **reusable AI assistant panel** for React/Next.js + shadcn/ui: schema-validated JSON generation, real-time streaming (reasoning + response), a side-by-side diff review (existing vs. proposed content), and **selective** integration into your project.

```txt
┌────────────────────────────────────────────────────────────┐
│  OneShot AiPanel                                            │
│  ─ Language-model-driven generation                         │
│  ─ Tickets → JSON responses validated against schemas (Zod) │
│  ─ Streaming (reasoning + text), indented JSON output       │
│  ─ Change review (Identical / Modified / New / Removed)     │
│  ─ "Diffs" button: side-by-side dialog with numbered lines  │
│  ─ onPlug(response, selectedKeys?) → selective integration  │
└────────────────────────────────────────────────────────────┘
```

---

## Integration modes

Three ways to add the panel to your project:

| Mode | Command | Result |
| --- | --- | --- |
| **Compiled package** | `pnpm add one-shot-ai-panel` | ESM bundle + types in `node_modules`. |
| **CLI installer** | `npx one-shot-ai-panel install` | Copies the module source + primitives into your project (you own the code). |
| **Source copy** | `git clone` then copy `src/module` | shadcn philosophy: the code lives in your repository. |

### 1. Compiled package

```bash
pnpm add one-shot-ai-panel
# or: npm install one-shot-ai-panel / yarn add / bun add
```

Host project prerequisites:

- React **>= 18** (Next.js App Router recommended), Tailwind CSS **v4**
- A shadcn/ui theme (CSS tokens). No existing setup? Replace your `globals.css` with [`one-shot-ai-panel/theme.css`](./themes/globals.css) (zinc tokens, light + dark, includes `tw-animate-css`)
- Make Tailwind scan the package — in your `globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@source "../node_modules/one-shot-ai-panel/dist/index.js";
```

> Peer dependencies (`react`, `react-dom`, `@base-ui/react`, `@opencode-ai/sdk`, `lucide-react`, `zod`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`) are installed automatically by your package manager.

### 2. CLI installer (source into your project)

```bash
# from your Next.js project directory
npx one-shot-ai-panel install
# or: pnpm dlx one-shot-ai-panel install
```

The installer:

1. copies the module into `src/external-modules/ai-panel`;
2. copies the required primitives into `src/components/ui/` + `src/components/loading-button.tsx` + `src/lib/utils.ts` (when missing);
3. patches your `globals.css` (`tw-animate-css` import + theme tokens if missing);
4. installs the runtime dependencies with your package manager (pnpm/npm/yarn/bun, auto-detected).

```bash
# options
npx one-shot-ai-panel install --force        # overwrite existing files
npx one-shot-ai-panel install --no-install   # skip dependency install
npx one-shot-ai-panel install --no-css       # do not modify globals.css
npx one-shot-ai-panel install --pm npm       # force the package manager
```

### 3. Source copy (git clone)

```bash
git clone <repo> one-shot-ai-panel && cd one-shot-ai-panel
cp -R src/module <your-project>/src/external-modules/ai-panel
```

Then install the primitives listed in [`primitives.json`](./primitives.json) into your project (via `npx shadcn@latest add` or by copying them from `src/primitives`), create `src/lib/utils.ts` (`cn()`) and install the runtime dependencies.

---

## Usage

```tsx
"use client"

import {
  OneShotAiPanel,
  AiPanelJsonType,
  AiPanelLanguage,
  AiPanelInvalidMode,
} from "one-shot-ai-panel" // or "@/external-modules/ai-panel" in source mode

export default function Page() {
  return (
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
          responseSchema: {
            type: AiPanelJsonType.Object,
            properties: { id: { type: AiPanelJsonType.String } },
          },
        },
      ]}
      onPlug={(response, selectedKeys) => {
        console.log("validated response", response.parsed)
        console.log("integrated tickets", selectedKeys) // all keys when omitted
      }}
    />
  )
}
```

### Headless hook (without the UI)

```tsx
import { useAiPanel, buildSend } from "one-shot-ai-panel"

const { status, response, streamingText, streamingReasoning, send, cancel, reset } = useAiPanel({
  sendHandler: buildSend({ type: "opencode", model: "big-pickle" }),
  files,
  tickets,
  parser, // optional
  labels,
})
```

---

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
| `onPlug` | `(response, selectedKeys?) => void` | — | Integration callback; receives the response and the keys checked in the review (all keys when omitted) |
| `adapter` | `AiAdapterConfig` | — | Provider config (type, enabled, model, apiKey, baseUrl) |
| `onSend` | `AiPanelSendHandler` | — | Custom send handler (takes precedence over the adapter) |
| `parser` | `AiPanelResponseParser` | — | Custom parser (takes precedence over automatic validation) |
| `invalidMode` | `AiPanelInvalidMode` | `Warn` | `Warn` or `Block` (disables integration while invalid) |
| `showInfoIntegration` | `boolean` | `true` | Shows the "Code integration" block in the Info sheet |
| `showInfoCredits` | `boolean` | `true` | Shows the credits block in the Info sheet |
| `showInfoButton` | `boolean` | `true` | Shows the "Info" button |
| `showSettingsButton` | `boolean` | `true` | Shows the "Settings" button |

---

## Response contract

The model must respond **in JSON ONLY**: an array of objects, one per active ticket, each shaped `{ "ticket-key": value }`. The value is validated against the ticket's `responseSchema` using **Zod**.

A custom parser can be provided via the `parser` prop; it takes precedence over automatic validation.

The displayed response is automatically reformatted as indented JSON (2 spaces). Streaming renders the reasoning and the response in real time.

---

## Change review

Before integration, the panel compares each ticket against the existing content (`existingContent`):

- status **Identical / Modified / New / Removed**;
- change list (additions, removals, edits) with the affected path;
- **Diffs** button: side-by-side "Existing / Proposed" dialog, numbered lines, additions in green, removals in red;
- tickets checked by default (unknown keys are shown but not checked);
- **Plug selection (n)** only applies the checked tickets → `onPlug(response, selectedKeys)`.

---

## Adapters

Three adapters are provided: `opencode` (local server, default `http://localhost:4096`), `shadcn` (@shadcn/helpers SDK), `fallback` (direct HTTP). `register()` lets you add custom providers.

---

## Internationalization

Every string goes through `AiPanelLabels` (French, English, defaults). Override via the `labels` prop:

```tsx
<OneShotAiPanel labels={{ generate: "Launch", plugLabel: "Insert" }} />
```

The Info sheet credit links are centralized in `project-links.ts` (`AI_PANEL_PROJECT_LINKS`), exported and editable.

---

## Developing the package

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # tsup → dist/index.js + dist/index.d.ts
pnpm pack        # npm tarball
```

Repository structure:

```
src/
  index.ts              → package entry (re-exports src/module)
  module/               → the OneShotAiPanel module (source, "@/" imports)
  primitives/           → vendored primitives (ui/* + loading-button + cn)
scripts/install.mjs     → "one-shot-ai-panel install" CLI (zero-dependency)
themes/globals.css      → theme template (zinc, light/dark)
primitives.json         → manifest of required primitives and dependencies
```

The module source keeps its `@/` imports: the bundler (tsup) resolves them to `src/primitives`, while the CLI installer leaves them as-is in the host project (which receives the primitives in `src/components/ui/`).

---

## Exports

`OneShotAiPanel`, `StatusBar`, `PromptSection`, `FilesSection`, `TicketsSection`, `TicketItem`, `ResponseSection`, `FeedbackSection`, `InfoSheet`, `useAiPanel`, `useStreaming`, adapters, `PROVIDER_META`, `ProviderType`, `AiPanelJsonType`, `AiPanelInvalidMode`, `defaultLabels`, `translations`, `AI_PANEL_PROJECT_LINKS`.
