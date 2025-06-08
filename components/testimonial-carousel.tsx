"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

interface TestimonialCarouselProps {
  testimonials: Array<{
    name: string
    role: string
    content: string
    rating: number
  }>
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? filteredTestimonials.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === filteredTestimonials.length - 1 ? 0 : prevIndex + 1))
  }

  // Calculate average rating
  const calculateAverageRating = (testimonials: Testimonial[]): number => {
    const sum = testimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0)
    return sum / testimonials.length
  }

  // Get current testimonial
  // Use all testimonials
  const filteredTestimonials = testimonials
  const testimonial = filteredTestimonials[currentIndex % filteredTestimonials.length]

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Reviews Summary Section */}
      <div className="flex justify-center mb-8">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 flex items-center gap-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-brand-orange fill-brand-orange mr-1" />
            <span className="font-bold text-white">{calculateAverageRating(testimonials).toFixed(1)}</span>
            <span className="text-gray-400 ml-1">/ 5</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <span className="font-bold text-white">{testimonials.length}</span>
            <span className="text-gray-400 ml-1">Reviews</span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${i < testimonial.rating ? "text-brand-orange fill-brand-orange" : "text-gray-500"}`}
              />
            ))}
          </div>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 italic">"{testimonial.content}"</p>
          <div>
            <p className="font-semibold text-white text-lg">{testimonial.name}</p>
            <p className="text-gray-400">{testimonial.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center mt-8 space-x-4">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="rounded-full border-white/20 bg-brand-dark/50 backdrop-blur-sm hover:bg-white/10 hover:border-brand-pink/30"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        <div className="flex items-center space-x-2">
          {filteredTestimonials.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-2 rounded-full ${index === currentIndex % filteredTestimonials.length ? "bg-brand-pink" : "bg-white/20"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="rounded-full border-white/20 bg-brand-dark/50 backdrop-blur-sm hover:bg-white/10 hover:border-brand-pink/30"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  )
}
