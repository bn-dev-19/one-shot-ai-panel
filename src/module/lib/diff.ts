export type DiffStatus = "identical" | "modified" | "added" | "removed"

export interface DiffChange {
  path: string
  kind: "added" | "removed" | "changed"
  old?: unknown
  new?: unknown
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b
  if (typeof a !== "object") return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => deepEqual(v, b[i]))
  }
  const aa = a as Record<string, unknown>
  const bb = b as Record<string, unknown>
  const keysA = Object.keys(aa)
  const keysB = Object.keys(bb)
  if (keysA.length !== keysB.length) return false
  return keysA.every((k) => deepEqual(aa[k], bb[k]))
}

function identityKey(value: unknown): string | null {
  if (!isPlainObject(value)) return null
  if (typeof value.slug === "string" && value.slug !== "") return "slug"
  if (typeof value.name === "string" && value.name !== "") return "name"
  return null
}

interface AlignedPair {
  old?: unknown
  new?: unknown
  path: string
}

function alignArrays(oldArr: unknown[], newArr: unknown[]): AlignedPair[] {
  const keyOf = (v: unknown): string | undefined => {
    const k = identityKey(v)
    if (!k) return undefined
    return String((v as Record<string, unknown>)[k])
  }
  const oldItems = oldArr.map((v, i) => ({ v, i, key: keyOf(v) }))
  const newItems = newArr.map((v, i) => ({ v, i, key: keyOf(v) }))
  const used = new Set<number>()
  const pairs: AlignedPair[] = []

  for (const ni of newItems) {
    if (ni.key !== undefined) {
      const match = oldItems.find((o) => o.key === ni.key && !used.has(o.i))
      if (match) {
        used.add(match.i)
        pairs.push({ old: match.v, new: ni.v, path: `[${ni.key}]` })
        continue
      }
    }
    pairs.push({ old: undefined, new: ni.v, path: `[${ni.i}]` })
  }

  for (const oi of oldItems) {
    if (used.has(oi.i)) continue
    pairs.push({ old: oi.v, new: undefined, path: `[${oi.key ?? oi.i}]` })
  }

  return pairs
}

export function diffJson(oldValue: unknown, newValue: unknown, path = "$"): DiffChange[] {
  if (deepEqual(oldValue, newValue)) return []

  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const changes: DiffChange[] = []
    for (const pair of alignArrays(oldValue, newValue)) {
      if (pair.old === undefined) {
        changes.push({ path: `${path}${pair.path}`, kind: "added", new: pair.new })
      } else if (pair.new === undefined) {
        changes.push({ path: `${path}${pair.path}`, kind: "removed", old: pair.old })
      } else {
        changes.push(...diffJson(pair.old, pair.new, `${path}${pair.path}`))
      }
    }
    return changes
  }

  if (isPlainObject(oldValue) && isPlainObject(newValue)) {
    const changes: DiffChange[] = []
    const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)])
    for (const key of keys) {
      const p = `${path}.${key}`
      if (!(key in newValue)) {
        changes.push({ path: p, kind: "removed", old: oldValue[key] })
      } else if (!(key in oldValue)) {
        changes.push({ path: p, kind: "added", new: newValue[key] })
      } else if (!deepEqual(oldValue[key], newValue[key])) {
        changes.push(...diffJson(oldValue[key], newValue[key], p))
      }
    }
    return changes
  }

  return [{ path, kind: "changed", old: oldValue, new: newValue }]
}

export function diffStatus(changes: DiffChange[]): DiffStatus {
  if (changes.length === 0) return "identical"
  if (changes.every((c) => c.kind === "added")) return "added"
  if (changes.every((c) => c.kind === "removed")) return "removed"
  return "modified"
}

export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === "string" && value.trim() === "") return true
  if (Array.isArray(value) && value.length === 0) return true
  if (isPlainObject(value) && Object.keys(value).length === 0) return true
  return false
}

export function formatValue(value: unknown, max = 120): string {
  if (value === undefined || value === null) return "null"
  if (typeof value === "string") return value === "" ? `""` : JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  const json = JSON.stringify(value)
  return json.length > max ? `${json.slice(0, max)}…` : json
}

export interface DiffLineCell {
  text: string
  status: "same" | "added" | "removed"
}

export interface DiffLineRow {
  left?: DiffLineCell
  right?: DiffLineCell
  leftNo?: number
  rightNo?: number
}

export function serializeValue(value: unknown): string {
  if (isEmptyValue(value)) return ""
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return JSON.stringify(value, null, 2)
}

const LCS_LIMIT = 1500

type DiffOp =
  | { kind: "same"; text: string }
  | { kind: "added"; text: string }
  | { kind: "removed"; text: string }

function computeOps(oldLines: string[], newLines: string[]): DiffOp[] {
  const n = oldLines.length
  const m = newLines.length
  if (n > LCS_LIMIT || m > LCS_LIMIT) {
    const ops: DiffOp[] = []
    const len = Math.max(n, m)
    for (let i = 0; i < len; i++) {
      const o = i < n ? oldLines[i] : undefined
      const no = i < m ? newLines[i] : undefined
      if (o === no) ops.push({ kind: "same", text: o as string })
      else if (o !== undefined && no !== undefined) {
        ops.push({ kind: "removed", text: o })
        ops.push({ kind: "added", text: no })
      } else if (o !== undefined) ops.push({ kind: "removed", text: o })
      else if (no !== undefined) ops.push({ kind: "added", text: no })
    }
    return ops
  }

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = oldLines[i] === newLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const ops: DiffOp[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (oldLines[i] === newLines[j]) {
      ops.push({ kind: "same", text: oldLines[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ kind: "removed", text: oldLines[i] })
      i++
    } else {
      ops.push({ kind: "added", text: newLines[j] })
      j++
    }
  }
  while (i < n) {
    ops.push({ kind: "removed", text: oldLines[i] })
    i++
  }
  while (j < m) {
    ops.push({ kind: "added", text: newLines[j] })
    j++
  }
  return ops
}

function buildRows(ops: DiffOp[]): DiffLineRow[] {
  const rows: DiffLineRow[] = []
  let i = 0
  while (i < ops.length) {
    const op = ops[i]
    if (op.kind === "same") {
      rows.push({
        left: { text: op.text, status: "same" },
        right: { text: op.text, status: "same" },
      })
      i++
      continue
    }
    if (op.kind === "added") {
      rows.push({ right: { text: op.text, status: "added" } })
      i++
      continue
    }
    const removedRun: string[] = []
    while (i < ops.length && ops[i].kind === "removed") {
      removedRun.push(ops[i].text)
      i++
    }
    const addedRun: string[] = []
    while (i < ops.length && ops[i].kind === "added") {
      addedRun.push(ops[i].text)
      i++
    }
    const paired = Math.min(removedRun.length, addedRun.length)
    for (let k = 0; k < paired; k++) {
      rows.push({
        left: { text: removedRun[k], status: "removed" },
        right: { text: addedRun[k], status: "added" },
      })
    }
    for (let k = paired; k < removedRun.length; k++) {
      rows.push({ left: { text: removedRun[k], status: "removed" } })
    }
    for (let k = paired; k < addedRun.length; k++) {
      rows.push({ right: { text: addedRun[k], status: "added" } })
    }
  }
  return rows
}

export function diffLines(oldValue: unknown, newValue: unknown): DiffLineRow[] {
  const oldText = serializeValue(oldValue)
  const newText = serializeValue(newValue)
  if (oldText === newText) {
    return oldText.split("\n").map((line, index) => ({
      left: { text: line, status: "same" as const },
      right: { text: line, status: "same" as const },
      leftNo: index + 1,
      rightNo: index + 1,
    }))
  }

  const oldLines = oldText === "" ? [] : oldText.split("\n")
  const newLines = newText === "" ? [] : newText.split("\n")
  const rows = buildRows(computeOps(oldLines, newLines))

  let leftNo = 0
  let rightNo = 0
  for (const row of rows) {
    if (row.left) {
      leftNo += 1
      row.leftNo = leftNo
    }
    if (row.right) {
      rightNo += 1
      row.rightNo = rightNo
    }
  }
  return rows
}
