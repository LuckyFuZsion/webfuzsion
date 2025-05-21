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

export function PortfolioCarousel() {
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

  const portfolioItems: PortfolioItem[] = [
    {
      id: "jammmy-slots",
      title: "JammmySlots",
      type: "Content Creator Platform",
      imageUrl: "/images/jammmy-slots.png",
      websiteUrl: "https://jammmyslots.com",
      siteType: "Premium Site",
      description:
        "A custom-built platform for a casino content creator with advanced features including loyalty systems, leaderboards, and user management.",
      features: [
        "Custom Built Loyalty System",
        "Custom Built Admin Panel",
        "Custom Built User Areas",
        "User Management",
        "Custom Built Leaderboards",
        "Custom API Creation",
        "Discord Login Integration",
        "Promotional Section",
        "Database Creation/Hosting",
      ],
    },
    {
      id: "pressure-washer",
      title: "Pressure Washer Coils",
      type: "E-commerce",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Daz-kz9AmlTpITyp1rj1P4gJH3tlGdDWzW.png",
      websiteUrl: "https://pressurewashercoils4u.co.uk",
      siteType: "Starter Site",
      description:
        "An e-commerce website for a specialist supplier of pressure washer coils for various brands and models.",
      features: [
        "Mobile-responsive design",
        "Product catalog with categories",
        "Brand-specific product pages",
        "Contact form integration",
        "SEO optimization for local searches",
      ],
      isLocalBusiness: true,
    },
    {
      id: "sharkys",
      title: "Sharky's Bar",
      type: "Bar & Restaurant",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sharkys-xwamnR7NCqNuVFMbeVwFJ1qFz4H7eu.png",
      websiteUrl: "https://www.sharkys-albufeira.com/",
      siteType: "Business Site",
      description: "A vibrant website for a popular bar and restaurant located in Marina de Albufeira.",
      features: [
        "Interactive menu display",
        "Photo gallery of the venue",
        "Events calendar integration",
        "Location map and directions",
        "Social media integration",
      ],
      isLocalBusiness: false,
    },
    {
      id: "andys",
      title: "Andy's Man & Van",
      type: "Removal Services",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Andys-OMLoFkQ0tDeH0pbOIKCmrfnsUfo8kv.png",
      websiteUrl: "https://andysmanandvan.vercel.app/",
      siteType: "Starter Site",
      description: "A professional website for a local moving and clearance service based in Grantham.",
      features: [
        "Service details and pricing",
        "Customer testimonials",
        "Direct call button integration",
        "Mobile-first design",
        "Local SEO optimization",
      ],
      isLocalBusiness: true,
    },
    {
      id: "mt-plumbing",
      title: "MT Plumbing",
      type: "Plumbing Services",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MT-xCSdeqydNbUcX0qaHGws9Bx3Sm4Twp.png",
      websiteUrl: "https://www.mtplumbing.uk/",
      siteType: "Starter Site",
      description:
        "A clean, professional website for a Gas Safe registered plumber serving Grantham and surrounding areas.",
      features: [
        "Service area map",
        "Credentials and certifications display",
        "Emergency contact information",
        "WhatsApp integration",
        "Customer testimonials",
      ],
      isLocalBusiness: true,
    },
    {
      id: "painted-gardener",
      title: "The Painted Gardener",
      type: "Gardening Services",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paintedgardener%20%281%29-EpnbMBuO2qGkETByQAXVchFgYrHRkx.png",
      websiteUrl: "https://thepaintedgardener.co.uk",
      siteType: "Starter Site",
      description: "A vibrant website for a dual-service business offering both painting and gardening services.",
      features: ["Service showcase", "Photo gallery", "Contact information", "About section", "Testimonials"],
      isLocalBusiness: true,
    },
  ]

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
  const pageCount = Math.ceil(portfolioItems.length / cardsToShow)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? pageCount - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === pageCount - 1 ? 0 : prevIndex + 1))
  }

  // Get items for the current page
  const getCurrentPageItems = () => {
    const startIndex = (currentIndex * cardsToShow) % portfolioItems.length
    const items = []

    for (let i = 0; i < cardsToShow; i++) {
      const itemIndex = (startIndex + i) % portfolioItems.length
      items.push(portfolioItems[itemIndex])
    }

    return items
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
