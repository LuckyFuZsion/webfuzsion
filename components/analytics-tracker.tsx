"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { getCookie } from "cookies-next"

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Skip if no pathname or if it's the same as the previous one (prevents duplicate tracking)
    if (!pathname || pathname === previousPathRef.current) return

    // Check if analytics consent is granted
    const consentCookie = getCookie("cookie-consent")
    let analyticsConsent = false

    if (consentCookie) {
      try {
        const preferences = JSON.parse(consentCookie as string)
        analyticsConsent = preferences.analytics === true
      } catch (e) {
        console.error("Error parsing consent cookie:", e)
      }
    }

    // Only track if consent is given
    if (analyticsConsent && typeof window !== "undefined" && window.gtag) {
      // Report performance metrics
      if (analyticsConsent && typeof window !== "undefined" && window.gtag && window.performance) {
        // Report performance metrics
        try {
          const performanceMetrics = window.performance.getEntriesByType("navigation")[0]
          if (performanceMetrics) {
            window.gtag("event", "performance_metrics", {
              page_load_time: performanceMetrics.loadEventEnd - performanceMetrics.startTime,
              dom_interactive_time: performanceMetrics.domInteractive - performanceMetrics.startTime,
              first_contentful_paint: window.performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0,
              page_path: pathname,
            })
          }
        } catch (e) {
          console.error("Error reporting performance metrics:", e)
        }
      }

      // Construct full URL
      const url = window.location.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

      // Send pageview to Google Analytics
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: url,
        page_path: pathname,
        send_to: "G-0LBYMRG5RQ",
      })

      console.log(`Analytics: Tracked pageview for ${pathname}`)
    } else {
      console.log(
        `Analytics: Skipped tracking for ${pathname} (consent: ${analyticsConsent}, gtag available: ${typeof window !== "undefined" && !!window.gtag})`,
      )
    }

    // Store current path as previous for next comparison
    previousPathRef.current = pathname
  }, [pathname, searchParams])

  // This component doesn't render anything
  return null
}
