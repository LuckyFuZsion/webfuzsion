"use client"

import { useMobile } from "@/hooks/use-mobile"

export default function TestMobile() {
  const { isMobile, isPreloaded } = useMobile()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mobile Detection Test</h1>
      <p>Is Mobile: {isMobile ? "Yes" : "No"}</p>
      <p>Is Preloaded: {isPreloaded ? "Yes" : "No"}</p>
      <p>Screen Width: {typeof window !== "undefined" ? window.innerWidth : "Unknown"}</p>
    </div>
  )
}
