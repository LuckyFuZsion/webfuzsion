"use client"

import type React from "react"

import { motion } from "framer-motion"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  index?: number
}

export function AnimatedCard({ children, className, delay = 0, index = 0 }: AnimatedCardProps) {
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
