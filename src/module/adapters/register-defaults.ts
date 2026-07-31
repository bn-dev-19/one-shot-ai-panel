import { register } from "./registry"
import { FallbackAdapter } from "./fallback"
import { ShadcnAdapter } from "./shadcn"
import { OpenCodeAdapter } from "./opencode"
import { ProviderType } from "./types"

let registered = false

export function registerDefaultAdapters() {
  if (registered) return
  registered = true

  register(ProviderType.Opencode, OpenCodeAdapter)
  register(ProviderType.Fallback, FallbackAdapter)
  register(ProviderType.Shadcn, ShadcnAdapter)
}
