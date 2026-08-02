"use client"

import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"

export function useSyncedState<T>(prop: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(prop)
  const [prevProp, setPrevProp] = useState<T>(prop)

  if (prop !== prevProp) {
    setPrevProp(prop)
    setState(prop)
  }

  return [state, setState]
}
