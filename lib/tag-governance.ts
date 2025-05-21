/**
 * Tag Governance Utility
 *
 * This utility helps monitor and control third-party scripts loaded via Google Tag Manager
 * or directly on the page. It provides visibility into script performance impact.
 */

export function monitorScriptPerformance() {
  if (typeof window === "undefined" || !window.performance || !window.PerformanceObserver) {
    return
  }

  // Create a performance observer to monitor long tasks (potential script blocking)
  try {
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        // Log long tasks that might be caused by third-party scripts
        if (entry.duration > 50) {
          // Tasks longer than 50ms
          console.warn("Long task detected:", {
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
            // Attribution when available
            attribution: entry.attribution
              ? Array.from(entry.attribution).map((item) => item.name || "unknown")
              : "unavailable",
          })

          // Report to analytics if available
          if (window.gtag) {
            window.gtag("event", "long_task_detected", {
              duration: Math.round(entry.duration),
              page_path: window.location.pathname,
            })
          }
        }
      })
    })

    longTaskObserver.observe({ entryTypes: ["longtask"] })

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        // Focus on script resources
        if (entry.initiatorType === "script" && entry.name.includes("googletagmanager")) {
          console.info("GTM script loaded:", {
            url: entry.name,
            duration: Math.round(entry.duration),
            size: entry.transferSize ? `${Math.round(entry.transferSize / 1024)}KB` : "unknown",
          })
        }
      })
    })

    resourceObserver.observe({ entryTypes: ["resource"] })

    return () => {
      longTaskObserver.disconnect()
      resourceObserver.disconnect()
    }
  } catch (error) {
    console.error("Error setting up performance monitoring:", error)
  }
}

export function auditThirdPartyScripts() {
  if (typeof window === "undefined") {
    return []
  }

  // Get all script elements on the page
  const scripts = Array.from(document.getElementsByTagName("script"))

  // Analyze and categorize scripts
  return scripts
    .map((script) => {
      const src = script.src || "inline"
      const isThirdParty = src !== "inline" && !src.includes(window.location.hostname)
      const category = src.includes("google")
        ? "Google"
        : src.includes("facebook") || src.includes("fb")
          ? "Facebook"
          : src.includes("analytics")
            ? "Analytics"
            : src.includes("tag")
              ? "Tag Manager"
              : src.includes("pixel")
                ? "Marketing Pixel"
                : isThirdParty
                  ? "Other Third-Party"
                  : "First-Party"

      return {
        src,
        isThirdParty,
        category,
        async: script.async,
        defer: script.defer,
        type: script.type || "text/javascript",
      }
    })
    .filter((script) => script.isThirdParty)
}
