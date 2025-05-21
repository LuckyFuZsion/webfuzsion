"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  // Default to non-mobile to ensure content renders initially
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)
  // Add a flag for enabling animations on mobile
  const [enableMobileAnimations, setEnableMobileAnimations] = useState(true)
  // Add a preloaded state
  const [isPreloaded, setIsPreloaded] = useState(false)

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true)

    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Mark as preloaded after a short delay
    setTimeout(() => {
      setIsPreloaded(true)
    }, 100)

    // Listen for resize events
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Function to fully enable all animations
  const enableAllAnimations = () => {
    setEnableMobileAnimations(true)
  }

  return { isMobile, isClient, enableMobileAnimations, enableAllAnimations, isPreloaded }
}
