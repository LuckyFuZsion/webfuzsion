"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const goToPrevious = () => {
    if (isAnimating) return
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
    setIsAnimating(true)
  }

  const goToNext = () => {
    if (isAnimating) return
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    setIsAnimating(true)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    }),
  }

  const testimonial = testimonials[currentIndex]

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div
        ref={containerRef}
        className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center"
      >
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => setIsAnimating(false)} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center text-center"
          >
            <div className="flex mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < testimonial.rating ? "text-brand-orange fill-brand-orange" : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 italic">"{testimonial.content}"</p>
            <div>
              <p className="font-semibold text-white text-lg">{testimonial.name}</p>
              <p className="text-gray-400">{testimonial.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Button
          onClick={goToPrevious}
          disabled={isAnimating}
          variant="outline"
          size="icon"
          className="rounded-full border-white/20 bg-brand-dark/50 backdrop-blur-sm hover:bg-white/10 hover:border-brand-pink/30"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        <div className="flex items-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isAnimating) return
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
                setIsAnimating(true)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-brand-pink w-4" : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={goToNext}
          disabled={isAnimating}
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
