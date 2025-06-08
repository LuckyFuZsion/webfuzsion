"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

export function TransitionEffect() {
  const [key, setKey] = useState(0)
  const { isMobile, isClient } = useMobile()

  useEffect(() => {
    // Listen for section changes
    const handleSectionChange = () => {
      setKey((prev) => prev + 1) // Force re-render of animation
    }

    // Listen for custom event from SectionNavigator
    window.addEventListener("sectionChange", handleSectionChange)

    // Also listen for hash changes in URL
    window.addEventListener("hashchange", handleSectionChange)

    return () => {
      window.removeEventListener("sectionChange", handleSectionChange)
      window.removeEventListener("hashchange", handleSectionChange)
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      <div key={key}>
        <motion.div
          className="fixed top-0 bottom-0 right-full w-screen h-screen z-50 bg-brand-blue"
          initial={{ x: "100%", width: "100%" }}
          animate={{ x: "0%", width: "0%" }}
          transition={{
            duration: isMobile ? 0.4 : 0.8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="fixed top-0 bottom-0 right-full w-screen h-screen z-40 bg-brand-pink"
          initial={{ x: "100%", width: "100%" }}
          animate={{ x: "0%", width: "0%" }}
          transition={{
            delay: isMobile ? 0.1 : 0.2,
            duration: isMobile ? 0.4 : 0.8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-brand-purple"
          initial={{ x: "100%", width: "100%" }}
          animate={{ x: "0%", width: "0%" }}
          transition={{
            delay: isMobile ? 0.2 : 0.4,
            duration: isMobile ? 0.4 : 0.8,
            ease: "easeInOut",
          }}
        />
      </div>
    </AnimatePresence>
  )
}
