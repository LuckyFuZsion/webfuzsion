"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function V0AdminHelper() {
  const [isV0, setIsV0] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if we're in v0 environment
    const isV0Environment =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("v0.dev") ||
        document.referrer.includes("v0.dev") ||
        navigator.userAgent.includes("Vercel") ||
        window.location.href.includes("vercel.app"))

    setIsV0(isV0Environment)
  }, [])

  if (!isV0 || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-brand-dark border border-brand-pink rounded-lg shadow-lg p-4 max-w-xs">
      <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
        ✕
      </button>
      <h3 className="text-brand-pink font-bold mb-2">v0 Admin Access</h3>
      <p className="text-white text-sm mb-3">Having trouble accessing the admin area? Use these special v0 links:</p>
      <div className="space-y-2">
        <Link
          href="/v0-admin"
          className="block text-sm bg-brand-pink/20 hover:bg-brand-pink/30 text-white p-2 rounded text-center"
        >
          Direct Admin Access
        </Link>
        <Link
          href="/admin?v0_bypass=true"
          className="block text-sm bg-brand-pink/20 hover:bg-brand-pink/30 text-white p-2 rounded text-center"
        >
          Admin with Bypass
        </Link>
      </div>
    </div>
  )
}
