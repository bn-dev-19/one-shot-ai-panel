import { useState, useRef, useCallback } from "react"
import type {
  AiPanelPendingPermission,
  AiPanelPendingQuestion,
  AiPanelToolActivity,
} from "../types"

export interface StreamHandlers {
  onComplete?: (text: string) => void
  onError?: (error: unknown) => void
  onQuestion?: (q: AiPanelPendingQuestion) => void
  onPermission?: (p: AiPanelPendingPermission) => void
  onTool?: (t: AiPanelToolActivity) => void
}

export interface UseStreamingReturn {
  text: string
  reasoning: string
  isStreaming: boolean
  start: (stream: ReadableStream<Uint8Array>, handlers?: StreamHandlers) => void
  cancel: () => void
  reset: () => void
}

interface StreamFrame {
  t: "text" | "reasoning" | "question" | "permission" | "tool"
  d: string | AiPanelPendingQuestion | AiPanelPendingPermission | AiPanelToolActivity
  snapshot?: boolean
}

function parseFrame(line: string): StreamFrame | null {
  const trimmed = line.endsWith("\n") ? line.slice(0, -1) : line
  if (!trimmed.startsWith("{")) return null
  try {
    const obj = JSON.parse(trimmed) as StreamFrame | null
    if (!obj || typeof obj !== "object" || typeof obj.t !== "string" || !("d" in obj)) return null
    if (obj.t === "text" || obj.t === "reasoning") {
      if (typeof obj.d === "string") return obj as StreamFrame
    } else if (obj.t === "question" || obj.t === "permission" || obj.t === "tool") {
      if (obj.d && typeof obj.d === "object") return obj as StreamFrame
    }
  } catch {
    // not a frame
  }
  return null
}

export function useStreaming(): UseStreamingReturn {
  const [text, setText] = useState("")
  const [reasoning, setReasoning] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const start = useCallback(async (
    stream: ReadableStream<Uint8Array>,
    handlers?: StreamHandlers,
  ) => {
    const abort = new AbortController()
    abortRef.current = abort
    setIsStreaming(true)
    setText("")
    setReasoning("")

    const decoder = new TextDecoder()
    let buffer = ""
    let fullText = ""

    const appendText = (s: string) => {
      fullText += s
      setText((prev) => prev + s)
    }

    const setTextSnapshot = (s: string) => {
      fullText = s
      setText(s)
    }

    const applyFrame = (frame: StreamFrame) => {
      if (frame.t === "reasoning") {
        if (frame.snapshot) setReasoning(frame.d as string)
        else setReasoning((prev) => prev + (frame.d as string))
      } else if (frame.t === "text") {
        if (frame.snapshot) setTextSnapshot(frame.d as string)
        else appendText(frame.d as string)
      } else if (frame.t === "question") {
        handlers?.onQuestion?.(frame.d as AiPanelPendingQuestion)
      } else if (frame.t === "permission") {
        handlers?.onPermission?.(frame.d as AiPanelPendingPermission)
      } else if (frame.t === "tool") {
        handlers?.onTool?.(frame.d as AiPanelToolActivity)
      }
    }

    try {
      const reader = stream.getReader()

      while (true) {
        if (abort.signal.aborted) {
          reader.cancel()
          break
        }

        const { done, value } = await reader.read()

        if (done) {
          buffer += decoder.decode()
          break
        }

        buffer += decoder.decode(value, { stream: true })

        let nlIndex: number
        while ((nlIndex = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nlIndex + 1)
          buffer = buffer.slice(nlIndex + 1)
          const frame = parseFrame(line)
          if (frame) {
            applyFrame(frame)
          } else {
            appendText(line)
          }
        }
      }

      if (buffer) {
        const frame = parseFrame(buffer)
        if (frame) {
          applyFrame(frame)
        } else {
          appendText(buffer)
        }
      }

      setIsStreaming(false)
      if (!abort.signal.aborted) {
        handlers?.onComplete?.(fullText)
      }
    } catch (err) {
      setIsStreaming(false)
      if (abort.signal.aborted) return
      handlers?.onError?.(err)
    }
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setText("")
    setReasoning("")
    setIsStreaming(false)
  }, [])

  return { text, reasoning, isStreaming, start, cancel, reset }
}
