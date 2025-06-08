"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

export function JammmySlotsCard() {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl cursor-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ribbon */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-purple-500 text-white py-1 px-3 text-sm font-bold text-center">
        Premium Site
      </div>

      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className="h-full w-full">
          <Image
            src="https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/jammmy-xQgcWSmIIQC96FjnToLlxBTphURhnE.png"
            alt="JammmySlots"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            unoptimized={true}
            crossOrigin="anonymous"
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
          JammmySlots
        </h3>
        <p className="text-gray-300 mb-4">Casino Review Platform</p>
        <a href="https://jammmyslots.com" target="_blank" rel="noopener noreferrer">
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
