"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  index?: number
  disableOnFastScroll?: boolean
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  index = 0,
  disableOnFastScroll = false,
}: AnimatedCardProps) {
  const { isMobile } = useMobile()

  // If on mobile, render without animation
  if (isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: delay + index * 0.1,
        },
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -10px rgba(255, 0, 153, 0.2)",
        transition: { duration: 0.3 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
