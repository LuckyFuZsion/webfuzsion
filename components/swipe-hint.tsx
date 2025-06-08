"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Smartphone, RotateCcw } from "lucide-react"

export function SwipeHint() {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    // Check if we've shown the hint before
    const hintShown = localStorage.getItem("swipeHintShown")

    if (!hintShown) {
      setShowHint(true)

      // Hide hint after 5 seconds
      const timer = setTimeout(() => {
        setShowHint(false)
        localStorage.setItem("swipeHintShown", "true")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!showHint) return null

  return (
    <div className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center text-white p-4 rounded-xl">
      <div className="flex items-center mb-6">
        <ChevronLeft className="h-6 w-6 animate-pulse" />
        <Smartphone className="h-8 w-8 mx-2" />
        <ChevronRight className="h-6 w-6 animate-pulse" />
      </div>
      <p className="text-center mb-4 font-medium">Swipe left or right to browse projects</p>

      <div className="flex items-center mb-6 mt-4">
        <RotateCcw className="h-6 w-6 animate-spin-slow mx-2" />
        <Smartphone className="h-8 w-8 mx-2" />
      </div>
      <p className="text-center font-medium">Tap to flip cards and see details</p>
    </div>
  )
}
