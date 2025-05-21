"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isDebugMode, setIsDebugMode] = useState(false)

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    // Check if we're in debug mode
    const debugMode = searchParams?.get("debug") === "analytics" || localStorage.getItem("analytics_debug") === "true"
    setIsDebugMode(debugMode)

    // Only track if explicitly in debug mode
    if (!debugMode) return

    // Function to send page view
    const sendAdminPageView = () => {
      if (typeof window.gtag !== "function") {
        console.warn("Google Analytics not loaded yet. Trying again in 1 second...")
        setTimeout(sendAdminPageView, 1000)
        return
      }

      // Construct page path
      const pagePath = pathname || ""
      const pageTitle = document.title || "Admin Page"

      // Send the page view
      window.gtag("event", "page_view", {
        page_title: pageTitle,
        page_path: pagePath,
        page_location: window.location.href,
        send_to: "G-0LBYMRG5RQ",
        debug_mode: true,
        non_interaction: true, // Don't count as an interaction
        admin_page: true, // Custom parameter to identify admin pages
      })

      if (isDebugMode) {
        console.log("🔍 Admin Analytics Debug:", {
          event: "page_view",
          page_title: pageTitle,
          page_path: pagePath,
          page_location: window.location.href,
        })
      }
    }

    // Send page view
    sendAdminPageView()

    // Log that we're in admin analytics mode
    console.log("📊 Admin Analytics Tracker initialized in debug mode")

    // Cleanup
    return () => {
      // Nothing to clean up
    }
  }, [pathname, searchParams, isDebugMode])

  // This component doesn't render anything
  return null
}

// Add type definition for the global window object
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
