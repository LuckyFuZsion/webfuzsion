"use client"

import { motion, useScroll } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-pink to-brand-orange z-50"
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
    />
  )
}
