"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselShowcaseProps {
  title: string
  description: string
  carouselTypes: {
    name: string
    description: string
    image: string
  }[]
}

export function CarouselShowcase({ title, description, carouselTypes }: CarouselShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselTypes.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === carouselTypes.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>

      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselTypes.map((type, index) => (
            <div key={index} className="min-w-full p-4">
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h4 className="text-xl font-bold mb-2 text-brand-pink">{type.name}</h4>
                <p className="text-gray-300 mb-4">{type.description}</p>
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                  <img
                    src={type.image || "/placeholder.svg"}
                    alt={type.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Previous carousel type"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Next carousel type"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {carouselTypes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-brand-pink" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to carousel type ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
