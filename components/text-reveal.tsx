"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  disableOnFastScroll?: boolean
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  disableOnFastScroll = false,
}: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()
  const { isMobile } = useMobile()

  useEffect(() => {
    if (isInView) {
      if (isMobile) {
        // On mobile, just show content without animation
        controls.set({ opacity: 1, x: 0, y: 0 })
      } else {
        controls.start("visible")
      }
    }
  }, [isInView, controls, isMobile])

  // If on mobile, render without animation
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 20 }
      case "down":
        return { y: -20 }
      case "left":
        return { x: 20 }
      case "right":
        return { x: -20 }
      default:
        return { y: 20 }
    }
  }

  const getFinalPosition = () => {
    switch (direction) {
      case "up":
      case "down":
        return { y: 0 }
      case "left":
      case "right":
        return { x: 0 }
      default:
        return { y: 0 }
    }
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ ...getInitialPosition(), opacity: 0 }}
        animate={controls}
        variants={{
          visible: {
            ...getFinalPosition(),
            opacity: 1,
            transition: {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay,
            },
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
