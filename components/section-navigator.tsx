"use client"

import { useEffect } from "react"

export function SectionNavigator() {
  useEffect(() => {
    // Function to handle section navigation
    const handleSectionNavigation = (sectionId: string) => {
      // Get the current URL
      const currentUrl = window.location.href
      const baseUrl = currentUrl.split("#")[0]

      // Update URL with hash without scrolling
      window.history.pushState({}, "", `${baseUrl}${sectionId}`)

      // Dispatch a custom event that our TransitionEffect component will listen for
      window.dispatchEvent(new CustomEvent("sectionChange", { detail: { section: sectionId } }))

      // After a slight delay to allow the transition to start, scroll to the section
      setTimeout(() => {
        const element = document.querySelector(sectionId)
        if (element) {
          window.scrollTo({
            top: (element as HTMLElement).offsetTop - 80,
            behavior: "smooth",
          })
        }
      }, 100)
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
  }, [])

  return null
}
