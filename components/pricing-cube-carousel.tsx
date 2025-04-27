"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

interface PricingPlan {
  title: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
  gradient: string
}

interface PricingCubeCarouselProps {
  plans: PricingPlan[]
}

export function PricingCubeCarousel({ plans }: PricingCubeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const cubeRef = useRef<HTMLDivElement>(null)

  // Calculate rotation angle based on current index
  const getRotationY = () => {
    return -currentIndex * (360 / plans.length)
  }

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

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      goToNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRotate, currentIndex])

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

  return (
    <div className="relative w-full h-[600px] overflow-hidden px-4 py-8">
      {/* 3D Scene Container */}
      <div
        className="w-full h-full flex items-center justify-center perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 3D Cube */}
        <div
          ref={cubeRef}
          className="relative w-[280px] h-[450px] transform-style-3d transition-transform duration-500 ease-out"
          style={{
            transform: `rotateY(${getRotationY()}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {plans.map((plan, index) => {
            // Calculate the angle for this face
            const angle = (360 / plans.length) * index
            const isActive = index === currentIndex

            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full backface-hidden transition-all duration-500 ${
                  isActive ? "z-10 shadow-xl" : "z-0"
                }`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(200px)`,
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {/* Pricing Card Content */}
                <div
                  className={`relative h-full w-full rounded-xl overflow-hidden bg-brand-dark/50 backdrop-blur-sm border ${
                    plan.isPopular ? "border-brand-pink/50" : "border-white/10"
                  } flex flex-col`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-pink text-white text-sm font-medium py-1 px-3 rounded-full">
                      Most Popular
                    </div>
                  )}

                  <div className={`w-full h-1 rounded-full ${plan.gradient}`}></div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                    </div>
                    <p className="text-gray-300 mb-6">{plan.description}</p>

                    <div className="flex-1 overflow-auto scrollbar-thin">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-brand-pink mr-2">✓</span>
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={`w-full ${
                        plan.isPopular
                          ? "bg-brand-pink hover:bg-brand-pink/80"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      }`}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-20">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="rounded-full border-white/20 bg-brand-dark/50 backdrop-blur-sm hover:bg-white/10 hover:border-brand-pink/30"
          disabled={isRotating}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous plan</span>
        </Button>

        <div className="flex items-center space-x-2">
          {plans.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-brand-pink w-4" : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to pricing plan ${index + 1}`}
              disabled={isRotating}
            />
          ))}
        </div>

        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="rounded-full border-white/20 bg-brand-dark/50 backdrop-blur-sm hover:bg-white/10 hover:border-brand-pink/30"
          disabled={isRotating}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next plan</span>
        </Button>
      </div>

      {/* Auto-rotate toggle */}
      <Button
        onClick={() => setAutoRotate(!autoRotate)}
        variant="outline"
        size="sm"
        className={`absolute top-2 right-2 rounded-full border-white/20 backdrop-blur-sm ${
          autoRotate ? "bg-brand-pink/20 text-white" : "bg-brand-dark/50 text-white/70"
        }`}
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        {autoRotate ? "Auto" : "Manual"}
      </Button>

      {/* Instructions */}
      <div className="absolute top-4 left-0 right-0 text-center text-white/70 text-sm">
        <p>Swipe or use buttons to rotate</p>
      </div>
    </div>
  )
}
