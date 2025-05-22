"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"

interface PricingCubeCarouselProps {
  plans: Array<{
    title: string
    price: string
    earlyBirdPrice?: string
    description: string
    features: string[]
    isPopular?: boolean
    gradient: string
  }>
}

export default function PricingCubeCarousel({ plans }: PricingCubeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const goToNext = () => {
    if (isRotating) return
    setIsRotating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length)
    setTimeout(() => setIsRotating(false), 500)
  }

  const goToPrevious = () => {
    if (isRotating) return
    setIsRotating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + plans.length) % plans.length)
    setTimeout(() => setIsRotating(false), 500)
  }

  const goToIndex = (index: number) => {
    if (isRotating || index === currentIndex) return
    setIsRotating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsRotating(false), 500)
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      // Swiped left, go next
      goToNext()
    } else if (distance < -minSwipeDistance) {
      // Swiped right, go previous
      goToPrevious()
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  // Get current plan
  const currentPlan = plans[currentIndex]

  return (
    <div
      className="relative w-full overflow-visible rounded-xl p-6 bg-brand-dark/50 backdrop-blur-sm border border-white/10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h3 className="text-2xl font-bold text-center text-white mb-2">Pricing Plans</h3>
      <p className="text-gray-300 text-center mb-6">Choose the perfect package for your business needs and budget.</p>

      {/* Current pricing card */}
      <div className="bg-brand-dark/70 rounded-xl border border-white/10 backdrop-blur-sm overflow-visible mb-8">
        {currentPlan.isPopular && (
          <div className="bg-brand-pink text-white text-sm font-medium py-1 px-3 text-center">Most Popular</div>
        )}

        <div className="p-6">
          <h4 className="text-xl font-bold text-white mb-2">{currentPlan.title}</h4>
          <div className="mb-4">
            {currentPlan.earlyBirdPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">{currentPlan.earlyBirdPrice}</span>
                  <span className="text-lg line-through text-gray-400">{currentPlan.price}</span>
                </div>
                <div className="mt-1 bg-brand-pink/20 text-brand-pink text-xs font-medium py-1 px-2 rounded inline-block">
                  Early Bird Offer until May 31st
                </div>
              </>
            ) : (
              <span className="text-3xl font-bold text-white">{currentPlan.price}</span>
            )}
          </div>
          <p className="text-gray-300 mb-6">{currentPlan.description}</p>

          <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {currentPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <Check className="h-5 w-5 text-brand-pink mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <Button className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white">Get Started</Button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center space-x-2 mb-4">
        {plans.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-4 h-4 rounded-full transition-all ${
              index === currentIndex ? "bg-brand-pink" : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to pricing plan ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Previous plan"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/3 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Next plan"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}
