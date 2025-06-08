"use client"

import { useState, useEffect } from "react"
import { Phone, X, Mail, MessageCircle, Facebook } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export const FloatingContactMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  // Add this new useEffect to handle clicks outside the menu
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // Get the contact menu element
      const contactMenu = document.querySelector(".contact-menu-container")
      const toggleButton = document.querySelector(".contact-menu-toggle")

      // Close the menu if clicking outside both the menu and toggle button
      if (
        contactMenu &&
        !contactMenu.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex flex-col gap-3 mb-3 contact-menu-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Facebook */}
            <motion.a
              href="https://www.facebook.com/share/18y5fzqjmp/?mibextid=wwXIfr"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] text-white shadow-lg hover:bg-[#0E65E5] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              aria-label="Visit our Facebook page"
            >
              <Facebook size={24} />
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/447590763430" // Updated with your actual WhatsApp number
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              aria-label="Contact via WhatsApp"
            >
              <MessageCircle size={24} />
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:steve@luckyfuzsion.co.uk" // Updated with your actual email
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              aria-label="Contact via Email"
            >
              <Mail size={24} />
            </motion.a>

            {/* Phone */}
            <motion.a
              href="tel:+447590763430" // Updated with your actual phone number
              className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              aria-label="Contact via Phone"
            >
              <Phone size={24} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-colors contact-menu-toggle ${
          isOpen ? "bg-white text-brand-orange" : "bg-gradient-to-r from-brand-purple to-brand-orange text-white"
        }`}
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Phone size={24} />}
      </motion.button>
    </div>
  )
}
