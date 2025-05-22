"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import type { PanInfo } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface PortfolioItem {
  title: string
  type: string
  imageUrl: string
  websiteUrl: string
}

interface PortfolioCardDeckProps {
  items: PortfolioItem[]
}

export function PortfolioCardDeck({ items }: PortfolioCardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef(null)

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1))
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl p-6 bg-brand-dark/50 backdrop-blur-sm border border-white/10"
      ref={constraintsRef}
    >
      <h3 className="text-2xl font-bold text-center text-white mb-2">Our Portfolio</h3>
      <p className="text-gray-300 text-center mb-6">
        Take a look at some of the websites we've designed and developed for our clients.
      </p>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {items.map((item, index) => {
          // Determine the site type for the ribbon
          const siteType =
            item.title === "Sharky's Bar"
              ? "Business Site"
              : item.title === "JammmySlots"
                ? "Premium Site"
                : "Starter Site"

          const ribbonColor =
            item.title === "Sharky's Bar"
              ? "bg-blue-500"
              : item.title === "JammmySlots"
                ? "bg-purple-500"
                : "bg-pink-500"

          return (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden ${index === currentIndex ? "ring-2 ring-brand-pink" : ""}`}
              onClick={() => setCurrentIndex(index)}
            >
              {/* Ribbon - repositioned to top */}
              <div
                className={`absolute top-0 left-0 right-0 z-10 ${ribbonColor} text-white py-1 text-sm font-bold text-center`}
              >
                {siteType}
              </div>

              <div className="aspect-square relative">
                <Image
                  src={
                    item.title === "Sharky's Bar"
                      ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Sharkys-VN9QauIaJZSEQQhU5FcF4vHbiQURA4.jpg"
                      : item.title === "JammmySlots"
                        ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/jammmy-xQgcWSmIIQC96FjnToLlxBTphURhnE.png"
                        : item.title === "Andy's Man and Van"
                          ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Andys-2TvK0A9LOccO5rBEIErGbCIjdF4lMt.jpg"
                          : item.title === "MT Plumbing"
                            ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/MT-nAuoFxy5fk4nVzlMddpywUeNitGWlK.jpg"
                            : item.title === "The Painted Gardener"
                              ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/paintedgardener-3zHP1Ss89cQsSJO8NRHjtYiZ8MOD9Y.jpg"
                              : item.title === "Pressure Washer Coils"
                                ? "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Daz-5xDWUosKKdAjK4U7BovSrthjHRb2nO.jpg"
                                : item.imageUrl
                  }
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw"
                  priority={true}
                  unoptimized={true}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Current Item Details */}
      <div className="text-center mb-6">
        <h4 className="text-xl font-bold text-white">{items[currentIndex].title}</h4>
        <p className="text-gray-300 mb-4">{items[currentIndex].type}</p>
        <a href={items[currentIndex].websiteUrl} target="_blank" rel="noopener noreferrer">
          <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white">
            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center space-x-2 mb-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-4 h-4 rounded-full transition-all ${
              index === currentIndex ? "bg-brand-pink" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Previous project"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Next project"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}
