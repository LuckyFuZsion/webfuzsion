"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { PricingCard } from "@/components/pricing-card"
import { PortfolioCard } from "@/components/portfolio-card"
import { Button } from "@/components/ui/button"
import { Laptop, Layout, RefreshCw, Wrench, Phone, Mail, MessageSquare, ArrowRight } from "lucide-react"
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
import { PortfolioDesktopCarousel } from "@/components/portfolio-desktop-carousel"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

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

  const pricingPlans = [
    {
      title: "Starter Site",
      price: "£500",
      description: "Perfect for small businesses just getting started online.",
      features: [
        "Up to 5 pages",
        "Mobile responsive design",
        "Basic SEO setup",
        "Contact form",
        "Social media integration",
      ],
      gradient: "bg-gradient-to-r from-brand-blue to-brand-purple",
    },
    {
      title: "Business Site",
      price: "£800",
      description: "Comprehensive solution for established businesses.",
      features: [
        "Up to 10 pages",
        "Advanced responsive design",
        "Enhanced SEO optimization",
        "Custom contact forms",
        "Google Analytics integration",
        "Basic content management",
      ],
      isPopular: true,
      gradient: "bg-gradient-to-r from-brand-pink to-brand-orange",
    },
    {
      title: "Premium Site",
      price: "£1200",
      description: "Advanced features for businesses with complex needs.",
      features: [
        "Up to 20 pages",
        "Premium responsive design",
        "Advanced SEO strategy",
        "Custom functionality",
        "E-commerce capabilities",
        "Full content management",
        "Performance optimization",
      ],
      gradient: "bg-gradient-to-r from-brand-purple to-brand-blue",
    },
    {
      title: "Custom Quote",
      price: "Enquire",
      description: "Tailored solutions for unique business requirements.",
      features: [
        "Unlimited pages",
        "Custom design & development",
        "Advanced functionality",
        "E-commerce & payment systems",
        "Third-party integrations",
        "Ongoing support options",
        "Training & documentation",
      ],
      gradient: "bg-gradient-to-r from-brand-orange to-brand-pink",
    },
  ]

  const testimonials = [
    {
      name: "John Smith",
      role: "Owner, Local Plumbing Service",
      content:
        "WebFuZsion transformed our online presence. Our new website has already brought in several new clients within the first month!",
      rating: 5,
    },
    {
      name: "Sarah Johnson",
      role: "Restaurant Manager",
      content:
        "The team at WebFuZsion understood exactly what we needed. Our new website perfectly captures our restaurant's atmosphere and has increased our bookings.",
      rating: 5,
    },
    {
      name: "Mike Thompson",
      role: "Tradesman",
      content:
        "As someone who isn't tech-savvy, I appreciated how WebFuZsion made the whole process easy to understand. Great service and great results!",
      rating: 4,
    },
  ]

  const portfolioItems = [
    {
      title: "Sharky's Bar",
      type: "Restaurant & Bar",
      imageUrl: "/images/sharkys-bar.png",
      websiteUrl: "https://v0-sharky-s-bar-website.vercel.app/",
    },
    {
      title: "MT Plumbing",
      type: "Trade Service",
      imageUrl: "/images/mt-plumbing.jpeg",
      websiteUrl: "https://mtplumbing.uk",
    },
    {
      title: "Pressure Washer Coils",
      type: "E-commerce",
      imageUrl: "/images/pressure-washer-coils.jpeg",
      websiteUrl: "https://pressurewashercoils4u.co.uk",
    },
    {
      title: "Andy's Man and Van",
      type: "Service Business",
      imageUrl: "/images/andys-man-and-van.jpeg",
      websiteUrl: "https://andysmanandvan.vercel.app",
    },
    {
      title: "The Painted Gardener",
      type: "Creative Business",
      imageUrl: "/images/painted-gardener.png",
      websiteUrl: "https://v0-painted-gardener.vercel.app/",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark to-black text-white overflow-hidden">
      <SectionNavigator />
      <TransitionEffect />
      <FloatingElements />
      <ScrollProgress />
      <SectionIndicator />
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity, scale }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium"
              >
                Web Design Studio
              </motion.div>

              <TextReveal direction="up" delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Creating exceptional digital experiences
                </h1>
              </TextReveal>

              <TextReveal direction="up" delay={0.4}>
                <p className="text-xl text-gray-300">
                  Professional web design for small businesses, tradesmen, local services, and content creators.
                </p>
              </TextReveal>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#contact">
                  <MagneticButton strength={30}>
                    <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white px-6 py-6">Get Started</Button>
                  </MagneticButton>
                </a>
                <a href="#portfolio">
                  <MagneticButton strength={30}>
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
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Image
                    src="/images/webfuzsion-logo.png"
                    alt="WebFuZsion Design"
                    width={300}
                    height={300}
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                We offer a comprehensive range of web design and development services to help your business succeed
                online.
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <AnimatedCard key={index} index={index} delay={0.2}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  gradient={service.gradient}
                />
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Portfolio</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                Take a look at some of the websites we've designed and developed for our clients.
              </p>
            </TextReveal>
          </AnimatedSection>

          {/* Desktop Carousel View */}
          <div className="hidden lg:block">
            <PortfolioDesktopCarousel items={portfolioItems} />
          </div>

          {/* Mobile and Tablet Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-8">
            {portfolioItems.map((item, index) => (
              <AnimatedCard key={index} index={index} delay={0.3}>
                <PortfolioCard
                  title={item.title}
                  type={item.type}
                  imageUrl={item.imageUrl}
                  websiteUrl={item.websiteUrl}
                />
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">Choose the perfect package for your business needs and budget.</p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPlans.map((plan, index) => (
              <AnimatedCard key={index} index={index} delay={0.2}>
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  isPopular={plan.isPopular}
                  gradient={plan.gradient}
                />
              </AnimatedCard>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                Don't just take our word for it. Here's what our clients have to say about working with us.
              </p>
            </TextReveal>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <TestimonialCarousel testimonials={testimonials} />
          </AnimatedSection>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-pink/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">Ready to start your project? Contact us today for a free consultation.</p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection
              delay={0.2}
              className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <motion.div whileHover={{ x: 5 }} className="flex items-start">
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

                <motion.div whileHover={{ x: 5 }} className="flex items-start">
                  <div className="bg-brand-pink/20 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-brand-pink" />
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Email</p>
                    <a
                      href="mailto:steve@luckyfuzsion.com"
                      className="text-xl font-medium text-white hover:text-brand-pink transition-colors"
                    >
                      steve@luckyfuzsion.com
                    </a>
                  </div>
                </motion.div>

                <motion.div whileHover={{ x: 5 }} className="flex items-start">
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

            <AnimatedSection
              delay={0.4}
              className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      id="name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email"
                      id="email"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="subject"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="Website Design Inquiry"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    id="message"
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="Tell us about your project..."
                  ></motion.textarea>
                </div>
                <MagneticButton>
                  <Button className="w-full bg-brand-pink hover:bg-brand-pink/80 text-white py-6">
                    Send Message <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </form>
            </AnimatedSection>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      <Footer />
    </div>
  )
}
