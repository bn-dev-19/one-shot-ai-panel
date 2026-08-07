import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  jsx: "automatic",
  external: [
    "react",
    "react-dom",
    "@opencode-ai/sdk",
    "openai",
    "lucide-react",
    "zod",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
    /^@base-ui\/react/,
  ],
  esbuildOptions(options) {
    options.alias = {
      "@/components/ui": "./src/primitives",
      "@/components/loading-button": "./src/primitives/loading-button",
      "@/lib/utils": "./src/primitives/lib/utils",
    }
  },
})
