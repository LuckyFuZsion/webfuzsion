"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedCard } from "./animated-card"
import { PortfolioCard } from "./portfolio-card"
import { motion } from "framer-motion"

interface PortfolioItem {
  title: string
  type: string
  imageUrl: string
  websiteUrl: string
}

interface PortfolioDesktopCarouselProps {
  items: PortfolioItem[]
}

export function PortfolioDesktopCarousel({ items }: PortfolioDesktopCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Calculate max index based on number of items
    setMaxIndex(Math.max(0, items.length - 3))
  }, [items])

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          ref={carouselRef}
          className="flex gap-6"
          animate={{ x: `-${currentIndex * (100 / 3)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-[calc(33.333%-16px)]">
              <AnimatedCard index={index} delay={0.1}>
                <PortfolioCard
                  title={item.title}
                  type={item.type}
                  imageUrl={item.imageUrl}
                  websiteUrl={item.websiteUrl}
                />
              </AnimatedCard>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-10 ${
          currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        onClick={prevSlide}
        disabled={currentIndex === 0}
        aria-label="Previous items"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-10 ${
          currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        onClick={nextSlide}
        disabled={currentIndex === maxIndex}
        aria-label="Next items"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-brand-pink w-4" : "bg-white/30 hover:bg-white/60"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
