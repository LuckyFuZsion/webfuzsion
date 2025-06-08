"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function SectionIndicator() {
  const [activeSection, setActiveSection] = useState("")
  const sections = ["services", "portfolio", "pricing", "testimonials", "contact"]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section)
        if (!element) continue

        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center space-y-4">
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className="relative group flex items-center"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          <span
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === section ? "bg-brand-pink scale-125" : "bg-white/30 group-hover:bg-white/60"
            }`}
          />
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-6 capitalize bg-black/70 backdrop-blur-sm text-white text-sm py-1 px-2 rounded whitespace-nowrap"
          >
            {section}
          </motion.span>
        </a>
      ))}
    </div>
  )
}
