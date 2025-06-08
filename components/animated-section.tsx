"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  disableOnFastScroll?: boolean
}

export function AnimatedSection({ children, className, delay = 0, disableOnFastScroll = false }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const { isMobile } = useMobile()

  useEffect(() => {
    if (isInView) {
      if (isMobile) {
        // On mobile, just show content without animation
        controls.set({ opacity: 1, y: 0 })
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

  const variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: delay,
      },
    },
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
