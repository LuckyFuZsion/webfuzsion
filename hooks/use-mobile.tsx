"use client"

import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useMobile() {
  // Initialize with undefined to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [isPreloaded, setIsPreloaded] = useState(false)

  useEffect(() => {
    // Function to check if the device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Check on initial load
    checkMobile()

    // Mark as preloaded
    setIsPreloaded(true)

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Return isMobile (defaulting to false if undefined) and isPreloaded
  return { isMobile: !!isMobile, isPreloaded }
}

// Also export as default for flexibility
export default useMobile
