"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("hidden")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show cursor after it's moved to prevent initial position issues
    const onMouseEnter = () => setIsVisible(true)

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)

    // Handle cursor state changes
    const handleLinkHover = () => setCursorVariant("link")
    const handleButtonHover = () => setCursorVariant("button")
    const handleCardHover = () => setCursorVariant("card")
    const handleDefaultCursor = () => setCursorVariant("hidden")
    const handleMouseDown = () => {
      if (cursorVariant !== "hidden") setCursorVariant("clicked")
    }
    const handleMouseUp = () => {
      // Return to the appropriate state based on what's being hovered
      const element = document.elementFromPoint(mousePosition.x, mousePosition.y)
      if (element?.closest("a, button")) {
        setCursorVariant("link")
      } else if (element?.closest(".cursor-card")) {
        setCursorVariant("card")
      } else {
        setCursorVariant("hidden")
      }
    }

    // Add event listeners
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    // Add event listeners for interactive elements
    const links = document.querySelectorAll("a, button")
    const cards = document.querySelectorAll(".cursor-card")

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHover)
      link.addEventListener("mouseleave", handleDefaultCursor)
    })

    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleCardHover)
      card.addEventListener("mouseleave", handleDefaultCursor)
    })

    // Clean up
    return () => {
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkHover)
        link.removeEventListener("mouseleave", handleDefaultCursor)
      })

      cards.forEach((card) => {
        card.removeEventListener("mouseenter", handleCardHover)
        card.removeEventListener("mouseleave", handleDefaultCursor)
      })
    }
  }, [isVisible, mousePosition.x, mousePosition.y, cursorVariant])

  // Cursor variants
  const variants = {
    hidden: {
      opacity: 0,
      x: mousePosition.x,
      y: mousePosition.y,
      height: 0,
      width: 0,
    },
    link: {
      opacity: 1,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(255, 0, 153, 0.4)",
      border: "1px solid rgba(255, 0, 153, 0.6)",
      mixBlendMode: "normal" as const,
    },
    button: {
      opacity: 1,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(255, 0, 153, 0.4)",
      border: "1px solid rgba(255, 0, 153, 0.6)",
      mixBlendMode: "normal" as const,
    },
    card: {
      opacity: 1,
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      height: 80,
      width: 80,
      backgroundColor: "rgba(0, 178, 255, 0.15)",
      border: "1px solid rgba(0, 178, 255, 0.3)",
      mixBlendMode: "normal" as const,
    },
    clicked: {
      opacity: 1,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 0, 153, 0.8)",
      border: "1px solid rgba(255, 0, 153, 1)",
      scale: 0.8,
      mixBlendMode: "normal" as const,
    },
  }

  // Only show on non-touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <>
      <style jsx global>{`
        a, button, .cursor-card {
          cursor: pointer;
        }
      `}</style>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 rounded-full pointer-events-none z-50 backdrop-blur-sm"
          variants={variants}
          animate={cursorVariant}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.5,
          }}
        />
      )}
    </>
  )
}
