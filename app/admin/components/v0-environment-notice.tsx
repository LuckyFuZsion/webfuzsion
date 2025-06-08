"use client"

import { useEffect, useState } from "react"

export function V0EnvironmentNotice() {
  const [isV0, setIsV0] = useState(false)

  useEffect(() => {
    // Better heuristic to detect v0 environment
    const isV0Environment =
      window.location.hostname.includes("v0.dev") ||
      document.referrer.includes("v0.dev") ||
      navigator.userAgent.includes("Vercel") ||
      // Additional check for v0 preview
      window.location.href.includes("vercel.app")

    setIsV0(isV0Environment)
  }, [])

  if (!isV0) return null

  return (
    <div className="bg-amber-500/20 border border-amber-500/50 text-amber-800 dark:text-amber-200 p-3 rounded-lg mb-4 text-sm">
      <strong>v0 Environment Detected:</strong> You are viewing this admin area in the v0 preview environment.
      Authentication has been bypassed for testing purposes. In production, proper authentication will be required.
    </div>
  )
}
