"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function AnimatedNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-300 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white px-6 py-3 rounded-md transition-colors"
      >
        Return Home
      </Link>
    </motion.div>
  )
}
