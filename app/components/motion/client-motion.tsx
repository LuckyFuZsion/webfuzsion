"use client"

import { motion } from "framer-motion"
import { ComponentProps } from "react"

// Create a wrapper component that only renders on the client side
export function ClientMotionDiv(props: ComponentProps<typeof motion.div>) {
  return <motion.div {...props} />
}

export function ClientMotionH1(props: ComponentProps<typeof motion.h1>) {
  return <motion.h1 {...props} />
}

// Add more motion components as needed
