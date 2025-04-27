"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
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

  // Calculate positions for the cards in the deck
  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + items.length) % items.length

    // Create a stacked effect for the cards
    if (diff === 0) {
      return { zIndex: 10, scale: 1, opacity: 1, rotateY: 0, translateX: 0 }
    } else if (diff === 1 || diff === items.length - 1) {
      return {
        zIndex: 9,
        scale: 0.95,
        opacity: 0.7,
        rotateY: diff === 1 ? 5 : -5,
        translateX: diff === 1 ? 20 : -20,
      }
    } else if (diff === 2 || diff === items.length - 2) {
      return {
        zIndex: 8,
        scale: 0.9,
        opacity: 0.4,
        rotateY: diff === 2 ? 10 : -10,
        translateX: diff === 2 ? 40 : -40,
      }
    } else {
      return {
        zIndex: 7,
        scale: 0.85,
        opacity: 0,
        rotateY: diff === 3 ? 15 : -15,
        translateX: diff === 3 ? 60 : -60,
      }
    }
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden" ref={constraintsRef}>
      {/* Card Deck */}
      <div className="absolute inset-0 flex items-center justify-center">
        {items.map((item, index) => {
          const style = getCardStyle(index)

          return (
            <AnimatePresence key={index} mode="wait">
              <motion.div
                className="absolute w-[280px] h-[400px] rounded-xl overflow-hidden shadow-lg bg-brand-dark/50 backdrop-blur-sm border border-white/10"
                style={{
                  zIndex: style.zIndex,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: style.scale,
                  opacity: style.opacity,
                  rotateY: style.rotateY,
                  x: style.translateX,
                  transition: { duration: 0.5, ease: "easeOut" },
                }}
                drag={index === currentIndex ? "x" : false}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: "grabbing" }}
              >
                {/* Card Content */}
                <div className="relative h-full w-full">
                  {/* Image */}
                  <div className="relative h-[60%] w-full">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-70"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-300 mb-4">{item.type}</p>
                    <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white">
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )
        })}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-20">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="rounded-full border-white/20 bg-brand-dark/50 backdrop-blur-sm hover:bg-white/10 hover:border-brand-pink/30"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous project</span>
        </Button>

        <div className="flex items-center space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-brand-pink w-4" : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to project ${index + 1}`}
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
          <span className="sr-only">Next project</span>
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-0 right-0 text-center text-white/70 text-sm">
        <p>Swipe cards or use buttons to navigate</p>
      </div>
    </div>
  )
}
