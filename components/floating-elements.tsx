"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

interface FloatingElementsProps {
  reducedOnMobile?: boolean
}

export function FloatingElements({ reducedOnMobile = false }: FloatingElementsProps) {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const { isMobile } = useMobile()

  useEffect(() => {
    const colors = ["bg-brand-blue/30", "bg-brand-pink/30", "bg-brand-orange/30", "bg-brand-purple/30"]

    // Create fewer elements for mobile
    const elementCount = reducedOnMobile ? 5 : 12

    const newElements = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: reducedOnMobile ? 30 : Math.random() * 20 + 10, // Slower animations on mobile
      delay: reducedOnMobile ? 0 : Math.random() * 5, // No delays on mobile
    }))

    setElements(newElements)
  }, [reducedOnMobile])

  // Simplified animations for mobile
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full blur-xl ${element.color}`}
          style={{
            width: element.size,
            height: element.size,
            left: `${element.x}%`,
            top: `${element.y}%`,
            opacity: reducedOnMobile ? 0.5 : 1, // Reduced opacity on mobile
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: reducedOnMobile ? 0.5 : 1,
            x: reducedOnMobile ? 0 : [0, Math.random() * 50 - 25, 0],
            y: reducedOnMobile ? 0 : [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
            delay: element.delay,
          }}
        />
      ))}
    </div>
  )
}
