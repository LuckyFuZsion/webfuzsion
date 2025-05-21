"use client"

import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { PricingCard } from "@/components/pricing-card"
import { PricingCubeCarousel } from "@/components/pricing-cube-carousel"
import { Button } from "@/components/ui/button"
import { Laptop, Layout, RefreshCw, Wrench, Phone, Mail, MessageSquare } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedCard } from "@/components/animated-card"
import { FloatingElements } from "@/components/floating-elements"
import { motion, useScroll, useTransform } from "framer-motion"
import { ScrollProgress } from "@/components/scroll-progress"
import { TransitionEffect } from "@/components/transition-effect"
import { SectionIndicator } from "@/components/section-indicator"
import { MagneticButton } from "@/components/magnetic-button"
import { TextReveal } from "@/components/text-reveal"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { SectionNavigator } from "@/components/section-navigator"
import { SeoHeadings } from "@/components/seo-headings"
import { useMobile } from "@/hooks/use-mobile"
import { FAQSection } from "@/components/faq-section"
import { PortfolioCarousel } from "@/components/portfolio-carousel"
import { ContactForm } from "@/components/contact-form"
import { SafeImage } from "@/components/safe-image"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const { isMobile, isPreloaded } = useMobile()

  // Add a state for content visibility
  const [contentVisible, setContentVisible] = useState(!isMobile)

  // Ensure content is visible on mobile after a short delay
  useEffect(() => {
    if (isMobile) {
      // Make content immediately visible on mobile
      setContentVisible(true)
    }
  }, [isMobile])

  // Track scroll speed to disable animations during fast scrolling
  const [isScrollingFast, setIsScrollingFast] = useState(false)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())

  useEffect(() => {
    // Detect fast scrolling
    const handleScroll = () => {
      const currentY = window.scrollY
      const currentTime = Date.now()
      const timeDiff = currentTime - lastScrollTime.current
      const scrollDiff = Math.abs(currentY - lastScrollY.current)

      // Calculate scroll speed (pixels per millisecond)
      const scrollSpeed = scrollDiff / (timeDiff || 1)

      // If scrolling faster than threshold, mark as fast scrolling
      if (scrollSpeed > 1) {
        // Adjust threshold as needed
        setIsScrollingFast(true)
        // Reset after a short delay
        clearTimeout(window.scrollTimeout)
        window.scrollTimeout = setTimeout(() => {
          setIsScrollingFast(false)
        }, 200) as unknown as number
      }

      lastScrollY.current = currentY
      lastScrollTime.current = currentTime
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(window.scrollTimeout)
    }
  }, [])

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const href = this.getAttribute("href")
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

  const portfolioItems = [
    {
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

  return (
    <div className="min-h-screen text-white overflow-hidden mobile-gradient-background">
      <SeoHeadings />
      <SectionNavigator />
      {!isMobile && <TransitionEffect />}
      <FloatingElements reducedOnMobile={isMobile} />
      <ScrollProgress />
      {!isMobile && <SectionIndicator />}
      <Header />

      {/* Preload all content on mobile */}
      <div className={isMobile ? "opacity-100" : ""}>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="pt-24 pb-6 md:pt-32 md:pb-10 relative overflow-hidden section-anchor"
          data-section-color="dark-purple"
          aria-label="Hero"
        >
          <div className="container mx-auto px-4 relative z-10" style={isMobile ? {} : { opacity, scale }}>
            {/* Hero content remains the same */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium"
                >
                  <span itemProp="slogan">Web Design Studio</span>
                </motion.div>

                <TextReveal direction="up" delay={0.2}>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" itemProp="name">
                    Creating exceptional digital experiences
                  </h1>
                </TextReveal>

                <TextReveal direction="up" delay={0.4}>
                  <p className="text-xl text-gray-300" itemProp="description">
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
                      <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white px-6 py-6">Get Started</Button>
                    </MagneticButton>
                  </a>
                  <a href="#portfolio" aria-label="View Our Portfolio">
                    <MagneticButton strength={isMobile ? 20 : 40}>
                      <Button variant="outline" className="border-white/20 text-brand-blue hover:bg-white/10 px-6 py-6">
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
                    {/* Using SafeImage component that falls back to standard img if needed */}
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

          {/* Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
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
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
              <TextReveal disableOnFastScroll={isScrollingFast}>
                <h2 id="services-heading" className="text-3xl md:text-4xl font-bold mb-4" itemProp="name">
                  Our Services
                </h2>
              </TextReveal>
              <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
                <p className="text-gray-300" itemProp="description">
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

          {/* Background Elements */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-12 relative section-anchor" data-section-color="pink-blue">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
              <TextReveal disableOnFastScroll={isScrollingFast}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Portfolio</h2>
              </TextReveal>
              <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
                <p className="text-gray-300 mb-8">
                  Take a look at some of the websites we've designed and developed for our clients.
                  <span className="block mt-2 text-sm text-brand-pink">Tap on a card to see more details!</span>
                </p>
              </TextReveal>
            </AnimatedSection>

            <AnimatedSection delay={0.3} disableOnFastScroll={isScrollingFast}>
              <PortfolioCarousel items={portfolioItems} />
            </AnimatedSection>
          </div>

          {/* Background Elements */}
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[100px] -z-10"></div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 relative section-anchor" data-section-color="blue-orange">
          <div className="container mx-auto px-4">
            <AnimatedSection
              className="text-center max-w-3xl mx-auto mb-8 hidden md:block"
              disableOnFastScroll={isScrollingFast}
            >
              <TextReveal disableOnFastScroll={isScrollingFast}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
              </TextReveal>
              <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
                <p className="text-gray-300">Choose the perfect package for your business needs and budget.</p>
              </TextReveal>
            </AnimatedSection>

            {/* Desktop Pricing Grid */}
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

            {/* Mobile Pricing Carousel */}
            <div className="md:hidden">
              <PricingCubeCarousel plans={pricingPlans} />
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 relative section-anchor" data-section-color="orange-purple">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
              <TextReveal disableOnFastScroll={isScrollingFast}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
              </TextReveal>
              <TextReveal delay={0.2} disableOnFastScroll={isScrollingFast}>
                <p className="text-gray-300">
                  Don't just take our word for it. Here's what our clients have to say about working with us. We're
                  proud of our 5-star rating across all client reviews.
                </p>
              </TextReveal>
            </AnimatedSection>

            <AnimatedSection delay={0.3} disableOnFastScroll={isScrollingFast}>
              <TestimonialCarousel testimonials={testimonials} />
            </AnimatedSection>
          </div>

          {/* Background Elements */}
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[100px] -z-10"></div>
        </section>

        {/* FAQ Section */}
        <FAQSection disableOnFastScroll={isScrollingFast} />

        {/* Contact Section */}
        <section id="contact" className="py-12 relative section-anchor" data-section-color="purple-dark">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={isScrollingFast}>
              <TextReveal disableOnFastScroll={isScrollingFast}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
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
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
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
                      <p className="text-xl font-medium text-white">
                        Facebook & Instagram <span className="text-gray-400 text-base">- Coming Soon</span>
                      </p>
                    </div>
                  </motion.div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.4} disableOnFastScroll={isScrollingFast}>
                <ContactForm isMobile={isMobile} />
              </AnimatedSection>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
