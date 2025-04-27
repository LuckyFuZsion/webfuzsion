"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface PortfolioCardProps {
  title: string
  type: string
  imageUrl: string
  websiteUrl: string
}

export function PortfolioCard({ title, type, imageUrl, websiteUrl }: PortfolioCardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl cursor-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className="h-full w-full">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={title === "Sharky's Bar" || title === "The Painted Gardener"}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-pink transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 mb-4">{type}</p>
        <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white">
              Visit Website <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </a>
      </motion.div>
    </motion.div>
  )
}
