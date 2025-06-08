"use client"

import type React from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isFirstMount, setIsFirstMount] = useState(true)
  const { isMobile, isClient } = useMobile()

  useEffect(() => {
    setIsFirstMount(false)
  }, [])

  // If on mobile, render without animation
  if (isMobile) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={isFirstMount ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
