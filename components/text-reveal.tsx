"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function TextReveal({ children, className = "", delay = 0, direction = "up" }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

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
