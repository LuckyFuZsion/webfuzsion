"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
}

export default function ServiceCard({ title, description, icon: Icon, gradient }: ServiceCardProps) {
  return (
    <motion.div
      className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-brand-pink/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-pink/5 cursor-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-14 h-14 rounded-lg flex items-center justify-center mb-3 ${gradient}`}
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="h-7 w-7 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}
