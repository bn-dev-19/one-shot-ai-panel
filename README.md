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

Four ways to add the panel to your project. The package is distributed **via GitHub** (npm publication is planned but not available yet):

| Mode | How | Result |
| --- | --- | --- |
| **GitHub dependency** | `pnpm add github:bn-dev-19/one-shot-ai-panel` | ESM bundle + types in `node_modules`. |
| **shadcn registry** | `npx shadcn@latest add bn-dev-19/one-shot-ai-panel/<item>` | The panel's primitives via the official shadcn CLI (skip/overwrite prompts, deps installed for you). |
| **CLI installer** | `pnpm exec one-shot-ai-panel install` (or from a clone: `node scripts/install.mjs`) | Copies the module source + primitives into your project (you own the code). Auto-detects `components.json` → uses `shadcn add`. |
| **Source copy** | `git clone` then copy `src/module` | shadcn philosophy: the code lives in your repository. |

### 0. shadcn registry (the panel primitives via `shadcn add`)

The panel primitives are published as a **GitHub source registry** (root `registry.json`, the repository is public). In any shadcn project:

```bash
# all 12 items in one command
npx shadcn@latest add bn-dev-19/one-shot-ai-panel/button bn-dev-19/one-shot-ai-panel/badge bn-dev-19/one-shot-ai-panel/checkbox bn-dev-19/one-shot-ai-panel/dialog bn-dev-19/one-shot-ai-panel/empty bn-dev-19/one-shot-ai-panel/input bn-dev-19/one-shot-ai-panel/label bn-dev-19/one-shot-ai-panel/loading-button bn-dev-19/one-shot-ai-panel/select bn-dev-19/one-shot-ai-panel/sheet bn-dev-19/one-shot-ai-panel/switch bn-dev-19/one-shot-ai-panel/textarea

# or a single primitive
npx shadcn@latest add bn-dev-19/one-shot-ai-panel/button
```

`shadcn add` gives you the native **skip/overwrite** prompts when a file already exists, and installs `@base-ui/react`, `class-variance-authority`, `lucide-react`, … automatically. `dialog`, `sheet` and `loading-button` pull in `button` via `registryDependencies`. Only works in a project with a `components.json` — and note the base-ui collision rule below (same names as the official radix items).

### 1. GitHub dependency (compiled package)

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel
# or: npm install github:bn-dev-19/one-shot-ai-panel / yarn add / bun add
# pin a release: pnpm add github:bn-dev-19/one-shot-ai-panel#v2.1.0
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
2. adds the required primitives — if the project has a `components.json`, via `shadcn add bn-dev-19/one-shot-ai-panel/<item>` (native skip/overwrite prompts, automatic deps), otherwise by direct copy into `src/components/ui/` + `src/components/loading-button.tsx` + `src/lib/utils.ts` (when missing);
3. patches your `globals.css` (`tw-animate-css` import + theme tokens if missing);
4. installs the runtime dependencies with your package manager (pnpm/npm/yarn/bun, auto-detected).

```bash
# options
one-shot-ai-panel install --force        # overwrite existing files
one-shot-ai-panel install --no-install   # skip dependency install
one-shot-ai-panel install --no-css       # do not modify globals.css
one-shot-ai-panel install --no-registry  # always copy primitives, even with components.json
one-shot-ai-panel install --pm npm       # force the package manager
one-shot-ai-panel install --force --module-only  # update ONLY the module source (keeps ui/*, css, deps untouched)
one-shot-ai-panel install --proxy-only   # compiled mode: generate ONLY the Zen proxy re-export
one-shot-ai-panel install --no-proxy     # do not generate the Zen same-origin proxy (Next route / Vite snippet)
```

> **Source-mode updates:** if `src/external-modules/ai-panel` already exists, the installer **automatically switches to module-only mode** (it never re-runs `shadcn add` over an existing install, so your customized `src/components/ui/*` are never overwritten). To pull the latest module, run `pnpm exec one-shot-ai-panel install --force` — or pass `--module-only` explicitly. This mirrors the source-mode philosophy: the panel code lives in your repository, and updates only refresh the module.

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
| **Next.js with shadcn** | GitHub dependency + one `@source` line, **or** CLI installer (auto `shadcn add`) |
| **Vite + React with shadcn** | GitHub dependency + one `@source` line, **or** CLI installer (auto `shadcn add`) |
| **Vite + React without shadcn** | CLI installer + 3 guided steps (Tailwind, `@` alias, tsconfig paths) |

### Next.js without shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v2.1.0
pnpm exec one-shot-ai-panel install
```

The CLI copies the module + primitives + `cn()`, patches `globals.css` (`tw-animate-css` + theme tokens) and installs the dependencies. Next.js already maps `@/*` → `src/*`, so it compiles as-is.

### Next.js with shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v2.1.0
```

Theme, primitives and dependencies are already present — only add an `@source` directive to `globals.css`:

```css
@source "../node_modules/one-shot-ai-panel/dist/index.js";
```

> **Compiled mode and the OpenCode Zen proxy:** in dependency mode the CLI installer never runs, so the Zen same-origin proxy is **not** generated for you. The proxy ships **in the package dist** as `one-shot-ai-panel/zen-proxy` — create `app/api/zen/v1/[...path]/route.ts` containing only:
>
> ```ts
> export { GET, POST, PUT, PATCH, DELETE, OPTIONS } from "one-shot-ai-panel/zen-proxy"
> ```
>
> That single line re-exports the versioned relay, so it stays in sync with the installed package (no copying). Or run `pnpm exec one-shot-ai-panel install --proxy-only` to generate that file. See [OpenCode Zen and the same-origin proxy](#opencode-zen-and-the-same-origin-proxy).

Prefer source mode instead (you own the code)? The CLI installer detects `components.json` and adds the panel primitives via `shadcn add` — it never touches your existing components unless you choose to overwrite:

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v2.1.0
pnpm exec one-shot-ai-panel install
```

### Vite + React with shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v2.1.0
```

The `@` alias is already configured (required by shadcn + Vite). Add `@source` to `src/index.css`:

```css
@source "../../node_modules/one-shot-ai-panel/dist/index.js";
```

> **Compiled mode and the OpenCode Zen proxy:** in dependency mode the Zen same-origin proxy is **not** generated for you. For Vite, wire the package's `vite.zen-proxy.mjs` snippet into `server.proxy`, or run `pnpm exec one-shot-ai-panel install --proxy-only` once. See [OpenCode Zen and the same-origin proxy](#opencode-zen-and-the-same-origin-proxy).

### Vite + React without shadcn

```bash
pnpm add github:bn-dev-19/one-shot-ai-panel#v2.1.0
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
| **Fresh project, no shadcn yet** | **CLI installer / shadcn registry.** The panel installs its base-ui primitives into `src/components/ui/` (`npx shadcn@latest add bn-dev-19/one-shot-ai-panel/<item>` or `one-shot-ai-panel install` which runs it automatically). |
| **Fresh project where you also want radix components** | Either mode. In source mode, only add radix components whose names **don't collide** with the panel primitives: `button`, `dialog`, `select`, `sheet`, `switch`, `checkbox`, `badge`, `input`, `label`, `textarea`, `empty` (+ `loading-button`). Re-adding a colliding name overwrites the base-ui version and breaks the panel. |

> **Rule of thumb: a project with existing radix/shadcn components → use the compiled package.** Never run `one-shot-ai-panel install --force` over an existing radix `src/components/ui/*`: it overwrites shared files (`button.tsx`, `dialog.tsx`, …) with base-ui versions and breaks every radix consumer of those files (`asChild` ≠ `render`).

#### Nested dialogs & portals

The panel's internal overlays — Info sheet, Settings sheet, full-prompt preview, diff dialog, question/permission dialogs, selects/popovers — are **base-ui dialogs portaled to `document.body`**. They are designed to nest inside another base-ui dialog (base-ui detects nesting via `DialogRootContext` and handles inert/backdrop/stacking itself).

**Do NOT render the panel inside a radix `modal` dialog.** A radix modal sets `pointer-events: none` on everything outside its own content (+ `aria-hidden`, focus trap, and a document-level Escape handler). The base-ui portals land in `document.body` but outside the radix content, so they inherit `pointer-events: none`: the sheets/dialogs stay **visible but inert** — scroll/selection/clicks pass through to the panel behind, and Escape closes both layers.

Use one of these instead:

- **Preferred: a base-ui outer container** (e.g. a `Sheet`/`Dialog` built on `@base-ui/react/dialog`). base-ui nests cleanly in base-ui.
- **With a radix Sheet/Dialog:** render it **non-modal** (`modal={false}`) and tell it to ignore the base-ui portals:

```tsx
<Sheet modal={false}>
  <SheetContent
    onInteractOutside={(event) => {
      if (event.target instanceof Element && event.target.closest("[data-base-ui-portal]")) {
        event.preventDefault()
      }
    }}
    onEscapeKeyDown={(event) => {
      if (document.querySelector("[data-base-ui-portal]")) event.preventDefault()
    }}
  >
    <OneShotAiPanel ... />
  </SheetContent>
</Sheet>
```

> Note: with `modal={false}` the radix overlay (dim) is not rendered and the page behind stays scrollable — acceptable for a side panel.

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
| `adapter` | `AiAdapterConfig` | `DEFAULT_CONFIGS[opencode]` | Provider config (type, enabled, model, apiKey, baseUrl). When omitted, the Opencode default (enabled) is used |
| `onAdapterChange` | `(config: AiAdapterConfig) => void` | — | Fired on every Settings sheet change (persist it and feed it back via `adapter`) |
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

Each ticket is presented in the prompt with its **label and key** (e.g. `[Vérification des réponses] (Clé : verification)`), so the model knows exactly which key to use in its response.

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

Two adapters are provided: `opencode` (local server, default `http://localhost:4096`) and `zen` (OpenCode Zen gateway, same-origin proxy `/api/zen/v1`). `register()` lets you add custom providers.

### Default configuration

`DEFAULT_CONFIGS` (exported) is the per-provider baseline:

```ts
{
  opencode: { type: "opencode", enabled: true,  model: "big-pickle" },          // only one enabled by default
  zen:      { type: "zen",      enabled: false, model: "big-pickle", baseUrl: "/api/zen/v1" },
}
```

### OpenCode Zen and the same-origin proxy

Zen (`https://opencode.ai/zen/v1`) does **not** send CORS headers, so the browser blocks any direct call — no client SDK (this package's `openai` client or `@ai-sdk/openai-compatible`) can get around that. Zen must therefore be reached through a **same-origin** hop: the browser calls `/api/zen/v1/*`, your server relays it to `opencode.ai`.

The CLI installer handles this for you — zero code to write:

| Framework | What the installer generates |
| --- | --- |
| **Next.js (App Router)** | `app/api/zen/v1/[...path]/route.ts` — a self-contained relay (copied from the package's `src/next-proxy/zen.ts`, updated on every `install --force`) |
| **Vite / plain React** | `vite.zen-proxy.mjs` — a dev-server proxy snippet to wire into `server.proxy` (one line). Production still needs your backend to relay `/api/zen` and hold the API key. |

**In compiled/dependency mode** the installer never runs, so the proxy is **not** generated automatically. But the relay ships **in the package dist** under the export `one-shot-ai-panel/zen-proxy` — so you only need a one-line route that re-exports it (it always matches the installed package version):

```bash
# Next.js (App Router) — create this file:
#   app/api/zen/v1/[...path]/route.ts
export { GET, POST, PUT, PATCH, DELETE, OPTIONS } from "one-shot-ai-panel/zen-proxy"

# …or generate it for you (compiled mode, keeps your src untouched):
pnpm exec one-shot-ai-panel install --proxy-only
```

For Vite, `install --proxy-only` writes the `vite.zen-proxy.mjs` snippet to wire into `server.proxy`.

Skip it with `--no-proxy`. If you manage your own relay, just point the Zen `baseUrl` at it (same-origin or CORS-enabled).

> `baseUrl` may be relative (the default `/api/zen/v1`): the adapter resolves it against the page origin in the browser before handing it to the `openai` SDK (which requires an absolute URL).

The `opencode` `apiUrl` must be an absolute `http(s)://` URL (the local server). If a relative/garbage value is configured, the adapter falls back to `http://localhost:4096` instead of issuing a relative request.

The defaults are applied in three places:

1. **Panel mount** when no `adapter` prop is passed → `currentAdapter = DEFAULT_CONFIGS[opencode]`, so **Generate works out of the box** (v1.2.4+).
2. **Settings sheet form** initialization (`adapter ?? DEFAULT_CONFIGS[opencode]`).
3. **Switching provider** in the Settings sheet → the form resets to that provider's baseline.

### When the Settings sheet config takes effect

Every field change in the Settings sheet calls `onAdapterChange` immediately, which updates the panel's internal `currentAdapter` and rebuilds the send handler — **the next "Generate" click uses the new config**. Disabling the adapter (`enabled: false`) makes Generate inactive until re-enabled or a provider is chosen.

### Persistence

The sheet config lives in React state only. To persist it (localStorage, DB, …), pass `onAdapterChange` and feed the stored value back through the `adapter` prop (controlled pattern):

```tsx
const [adapter, setAdapter] = useState<AiAdapterConfig>()

<OneShotAiPanel
  adapter={adapter}
  onAdapterChange={(next) => {
    setAdapter(next)
    localStorage.setItem("ai-panel-adapter", JSON.stringify(next))
  }}
/>
```

`useSyncedState` re-syncs the panel whenever the `adapter` prop reference changes, so a persisted config is picked up on remount.

---

## Internationalization

Every string goes through `AiPanelLabels` (French, English, Japanese, Simplified Chinese, Spanish, Arabic, defaults). Set the language via the `language` prop or the settings sheet; override individual strings via the `labels` prop:

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

`OneShotAiPanel`, `StatusBar`, `PromptSection`, `FilesSection`, `TicketsSection`, `TicketItem`, `ResponseSection`, `FeedbackSection`, `InfoSheet`, `DiffDialog`, `QuestionDialog`, `PermissionDialog`, `useAiPanel`, `useStreaming`, adapters, `DEFAULT_CONFIGS`, `PROVIDER_META`, `ProviderType`, `AiPanelJsonType`, `AiPanelInvalidMode`, `defaultLabels`, `translations`, `AI_PANEL_PROJECT_LINKS`.

---

## Roadmap

- [x] **shadcn registry** — panel primitives published as a GitHub source registry (`registry.json`, repo is public): `npx shadcn@latest add bn-dev-19/one-shot-ai-panel/<item>`, auto-detected by the CLI installer (`components.json` present). Shipped in v1.1.0.
- [ ] **Self-contained source mode** — make `one-shot-ai-panel install` vendor the primitives *inside* `src/external-modules/ai-panel/primitives/` and rewrite the module's `@/components/ui/*` imports to relative paths. The source mode would then never touch the host's `src/components/ui/*`, so it becomes safe for existing radix projects too (no overwrite, no collision). Scope: installer rewrite map (11 `ui/*` + `loading-button` + `cn` in the primitives), `--force` reduced to the module dir, migration note for existing source-mode installs.
