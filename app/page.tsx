"use client"

import { useState, useEffect, useRef } from "react"
import { Laptop, Layout, RefreshCw, Wrench, Phone, Mail, MessageSquare } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ServiceCard from "@/components/service-card"
import PricingCard from "@/components/pricing-card"
import PricingCubeCarousel from "@/components/pricing-cube-carousel"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedCard } from "@/components/animated-card"
import { FloatingElements } from "@/components/floating-elements"
import { motion, useScroll, useTransform } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { TransitionEffect } from "@/components/transition-effect"
import { SectionIndicator } from "@/components/section-indicator"
import { MagneticButton } from "@/components/magnetic-button"
import { TextReveal } from "@/components/text-reveal"
import TestimonialCarousel from "@/components/testimonial-carousel"
import { SectionNavigator } from "@/components/section-navigator"
import { SeoHeadings } from "@/components/seo-headings"
import FAQSection from "@/components/faq-section"
import PortfolioCarousel from "@/components/portfolio-carousel"
import ContactForm from "@/components/contact-form"
import { SafeImage } from "@/components/safe-image"

// Add type for window.scrollTimeout
declare global {
  interface Window {
    scrollTimeout?: number
  }
}

// Add back the PortfolioItem interface
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

// Add back the FAQItem interface
interface FAQItem {
  question: string
  answer: string
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  // Simple mobile detection that works
  const [isMobile, setIsMobile] = useState(false)
  const [isPreloaded, setIsPreloaded] = useState(false)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 768)

      // Initial check
      checkMobile()
      setIsPreloaded(true)

      // Add resize listener
      window.addEventListener("resize", checkMobile)

      // Cleanup
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Add a state for content visibility
  const [contentVisible, setContentVisible] = useState(!isMobile)

  // Ensure content is visible on mobile after a short delay
  useEffect(() => {
    if (isMobile) {
      setContentVisible(true)
    }
  }, [isMobile])

  // Track scroll speed to disable animations during fast scrolling
  const [isScrollingFast, setIsScrollingFast] = useState(false)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const currentTime = Date.now()
      const timeDiff = currentTime - lastScrollTime.current
      const scrollDiff = Math.abs(currentY - lastScrollY.current)

      const scrollSpeed = scrollDiff / (timeDiff || 1)

      if (scrollSpeed > 1) {
        setIsScrollingFast(true)
        if (window.scrollTimeout) {
          clearTimeout(window.scrollTimeout)
        }
        window.scrollTimeout = window.setTimeout(() => {
          setIsScrollingFast(false)
        }, 200)
      }

      lastScrollY.current = currentY
      lastScrollTime.current = currentTime
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (window.scrollTimeout) {
        clearTimeout(window.scrollTimeout)
      }
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e: Event) => {
        e.preventDefault()
        const target = anchor as HTMLAnchorElement
        const href = target.getAttribute("href")
        if (!href) return

        const targetElement = document.querySelector(href)
        if (!targetElement) return

        window.scrollTo({
          top: (targetElement as HTMLElement).offsetTop - 80,
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
      id: "pressure-washer-coils",
      title: "Pressure Washer Coils",
      type: "E-commerce",
      imageUrl: "/images/pressure-washer-new.webp",
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
      id: "andy-man-van",
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
      answer:
        "Our website packages start from £500 for a starter site. The final cost depends on your specific requirements, number of pages, and functionality needed. We offer transparent pricing with no hidden fees.",
    },
    {
      question: "How long does it take to build a website?",
      answer:
        "A typical website takes 2-4 weeks to complete, depending on the complexity and your feedback timeline. We'll provide you with a detailed timeline during our initial consultation.",
    },
    {
      question: "Do you offer website maintenance?",
      answer:
        "Yes, we offer comprehensive website maintenance packages to keep your site secure, updated, and performing at its best. This includes regular updates, security checks, and technical support.",
    },
    {
      question: "Can you help with my existing website?",
      answer:
        "We can help improve, redesign, or fix issues with your existing website. We'll assess your current site and provide recommendations for improvements.",
    },
    {
      question: "Do you offer hosting services?",
      answer:
        "Yes, we provide reliable hosting services with 99.9% uptime guarantee. Our hosting packages include SSL certificates, regular backups, and technical support.",
    },
    {
      question: "What if I need changes after the website is live?",
      answer:
        "We offer post-launch support and can make any necessary changes to your website. We'll discuss your maintenance needs and provide a solution that works for your business.",
    },
    {
      question: "Do you offer SEO services?",
      answer:
        "Yes, we implement SEO best practices during development and offer ongoing SEO services to help improve your website's visibility in search engines.",
    },
    {
      question: "What information do you need to start?",
      answer:
        "We'll need your business details, target audience information, design preferences, and any specific features you want. We'll guide you through the process and help gather all necessary information.",
    },
    {
      question: "Do you provide training on how to use the website?",
      answer:
        "Yes, we provide comprehensive training on how to manage and update your website. We'll ensure you're comfortable using the content management system.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including bank transfer, credit/debit cards, and PayPal. We require a 50% deposit to start the project, with the balance due upon completion.",
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden mobile-gradient-background">
      <SeoHeadings />
      <SectionNavigator />
      {!isMobile && <TransitionEffect />}
      <FloatingElements reducedOnMobile={isMobile} />
      <ScrollProgress />
      {!isMobile && <SectionIndicator />}
      <Header />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-24 pb-6 md:pt-32 md:pb-10 relative overflow-hidden section-anchor"
        data-section-color="dark-purple"
        aria-label="Hero"
      >
        <div
          className="container mx-auto px-4 relative z-[100]"
          style={
            isMobile
              ? undefined
              : {
                  opacity: opacity.get(),
                  transform: `scale(${scale.get()})`,
                }
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium"
              >
                <span itemProp="slogan" className="text-brand-pink">
                  Web Design Studio
                </span>
              </motion.div>

              <TextReveal direction="up" delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight !text-white" itemProp="name">
                  Creating exceptional digital experiences
                </h1>
              </TextReveal>

              <TextReveal direction="up" delay={0.4}>
                <p className="text-xl !text-gray-300" itemProp="description">
                  Professional web design for small businesses, tradesmen, local services, and content creators.
                </p>
              </TextReveal>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#contact" aria-label="Get Started with WebFuZsion">
                  <MagneticButton strength={isMobile ? 20 : 40}>
                    <Button className="bg-brand-pink hover:bg-brand-pink/80 !text-white px-6 py-6">Get Started</Button>
                  </MagneticButton>
                </a>
                <a href="#portfolio" aria-label="View Our Portfolio">
                  <MagneticButton strength={isMobile ? 20 : 40}>
                    <Button
                      variant="outline"
                      className="border-brand-pink/50 !text-brand-pink bg-transparent hover:bg-brand-pink/10 hover:border-brand-pink px-6 py-6"
                    >
                      View Our Work
                    </Button>
                  </MagneticButton>
                </a>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              className="relative flex justify-center items-center"
            >
              <div className="relative h-[300px] w-[300px]">
                <motion.div
                  animate={
                    isScrollingFast
                      ? {}
                      : {
                          y: [0, -20, 0],
                          rotate: [0, 5, 0, -5, 0],
                        }
                  }
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <SafeImage
                    src="/images/webfuzsion-flame-logo.png"
                    alt="WebFuZsion Web Design Studio Logo"
                    width={300}
                    height={300}
                    className="object-contain"
                    priority={true}
                    style={{ width: "300px", height: "300px" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[100px] -z-[1]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-[1]"></div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="pt-4 pb-8 relative section-anchor"
        data-section-color="purple-pink"
        aria-label="services-heading"
        itemScope
        itemType="https://schema.org/Service"
      >
        <div className="container mx-auto px-4 relative z-[100]">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
            <TextReveal disableOnFastScroll={isScrollingFast}>
              <h2 id="services-heading" className="text-3xl md:text-4xl font-bold mb-4 !text-white" itemProp="name">
                Our Services
              </h2>
            </TextReveal>
            <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
              <p className="!text-gray-300" itemProp="description">
                We offer a comprehensive range of web design and development services to help your business succeed
                online.
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <AnimatedCard key={index} index={index} delay={0.2} disableOnFastScroll={isScrollingFast}>
                <div itemScope itemType="https://schema.org/Service">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    gradient={service.gradient}
                  />
                  <meta itemProp="name" content={service.title} />
                  <meta itemProp="description" content={service.description} />
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-[1]"></div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-12 relative section-anchor" data-section-color="pink-blue">
        <div className="container mx-auto px-4 relative z-[100]">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
            <TextReveal disableOnFastScroll={isScrollingFast}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 !text-white">Our Portfolio</h2>
            </TextReveal>
            <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
              <p className="!text-gray-300 mb-8">
                Take a look at some of the websites we've designed and developed for our clients.
                <span className="block mt-2 text-sm text-brand-pink">Tap on a card to see more details!</span>
              </p>
            </TextReveal>
          </AnimatedSection>

          <AnimatedSection delay={0.3} disableOnFastScroll={isScrollingFast}>
            <PortfolioCarousel items={portfolioItems} />
          </AnimatedSection>
        </div>

        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[100px] -z-[1]"></div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 relative section-anchor" data-section-color="blue-orange">
        <div className="container mx-auto px-4">
          <AnimatedSection
            className="text-center max-w-3xl mx-auto mb-8 hidden md:block"
            disableOnFastScroll={isScrollingFast}
          >
            <TextReveal disableOnFastScroll={isScrollingFast}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Transparent Pricing</h2>
            </TextReveal>
            <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
              <p className="text-gray-300">Choose the perfect package for your business needs and budget.</p>
            </TextReveal>
          </AnimatedSection>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <AnimatedCard key={index} index={index} delay={0.2} disableOnFastScroll={isScrollingFast}>
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  earlyBirdPrice={plan.earlyBirdPrice}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  gradient={plan.gradient}
                />
              </AnimatedCard>
            ))}
          </div>

          <div className="md:hidden">
            <PricingCubeCarousel plans={pricingPlans} />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 relative section-anchor" data-section-color="orange-purple">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
            <TextReveal disableOnFastScroll={isScrollingFast}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Client Testimonials</h2>
            </TextReveal>
            <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
              <p className="text-gray-300">
                Don't just take our word for it. Here's what our clients have to say about working with us. We're proud
                of our 5-star rating across all client reviews.
              </p>
            </TextReveal>
          </AnimatedSection>

          <AnimatedSection delay={0.3} disableOnFastScroll={isScrollingFast}>
            <TestimonialCarousel testimonials={testimonials} />
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 relative section-anchor" data-section-color="purple-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Find answers to common questions about our web design and development services.
          </p>
          <FAQSection items={faqItems} itemsPerPage={5} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 relative section-anchor" data-section-color="purple-dark">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
            <TextReveal disableOnFastScroll={isScrollingFast}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Get In Touch</h2>
            </TextReveal>
            <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
              <p className="text-gray-300">Ready to start your project? Contact us today for a free consultation.</p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection
              delay={0.2}
              className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8"
              disableOnFastScroll={isScrollingFast}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              <div className="space-y-6">
                <motion.div whileHover={{ x: isMobile ? 0 : 5 }} className="flex items-start">
                  <div className="bg-brand-pink/20 p-3 rounded-lg mr-4">
                    <Phone className="h-6 w-6 text-brand-pink" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Phone / WhatsApp</p>
                    <a
                      href="tel:07590763430"
                      className="text-xl font-medium text-white hover:text-brand-pink transition-colors"
                    >
                      07590 763430
                    </a>
                  </div>
                </motion.div>

                <motion.div whileHover={{ x: isMobile ? 0 : 5 }} className="flex items-start">
                  <div className="bg-brand-pink/20 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-brand-pink" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Email</p>
                    <a
                      href="mailto:steve@webfuzsion.co.uk"
                      className="text-xl font-medium text-white hover:text-brand-pink transition-colors"
                    >
                      steve@webfuzsion.co.uk
                    </a>
                  </div>
                </motion.div>

                <motion.div whileHover={{ x: isMobile ? 0 : 5 }} className="flex items-start">
                  <div className="bg-brand-pink/20 p-3 rounded-lg mr-4">
                    <MessageSquare className="h-6 w-6 text-brand-pink" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Social Media</p>
                    <a
                      href="https://www.facebook.com/profile.php?id=61575611918979"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-medium text-white hover:text-brand-pink transition-colors"
                    >
                      Facebook
                    </a>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4} disableOnFastScroll={isScrollingFast}>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
