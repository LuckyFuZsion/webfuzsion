"use client"

import { useMobile } from "@/hooks/use-mobile"
import type { ReactNode } from "react"

interface StaticContentWrapperProps {
  children: ReactNode
  mobileOnly?: boolean
}

/**
 * A component that ensures content is rendered statically on mobile devices
 * This prevents animations and transitions that could cause white flashes
 */
export function StaticContentWrapper({ children, mobileOnly = true }: StaticContentWrapperProps) {
  const { isMobile } = useMobile()

  // If mobileOnly is true, only apply static rendering on mobile
  // Otherwise, render the content as-is
  if (mobileOnly && !isMobile) {
    return <>{children}</>
  }

  // Apply static rendering styles
  return (
    <div className="will-change-auto">
      <div className="transform-style-flat backface-visible">{children}</div>
    </div>
  )
}
