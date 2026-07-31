#!/usr/bin/env node

import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative, resolve } from "node:path"
import { spawnSync } from "node:child_process"

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const MODULE_SRC = join(PACKAGE_ROOT, "src", "module")
const PRIMITIVES_SRC = join(PACKAGE_ROOT, "src", "primitives")
const THEME_SRC = join(PACKAGE_ROOT, "themes", "globals.css")

const REQUIRED_PRIMITIVES = [
  "badge.tsx",
  "button.tsx",
  "checkbox.tsx",
  "dialog.tsx",
  "empty.tsx",
  "input.tsx",
  "label.tsx",
  "select.tsx",
  "sheet.tsx",
  "switch.tsx",
  "textarea.tsx",
]

const RUNTIME_DEPS = [
  "@base-ui/react",
  "@opencode-ai/sdk",
  "class-variance-authority",
  "clsx",
  "lucide-react",
  "tailwind-merge",
  "zod",
  "tw-animate-css",
]

function log(icon, msg) {
  process.stdout.write(`${icon} ${msg}\n`)
}

function help() {
  process.stdout.write(
    `one-shot-ai-panel install — Integrates OneShotAiPanel into your React/Next.js project.

Usage:
  one-shot-ai-panel install [dir] [options]

Options:
  dir              Target project directory (default: current directory)
  --force          Overwrite existing files (module, primitives)
  --no-install     Do not install runtime dependencies
  --no-css         Do not modify the target project's globals.css
  --pm <pm>        Package manager: pnpm | npm | yarn | bun (default: auto-detected)
  --module-dir <d> Destination subdirectory for the module (default: src/external-modules/ai-panel)
  --help           Show this help
`
  )
}

function parseArgs(argv) {
  const args = { dir: process.cwd(), force: false, noInstall: false, noCss: false, pm: null, moduleDir: "src/external-modules/ai-panel" }
  const rest = [...argv]
  while (rest.length) {
    const a = rest.shift()
    if (a === "--help" || a === "-h") {
      args.help = true
    } else if (a === "--force") {
      args.force = true
    } else if (a === "--no-install") {
      args.noInstall = true
    } else if (a === "--no-css") {
      args.noCss = true
    } else if (a === "--pm") {
      args.pm = rest.shift()
    } else if (a === "--module-dir") {
      args.moduleDir = rest.shift()
    } else if (a.startsWith("-")) {
      process.stderr.write(`Unknown option: ${a}\n`)
      help()
      process.exit(1)
    } else {
      args.dir = resolve(a)
    }
  }
  return args
}

function detectPackageManager(target) {
  if (existsSync(join(target, "pnpm-lock.yaml"))) return "pnpm"
  if (existsSync(join(target, "bun.lockb")) || existsSync(join(target, "bun.lock"))) return "bun"
  if (existsSync(join(target, "yarn.lock"))) return "yarn"
  if (existsSync(join(target, "package-lock.json"))) return "npm"
  return "pnpm"
}

function findGlobalsCss(target) {
  const candidates = [
    join(target, "src", "app", "globals.css"),
    join(target, "app", "globals.css"),
    join(target, "src", "globals.css"),
    join(target, "globals.css"),
  ]
  return candidates.find((p) => existsSync(p))
}

function themeBlock() {
  if (!existsSync(THEME_SRC)) return ""
  const css = readFileSync(THEME_SRC, "utf8")
  const start = css.indexOf("@theme inline")
  const end = css.indexOf("@layer base")
  if (start === -1 || end === -1) return ""
  return css.slice(start, end).trimEnd() + "\n"
}

function patchGlobalsCss(target, force) {
  const globals = findGlobalsCss(target)
  if (!globals) {
    log("⚠️", `No globals.css found. Copy ${relative(target, THEME_SRC)} into your project or apply the theme manually.`)
    return
  }
  let css = readFileSync(globals, "utf8")
  const changed = []

  if (!css.includes("tw-animate-css")) {
    if (css.includes('@import "tailwindcss";')) {
      css = css.replace('@import "tailwindcss";', '@import "tailwindcss";\n@import "tw-animate-css";')
    } else if (css.startsWith("@import")) {
      css = css.replace(/^@import[^\n]*\n/, '@import "tw-animate-css";\n')
    } else {
      css = `@import "tw-animate-css";\n${css}`
    }
    changed.push("tw-animate-css import")
  }

  if (!css.includes("--background:")) {
    const block = themeBlock()
    if (block) {
      css = `${css.trimEnd()}\n\n${block}\n`
      changed.push("shadcn theme tokens")
    }
  }

  if (changed.length) {
    writeFileSync(globals, css)
    log("✓", `${relative(target, globals)}: added ${changed.join(", ")}`)
  } else {
    log("•", `${relative(target, globals)}: already compatible (tw-animate-css + theme tokens present)`)
  }
}

function copyFile(src, dest, force, root) {
  const display = root ? join("src", relative(join(root, "src"), dest)) : relative(process.cwd(), dest)
  if (existsSync(dest) && !force) {
    log("•", `skipped (already exists): ${display}`)
    return false
  }
  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest)
  log("✓", `created: ${display}`)
  return true
}

function installModule(target, force) {
  const dest = join(target, args.moduleDir)
  if (existsSync(dest)) {
    if (force) {
      cpSync(MODULE_SRC, dest, { recursive: true, force: true })
      log("✓", `${args.moduleDir}: reinstalled (--force)`)
    } else {
      log("•", `skipped (already exists): ${args.moduleDir} (use --force to reinstall)`)
    }
  } else {
    mkdirSync(dirname(dest), { recursive: true })
    cpSync(MODULE_SRC, dest, { recursive: true })
    log("✓", `module copied into ${args.moduleDir}`)
  }
}

function installPrimitives(target, force) {
  const uiDir = join(target, "src", "components", "ui")
  for (const file of REQUIRED_PRIMITIVES) {
    copyFile(join(PRIMITIVES_SRC, file), join(uiDir, file), force, target)
  }

  copyFile(join(PRIMITIVES_SRC, "loading-button.tsx"), join(target, "src", "components", "loading-button.tsx"), force, target)

  const utilsDest = join(target, "src", "lib", "utils.ts")
  if (existsSync(utilsDest)) {
    const utils = readFileSync(utilsDest, "utf8")
    if (utils.includes("export function cn") || utils.includes("export const cn")) {
      log("•", `src/lib/utils.ts: already present (cn found)`)
    } else {
      log("⚠️", `src/lib/utils.ts exists but does not export cn(). Add a cn() function (clsx + tailwind-merge).`)
    }
  } else {
    copyFile(join(PRIMITIVES_SRC, "lib", "utils.ts"), utilsDest, true, target)
  }
}

function installDeps(target, pm) {
  const runner = pm ?? detectPackageManager(target)
  const args = ["add", ...RUNTIME_DEPS]
  log("⇣", `installing dependencies (${runner} ${args.join(" ")})`)
  const res = spawnSync(runner, args, { cwd: target, stdio: "inherit", shell: process.platform === "win32" })
  if (res.status !== 0) {
    log("⚠️", "Dependency install failed. Run the install command above manually.")
    return false
  }
  return true
}

function printNextSteps(target) {
  log("", "")
  log("🚀", "Integration complete! Next steps:")
  log("", `  1. import:  import { OneShotAiPanel } from "@/external-modules/ai-panel"`)
  log("", `  2. Use it in a client component: <OneShotAiPanel systemPrompt=... tickets=... adapter={...} />`)
  log("", `  3. Make sure your globals.css imports 'tailwindcss' + 'tw-animate-css' and defines the shadcn theme tokens.`)
  log("", `  4. No existing shadcn setup? Use the theme template: copy the package's themes/globals.css as a base.`)
}

const args = parseArgs(process.argv.slice(2))

if (args.help) {
  help()
  process.exit(0)
}

const target = args.dir

if (!existsSync(join(target, "package.json"))) {
  process.stderr.write(`✗ No package.json found in ${target}\n`)
  process.exit(1)
}
if (!existsSync(join(target, "src"))) {
  process.stderr.write(`✗ No src/ directory found in ${target}. The panel requires a React/Next.js project with a src directory.\n`)
  process.exit(1)
}
if (!existsSync(MODULE_SRC) || !existsSync(PRIMITIVES_SRC)) {
  process.stderr.write(`✗ Module sources not found (corrupted package). Reinstall one-shot-ai-panel.\n`)
  process.exit(1)
}

log("", `Integrating OneShotAiPanel → ${target}`)
installModule(target, args.force)
installPrimitives(target, args.force)
if (!args.noCss) patchGlobalsCss(target, args.force)
if (!args.noInstall) installDeps(target, args.pm)
printNextSteps(target)
