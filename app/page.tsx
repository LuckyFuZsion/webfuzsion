"use client"

import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Laptop, Layout, RefreshCw, Wrench, Phone, Mail, MessageSquare } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedCard } from "@/components/animated-card"
import { FloatingElements } from "@/components/floating-elements"
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { TransitionEffect } from "@/components/transition-effect"
import { SectionIndicator } from "@/components/section-indicator"
import { MagneticButton } from "@/components/magnetic-button"
import { TextReveal } from "@/components/text-reveal"
import { SectionNavigator } from "@/components/section-navigator"
import { SeoHeadings } from "@/components/seo-headings"
import { useMobile } from "@/hooks/use-mobile"
import { SafeImage } from "@/components/safe-image"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import { AnimatedHero } from "./components/motion/hero-animation"
import { AnimatedFeatures } from "./components/motion/features-animation"
import { AnimatedServices } from "./components/motion/services-animation"
import { AnimatedTestimonials } from "./components/motion/testimonials-animation"
import { AnimatedContact } from "./components/motion/contact-animation"

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
  </div>
)

// Define types for portfolio items and FAQ items
interface PortfolioItem {
  id: string
  title: string
  type: string
  imageUrl: string
  websiteUrl: string
  siteType: "Starter Site" | "Business Site" | "Premium Site" | "Custom Site"
  description: string
  features: string[]
  isLocalBusiness?: boolean
}

interface FAQItem {
  question: string
  answer: string
}

// Dynamic imports with loading states
const DynamicServiceCard = dynamic(() => import("@/components/service-card"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

const DynamicPricingCard = dynamic(() => import("@/components/pricing-card"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

const DynamicPricingCubeCarousel = dynamic(() => import("@/components/pricing-cube-carousel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

const DynamicTestimonialCarousel = dynamic(() => import("@/components/testimonial-carousel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

const DynamicPortfolioCarousel = dynamic(() => import("@/components/portfolio-carousel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

const DynamicContactForm = dynamic(() => import("@/components/contact-form"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

const DynamicFAQSection = dynamic<{ items: FAQItem[]; title?: string; description?: string }>(() => import("@/components/faq-section"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] animate-pulse bg-brand-dark/20 rounded-xl" />
  ),
})

// Main page component
export default function Home() {
  const { isMobile } = useMobile()
  const heroRef = useRef<HTMLDivElement>(null)
  const [isScrollingFast, setIsScrollingFast] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Convert motion values to CSS values using useTransform
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  
  // Create a style object with proper CSS values
  const heroStyle = !isMobile ? {
    opacity: opacity.get(),
    transform: `scale(${scale.get()})`
  } : undefined

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrollingFast(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrollingFast(false)
      }, 150)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const href = anchor.getAttribute("href")
        if (!href) return

        const target = document.querySelector(href)
        if (!target) return

        window.scrollTo({
          top: (target as HTMLElement).offsetTop - 80,
          behavior: "smooth",
        })
      })
    })
  }, [])

  const services = [
    {
      title: "Full Website Builds",
      description: "Complete website design and development from concept to launch, tailored to your business needs.",
      icon: Laptop,
      gradient: "bg-gradient-to-r from-brand-blue to-brand-purple",
    },
    {
      title: "Landing Pages",
      description: "High-converting landing pages designed to capture leads and drive customer action.",
      icon: Layout,
      gradient: "bg-gradient-to-r from-brand-pink to-brand-orange",
    },
    {
      title: "Redesigns",
      description: "Transform your outdated website into a modern, user-friendly digital experience.",
      icon: RefreshCw,
      gradient: "bg-gradient-to-r from-brand-orange to-brand-pink",
    },
    {
      title: "Maintenance",
      description: "Keep your website secure, updated, and performing at its best with our maintenance services.",
      icon: Wrench,
      gradient: "bg-gradient-to-r from-brand-purple to-brand-blue",
    },
  ]

  // Update the pricingPlans array with the requested changes
  const pricingPlans = [
    {
      title: "Starter Site",
      price: "£500",
      earlyBirdPrice: "£300",
      description: "Perfect for small businesses just getting started online.",
      features: [
        "One page scroller",
        "Mobile responsive design",
        "Basic SEO setup",
        "Contact form",
        "Social media integration",
        "12 months hosting",
      ],
      gradient: "bg-gradient-to-r from-brand-blue to-brand-purple",
    },
    {
      title: "Business Site",
      price: "£800",
      earlyBirdPrice: "£500",
      description: "Comprehensive solution for established businesses.",
      features: [
        "Up to 5 pages",
        "Advanced responsive design",
        "Enhanced SEO optimization",
        "Custom contact forms",
        "Social media integration",
        "12 months hosting",
        "Basic animations",
        "Dynamic page design",
        "Photo gallery",
      ],
      isPopular: true,
      gradient: "bg-gradient-to-r from-brand-pink to-brand-orange",
    },
    {
      title: "Premium Site",
      price: "£1200",
      earlyBirdPrice: "£1000",
      description: "Advanced features for businesses with complex needs.",
      features: [
        "Up to 10 pages",
        "Premium responsive design",
        "E-commerce functionality",
        "Advanced SEO strategy",
        "Custom functionality",
        "Social media integration",
        "Custom contact forms",
        "Performance optimization",
        "12 months hosting",
        "Advanced animations",
        "Dynamic page design",
        "Interactive photo gallery",
      ],
      gradient: "bg-gradient-to-r from-brand-purple to-brand-blue",
    },
    {
      title: "Custom Quote and Extras",
      price: "Enquire",
      description: "Tailored solutions for unique business requirements.",
      features: [
        "Content Management",
        "Site Redesign - Starting at £100 (Existing customers only)",
        "Additional Pages - £50-£100 depending on content (Existing customers only)",
        "New Tools/API's - £200-£500",
        "Additional 12 Months Hosting - £100 (Existing Customers only)",
        "Custom design & development",
        "Advanced functionality",
        "E-commerce & payment systems",
        "Third-party integrations",
      ],
      gradient: "bg-gradient-to-r from-brand-orange to-brand-pink",
    },
  ]

  const testimonials = [
    {
      name: "Josh Marconi",
      role: "Client",
      content:
        "Done a lot of work for me and I've always been pleased, I recommend to him to anyone who thinks they can benefit from Steve's services",
      rating: 5,
    },
    {
      name: "Andrew Harrison",
      role: "Client",
      content: "Excellent to deal with really happy with my website thanks andy",
      rating: 5,
    },
    {
      name: "Charlotte Reeves",
      role: "Club Representative",
      content:
        "A wonderful business. Very professional speedy responsive and I couldn't be more impressed with their work. They displayed exceptional creativity and took the time to understand our vision and tailored the designs to match our club's branding perfectly. Communication was seamless throughout the process, and they delivered the final products fantastically. I highly recommend WebFuZsion for any design needs.",
      rating: 5,
    },
    {
      name: "Alex Smith",
      role: "Business Owner",
      content: "Work is amazing. Really fast delivery",
      rating: 5,
    },
    {
      name: "Sharkys Bar - Marina de Albufeira",
      role: "Bar & Restaurant",
      content:
        "Extremely pleased with our business website created and managed by Webfuzsion. Excellently put together for my customers to check out what we have to offer.",
      rating: 5,
    },
    {
      name: "Chris Whatley",
      role: "Business Owner",
      content:
        "Just had my business website superbly designed by WebFuZsion, could not be happier, very professionally organized and brilliant layout. Highly recommend!",
      rating: 5,
    },
    {
      name: "Mark Taylor",
      role: "Owner, MT Plumbing",
      content:
        "Steve @ WebFuZsion built an amazing website for my plumbing business—it's clean, intuitive, and professional. Customers can easily find and contact me, making it a perfect online presence. Steve's attention to detail and expertise made the process smooth, and I highly recommend WebFuZsion for quality web design!",
      rating: 5,
    },
  ]

  const portfolioItems: PortfolioItem[] = [
    {
      id: "jammmy-slots",
      title: "JammmySlots",
      type: "Content Creator Platform",
      imageUrl: "/images/jammmy-slots.png",
      websiteUrl: "https://jammmyslots.com",
      siteType: "Premium Site",
      description: "A custom-built platform for a casino content creator with advanced features including loyalty systems, leaderboards, and user management.",
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
      id: "pressure-washer-coils",
      title: "Pressure Washer Coils",
      type: "E-commerce",
      imageUrl: "/images/pressure-washer-new.webp",
      websiteUrl: "https://pressurewashercoils4u.co.uk",
      siteType: "Starter Site",
      description: "An e-commerce website for a specialist supplier of pressure washer coils for various brands and models.",
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
      id: "sharkys-bar",
      title: "Sharky's Bar",
      type: "Restaurant & Bar",
      imageUrl: "/images/sharkys-new.webp",
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
    },
    {
      id: "andys-man-and-van",
      title: "Andy's Man and Van",
      type: "Service Business",
      imageUrl: "/images/andys-new.webp",
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
      type: "Trade Service",
      imageUrl: "/images/mt-plumbing-new.webp",
      websiteUrl: "https://www.mtplumbing.uk/",
      siteType: "Starter Site",
      description: "A clean, professional website for a Gas Safe registered plumber serving Grantham and surrounding areas.",
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
      id: "the-painted-gardener",
      title: "The Painted Gardener",
      type: "Gardening/Landscaping Business",
      imageUrl: "/images/painted-gardener-new.webp",
      websiteUrl: "https://thepaintedgardener.co.uk",
      siteType: "Starter Site",
      description: "A vibrant website for a dual-service business offering both painting and gardening services.",
      features: [
        "Service gallery with before/after images",
        "Service area information",
        "Online quote request form",
        "Seasonal service highlights",
        "Mobile-responsive design",
      ],
      isLocalBusiness: true,
    },
  ]

  const faqItems: FAQItem[] = [
    {
      question: "How much does a website cost?",
      answer: "Our website packages start from £500 for a starter site. The final cost depends on your specific requirements, number of pages, and functionality needed. We offer transparent pricing with no hidden fees.",
    },
    // ... other FAQ items ...
  ]

  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
      </div>

      <Header />
      <AnimatedHero />
      <AnimatedFeatures />
      <AnimatedServices />
      <AnimatedTestimonials />
      <AnimatedContact />
      <Footer />
    </div>
  )
}
