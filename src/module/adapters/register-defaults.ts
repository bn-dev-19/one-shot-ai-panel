import { register } from "./registry"
import { OpenCodeAdapter } from "./opencode"
import { ZenAdapter } from "./zen"
import { ProviderType } from "./types"

let registered = false

export function registerDefaultAdapters() {
  if (registered) return
  registered = true

  register(ProviderType.Opencode, OpenCodeAdapter)
  register(ProviderType.Zen, ZenAdapter)
}
