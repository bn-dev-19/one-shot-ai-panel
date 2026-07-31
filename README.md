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

Three ways to add the panel to your project. The package is distributed **via GitHub** (npm publication is planned but not available yet):

| Mode | How | Result |
| --- | --- | --- |
| **GitHub dependency** | `pnpm add github:bn-dev-19/one-shot-ai-panel` | ESM bundle + types in `node_modules`. |
| **CLI installer** | `pnpm exec one-shot-ai-panel install` (or from a clone: `node scripts/install.mjs`) | Copies the module source + primitives into your project (you own the code). |
| **Source copy** | `git clone` then copy `src/module` | shadcn philosophy: the code lives in your repository. |

### 1. GitHub dependency (compiled package)

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel
# or: npm install github:bn-dev-19/one-shot-ai-panel / yarn add / bun add
# pin a release: pnpm add github:bn-dev-19/one-shot-ai-panel#v1.0.3
```

`dist/` is committed to the repository, so no build step runs on your machine — every package manager works out of the box.

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
# Option A — via the GitHub dependency's bin
pnpm add github:bn-dev-19/one-shot-ai-panel
pnpm exec one-shot-ai-panel install

# Option B — directly from a clone (zero-dependency script, no install needed)
git clone https://github.com/bn-dev-19/one-shot-ai-panel.git
node one-shot-ai-panel/scripts/install.mjs /path/to/your-project
```

The installer:

1. copies the module into `src/external-modules/ai-panel`;
2. copies the required primitives into `src/components/ui/` + `src/components/loading-button.tsx` + `src/lib/utils.ts` (when missing);
3. patches your `globals.css` (`tw-animate-css` import + theme tokens if missing);
4. installs the runtime dependencies with your package manager (pnpm/npm/yarn/bun, auto-detected).

```bash
# options
one-shot-ai-panel install --force        # overwrite existing files
one-shot-ai-panel install --no-install   # skip dependency install
one-shot-ai-panel install --no-css       # do not modify globals.css
one-shot-ai-panel install --pm npm       # force the package manager
```

### 3. Source copy (git clone)

```bash
git clone <repo> one-shot-ai-panel && cd one-shot-ai-panel
cp -R src/module <your-project>/src/external-modules/ai-panel
```

Then install the primitives listed in [`primitives.json`](./primitives.json) into your project (via `npx shadcn@latest add` or by copying them from `src/primitives`), create `src/lib/utils.ts` (`cn()`) and install the runtime dependencies.

---

## Integration by project type

| Project | Fastest path |
| --- | --- |
| **Next.js without shadcn** | CLI installer (copies module + primitives + theme) |
| **Next.js with shadcn** | GitHub dependency + one `@source` line |
| **Vite + React with shadcn** | GitHub dependency + one `@source` line |
| **Vite + React without shadcn** | CLI installer + 3 guided steps (Tailwind, `@` alias, tsconfig paths) |

### Next.js without shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v1.0.3
pnpm exec one-shot-ai-panel install
```

The CLI copies the module + primitives + `cn()`, patches `globals.css` (`tw-animate-css` + theme tokens) and installs the dependencies. Next.js already maps `@/*` → `src/*`, so it compiles as-is.

### Next.js with shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v1.0.3
```

Theme, primitives and dependencies are already present — only add an `@source` directive to `globals.css`:

```css
@source "../node_modules/one-shot-ai-panel/dist/index.js";
```

(The CLI installer also works here: it only adds the primitives that are missing, nothing is overwritten.)

### Vite + React with shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v1.0.3
```

The `@` alias is already configured (required by shadcn + Vite). Add `@source` to `src/index.css`:

```css
@source "../../node_modules/one-shot-ai-panel/dist/index.js";
```

### Vite + React without shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v1.0.3
pnpm exec one-shot-ai-panel install
```

The CLI copies everything and **prints the steps below as warnings** — apply them, then compile:

1. **Tailwind v4** — `pnpm add tailwindcss @tailwindcss/vite`, register `tailwindcss()` in `vite.config.ts`, and add `@import "tailwindcss";` at the top of `src/index.css` (the CLI already added `tw-animate-css` + the theme tokens).
2. **`@` alias** in `vite.config.ts` (add `@types/node` to devDependencies):
   ```ts
   import { fileURLToPath, URL } from "node:url"
   // resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } }
   ```
3. **Path alias** in `tsconfig.json` (editor + typecheck): `"paths": { "@/*": ["./src/*"] }` with `"baseUrl": "."`.

> Strict TS configs (`noUnusedLocals`/`noUnusedParameters`, as in Vite templates) are supported by the panel source.

### radix vs base-ui (shadcn base)

The panel module is built against **base-ui** primitives (`@base-ui/react`): `render`, `forceRender`, `Dialog.Popup`, … It cannot be swapped to radix without rewriting the module.

| Your project | Recommended mode |
| --- | --- |
| **Existing shadcn project with radix components** | **Compiled (GitHub dependency).** The `dist` bundles the panel's own base-ui primitives internally — your `src/components/ui/*` is never touched. |
| **Fresh project, no shadcn yet** | **CLI installer / source copy.** The panel installs its base-ui primitives into `src/components/ui/`. |
| **Fresh project where you also want radix components** | Either mode. In source mode, only add radix components whose names **don't collide** with the panel primitives: `button`, `dialog`, `select`, `sheet`, `switch`, `checkbox`, `badge`, `input`, `label`, `textarea`, `empty` (+ `loading-button`). Re-adding a colliding name overwrites the base-ui version and breaks the panel. |

> **Rule of thumb: a project with existing radix/shadcn components → use the compiled package.** Never run `one-shot-ai-panel install --force` over an existing radix `src/components/ui/*`: it overwrites shared files (`button.tsx`, `dialog.tsx`, …) with base-ui versions and breaks every radix consumer of those files (`asChild` ≠ `render`).

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

---

## Roadmap

- [ ] **Self-contained source mode** — make `one-shot-ai-panel install` vendor the primitives *inside* `src/external-modules/ai-panel/primitives/` and rewrite the module's `@/components/ui/*` imports to relative paths. The source mode would then never touch the host's `src/components/ui/*`, so it becomes safe for existing radix projects too (no overwrite, no collision). Scope: installer rewrite map (11 `ui/*` + `loading-button` + `cn` in the primitives), `--force` reduced to the module dir, migration note for existing source-mode installs.
