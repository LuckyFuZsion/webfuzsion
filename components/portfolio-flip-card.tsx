"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { ResponsiveImage } from "./responsive-image"

// Update the PortfolioFlipCardProps interface to include an optional isLocalBusiness flag
interface PortfolioFlipCardProps {
  title: string
  type: string
  imageUrl: string
  websiteUrl: string
  features: string[]
  description: string
  siteType: "Starter Site" | "Business Site" | "Premium Site" | "Custom Site"
  isSwiping?: boolean
  isLocalBusiness?: boolean
}

export function PortfolioFlipCard({
  title,
  type,
  imageUrl,
  websiteUrl,
  features,
  description,
  siteType,
  isSwiping = false,
  isLocalBusiness = false,
}: PortfolioFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [touchStartTime, setTouchStartTime] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)

  // Determine ribbon color based on site type
  const getRibbonColor = () => {
    switch (siteType) {
      case "Business Site":
        return "bg-brand-blue"
      case "Premium Site":
        return "bg-brand-purple"
      case "Custom Site":
        return "bg-brand-orange"
      default:
        return "bg-brand-pink"
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartTime(Date.now())
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchDuration = Date.now() - touchStartTime
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    // Calculate distance moved
    const xDistance = Math.abs(touchEndX - touchStartX)
    const yDistance = Math.abs(touchEndY - touchStartY)
    const totalDistance = Math.sqrt(xDistance * xDistance + yDistance * yDistance)

    // If it's a tap (short duration, small movement) and not swiping
    if (touchDuration < 300 && totalDistance < 10 && !isSwiping) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click on non-touch devices
    if (window.matchMedia("(hover: hover)").matches) {
      setIsFlipped(!isFlipped)
    }
  }

  // Determine if we need to limit features display based on the number of features
  const displayFeatures = () => {
    // For JammmySlots, show all features but make sure Database Creation/Hosting is last
    if (title === "JammmySlots") {
      // Filter out Database Creation/Hosting
      const filteredFeatures = features.filter((f) => f !== "Database Creation/Hosting")
      // Add it back at the end
      return [...filteredFeatures, "Database Creation/Hosting"]
    }

    // For other sites, limit to 5 features if there are more than 5
    return features.length > 5 ? features.slice(0, 5) : features
  }

  // Update the updatedImageUrl function to ensure it works correctly
  const updatedImageUrl = () => {
    if (typeof imageUrl !== "string") return imageUrl

    if (imageUrl.includes("mt-plumbing")) {
      return "/images/mt-plumbing-new.webp"
    }
    if (imageUrl.includes("andys-man-and-van")) {
      return "/images/andys-new.webp"
    }
    if (imageUrl.includes("pressure-washer-coils")) {
      return "/images/pressure-washer-new.webp"
    }
    if (imageUrl.includes("painted-gardener")) {
      return "/images/painted-gardener-new.webp"
    }
    if (imageUrl.includes("sharkys-bar")) {
      return "/images/sharkys-new.webp"
    }
    return imageUrl
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] perspective-1000">
      <div
        className="w-full h-full cursor-pointer preserve-3d transition-all duration-500"
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-brand-dark/50 backdrop-blur-sm border border-white/10">
            {/* Site type ribbon */}
            <div
              className={`absolute top-0 left-0 right-0 z-10 ${getRibbonColor()} text-white py-2 text-sm font-bold text-center`}
            >
              {isLocalBusiness ? `${siteType} • Local Business` : siteType}
            </div>

            {/* Local Business badge - add this new code */}
            {isLocalBusiness && (
              <div className="absolute top-8 left-0 right-0 z-10 bg-green-500 text-white py-1 text-xs font-bold text-center">
                Local Business
              </div>
            )}

            {/* Portfolio image - updated to use ResponsiveImage */}
            <div className="relative h-full w-full pt-0">
              <ResponsiveImage
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
                              : updatedImageUrl() || "/placeholder.svg"
                }
                alt={title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full"
                objectFit="contain"
                priority={title === "JammmySlots"}
              />
            </div>

            {/* Gradient overlay - adjusted for device mockups */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark to-transparent opacity-90"></div>

            {/* Content at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
              <p className="text-gray-300 mb-2">{isLocalBusiness ? "Local Business" : type}</p>
              <p className="text-sm text-white/70 mb-4">Tap card to see details</p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full backface-hidden rounded-xl bg-brand-dark/90 backdrop-blur-sm border border-white/10 p-6 overflow-y-auto"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div
            className={`absolute top-0 left-0 right-0 ${getRibbonColor()} text-white py-2 text-sm font-bold text-center`}
          >
            {isLocalBusiness ? `${siteType} • Local Business` : siteType}
          </div>

          <div className="flex flex-col justify-between h-full pt-10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 mt-4">{title}</h3>
              <p className="text-gray-300 mb-4">{description}</p>

              <h4 className="text-lg font-semibold text-brand-pink mb-2">Features:</h4>
              <ul className="space-y-1 mb-4">
                {displayFeatures().map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand-pink mr-2">•</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-2 sticky bottom-0 bg-brand-dark/90">
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Button className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white">
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
