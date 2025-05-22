"use client"

import { useState, useEffect, useRef, type TouchEvent } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PortfolioFlipCard } from "./portfolio-flip-card"
import { SwipeHint } from "./swipe-hint"

interface PortfolioItem {
  id: string
  title: string
  type: string
  imageUrl: string
  websiteUrl: string
  siteType: "Starter Site" | "Business Site" | "Premium Site" | "Custom Site"
  features: string[]
  description: string
  isLocalBusiness?: boolean
}

interface PortfolioCarouselProps {
  items: PortfolioItem[]
}

export default function PortfolioCarousel({ items }: PortfolioCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchEndY = useRef<number>(0)
  const touchStartTime = useRef<number>(0)
  const isSwiping = useRef<boolean>(false)
  const minSwipeDistance = 50 // Minimum distance required for a swipe
  const maxTapDistance = 10 // Maximum distance for a tap
  const maxTapDuration = 200 // Maximum duration for a tap in ms
  const [isMobile, setIsMobile] = useState(false)

  // Set the number of cards to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      if (window.innerWidth >= 1280) {
        setCardsToShow(3) // Show 3 cards on desktop (xl breakpoint)
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2) // Show 2 cards on tablet (md breakpoint)
      } else {
        setCardsToShow(1) // Show 1 card on mobile
      }
    }

    handleResize() // Initial call
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
    isSwiping.current = false
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY

    // Calculate horizontal distance moved
    const xDistance = Math.abs(touchEndX.current - touchStartX.current)

    // If we've moved more than the minimum swipe distance, mark as swiping
    if (xDistance > minSwipeDistance) {
      isSwiping.current = true
    }
  }

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const touchDuration = Date.now() - touchStartTime.current
    const xDistance = Math.abs(touchEndX.current - touchStartX.current)
    const yDistance = Math.abs(touchEndY.current - touchStartY.current)
    const totalDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)

    // If it's a swipe (moved more than minimum distance horizontally)
    if (isSwiping.current && xDistance > minSwipeDistance) {
      const direction = touchStartX.current - touchEndX.current

      if (direction > 0) {
        // Swipe left - go to next
        goToNext()
      } else {
        // Swipe right - go to previous
        goToPrevious()
      }

      // Prevent tap events from firing
      e.stopPropagation()
    }

    // Reset values
    touchStartX.current = 0
    touchEndX.current = 0
    touchStartY.current = 0
    touchEndY.current = 0
    isSwiping.current = false
  }

  // Calculate the number of pages
  const pageCount = Math.ceil(items.length / cardsToShow)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? pageCount - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === pageCount - 1 ? 0 : prevIndex + 1))
  }

  // Get items for the current page
  const getCurrentPageItems = (): PortfolioItem[] => {
    const startIndex = (currentIndex * cardsToShow) % items.length
    const currentItems: PortfolioItem[] = []

    for (let i = 0; i < cardsToShow; i++) {
      const itemIndex = (startIndex + i) % items.length
      currentItems.push(items[itemIndex])
    }

    return currentItems
  }

  return (
    <div className="relative w-full py-8" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white sr-only">Portfolio Projects</h2>
        <div className="flex space-x-2">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-brand-dark/50 hover:bg-brand-dark/80 text-white transition-colors"
            aria-label="Previous projects"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-brand-dark/50 hover:bg-brand-dark/80 text-white transition-colors"
            aria-label="Next projects"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden relative touch-swipe"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Portfolio carousel, swipe left or right to navigate, tap to flip cards"
      >
        {isMobile && <SwipeHint />}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {getCurrentPageItems().map((item, index) => (
            <div key={item.id} className="w-full">
              <PortfolioFlipCard
                key={index}
                title={item.title}
                type={item.type}
                imageUrl={item.imageUrl}
                websiteUrl={item.websiteUrl}
                features={item.features}
                description={item.description}
                siteType={item.siteType as any}
                isSwiping={isSwiping.current}
                isLocalBusiness={item.isLocalBusiness}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-brand-pink w-6" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
