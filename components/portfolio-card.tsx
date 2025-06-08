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
  // Determine the site type for the ribbon
  const siteType =
    title === "Sharky's Bar" ? "Business Site" : title === "JammmySlots" ? "Premium Site" : "Starter Site"

  const ribbonColor =
    title === "Sharky's Bar" ? "bg-blue-500" : title === "JammmySlots" ? "bg-purple-500" : "bg-pink-500"

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl cursor-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ribbon - repositioned to top */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 ${ribbonColor} text-white py-1 px-3 text-sm font-bold text-center`}
      >
        {siteType}
      </div>

      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} className="h-full w-full">
          <Image
            src={
              title === "Sharky's Bar"
                ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Sharkys-VN9QauIaJZSEQQhU5FcF4vHbiQURA4.jpg"
                : title === "JammmySlots"
                  ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/jammmy-xQgcWSmIIQC96FjnToLlxBTphURhnE.png"
                  : title === "Andy's Man and Van"
                    ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Andys-2TvK0A9LOccO5rBEIErGbCIjdF4lMt.jpg"
                    : title === "MT Plumbing"
                      ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/MT-nAuoFxy5fk4nVzlMddpywUeNitGWlK.jpg"
                      : title === "The Painted Gardener"
                        ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/paintedgardener-3zHP1Ss89cQsSJO8NRHjtYiZ8MOD9Y.jpg"
                        : title === "Pressure Washer Coils"
                          ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Daz-5xDWUosKKdAjK4U7BovSrthjHRb2nO.jpg"
                          : imageUrl
            }
            alt={title}
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
