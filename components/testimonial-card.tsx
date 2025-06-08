"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
}

export function TestimonialCard({ name, role, content, rating }: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-brand-pink/30 transition-all duration-300 cursor-card"
      whileHover={{ y: -5 }}
    >
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-brand-orange fill-brand-orange" : "text-gray-500"}`} />
        ))}
      </div>
      <p className="text-gray-300 mb-4">"{content}"</p>
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </motion.div>
  )
}
