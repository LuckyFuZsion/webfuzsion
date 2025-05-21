"use client"

import { useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function SectionNavigator() {
  const { isMobile } = useMobile()

  useEffect(() => {
    // Function to handle section navigation
    const handleSectionNavigation = (sectionId: string) => {
      // Get the current URL
      const currentUrl = window.location.href
      const baseUrl = currentUrl.split("#")[0]

      // Update URL with hash without scrolling
      window.history.pushState({}, "", `${baseUrl}${sectionId}`)

      // Only dispatch transition event on non-mobile devices
      if (!isMobile) {
        // Dispatch a custom event that our TransitionEffect component will listen for
        window.dispatchEvent(new CustomEvent("sectionChange", { detail: { section: sectionId } }))
      }

      // After a slight delay to allow the transition to start (or immediately on mobile), scroll to the section
      setTimeout(
        () => {
          const element = document.querySelector(sectionId)
          if (element) {
            // Adjust scroll position to account for header height
            const offset = isMobile ? 100 : 80
            window.scrollTo({
              top: (element as HTMLElement).offsetTop - offset,
              behavior: "smooth",
            })
          }
        },
        isMobile ? 0 : 100,
      )
    }

    // Add click event listeners to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const href = this.getAttribute("href")
        if (href) {
          handleSectionNavigation(href)
        }
      })
    })

    return () => {
      // Clean up event listeners
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", function (e) {
          e.preventDefault()
          const href = this.getAttribute("href")
          if (href) {
            handleSectionNavigation(href)
          }
        })
      })
    }
  }, [isMobile])

  return null
}
