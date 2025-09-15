"use client"

import { useEffect, useRef } from "react"

/**
 * A hook that ensures an effect runs only once, even in React's Strict Mode.
 * This is useful for initialization logic that should only run once.
 * 
 * @param effect The effect to run once
 * @param deps The dependencies array for the effect
 */
export function useOnce(effect: () => void | (() => void), deps: any[] = []) {
  const hasRun = useRef(false)
  const prevDeps = useRef(deps)

  useEffect(() => {
    console.log("hasRun", hasRun.current)
    console.log("prevDeps", prevDeps.current)
    console.log("deps", deps)
    if (!hasRun.current || !depsEqual(prevDeps.current, deps)) {
      hasRun.current = true
      prevDeps.current = deps
      return effect()
    }
  }, deps)
}

// Helper to compare dependency arrays
function depsEqual(prevDeps: any[], nextDeps: any[]): boolean {
  if (prevDeps.length !== nextDeps.length) return false
  return prevDeps.every((dep, i) => dep === nextDeps[i])
}