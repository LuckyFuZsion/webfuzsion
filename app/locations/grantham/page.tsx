"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Globe, Award, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/magnetic-button"
import { TextReveal } from "@/components/text-reveal"
import { AnimatedSection } from "@/components/animated-section"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { ReliableImage } from "@/components/reliable-image"
import { granthamAreaLocations } from "../villages"

export default function GranthamPage() {
  const { isMobile } = useMobile()

  // Create a string of all location names for SEO
  const allLocationNames = granthamAreaLocations.map((location) => location.name).join(", ")

  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      {/* Hidden SEO content */}
      <div className="sr-only">
        <h2>Web Design Services in Grantham and Surrounding Areas</h2>
        <p>
          Professional web design services for businesses in Grantham and surrounding areas including {allLocationNames}
          .
        </p>
        <p>Local web design services in Lincolnshire covering Grantham and nearby locations.</p>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium"
              >
                <MapPin className="h-4 w-4" />
                <span>Grantham, Lincolnshire</span>
              </motion.div>

              <TextReveal direction="up" delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Web Design Services in Grantham
                </h1>
              </TextReveal>

              <TextReveal direction="up" delay={0.4}>
                <p className="text-xl text-gray-300">
                  Professional web design for local businesses in Grantham and surrounding areas, with global reach and
                  expertise.
                </p>
              </TextReveal>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/#contact">
                  <MagneticButton strength={isMobile ? 20 : 40}>
                    <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white px-6 py-6">Get a Quote</Button>
                  </MagneticButton>
                </Link>
                <Link href="/#portfolio">
                  <MagneticButton strength={isMobile ? 20 : 40}>
                    <Button variant="outline" className="border-white/20 text-brand-blue hover:bg-white/10 px-6 py-6">
                      View Our Work
                    </Button>
                  </MagneticButton>
                </Link>
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
              <div className="relative h-[300px] w-[300px] rounded-full bg-gradient-to-r from-brand-blue to-brand-purple p-1">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <ReliableImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9034-nsDeXrwAp97fudAkv6Xk8PKMbYQwis.jpeg"
                    alt="Steve from WebFuZsion Web Design Studio"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                    priority
                    fallbackSrc="/diverse-group.png"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Local Services Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Web Design Services for Grantham Businesses</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                We provide tailored web design solutions for businesses in Grantham and throughout Lincolnshire, helping
                local companies establish a strong online presence.
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection
              delay={0.2}
              className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="bg-brand-pink/20 p-3 rounded-lg inline-block mb-4">
                <MapPin className="h-6 w-6 text-brand-pink" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Expertise</h3>
              <p className="text-gray-300">
                As a Grantham-based web design studio, we understand the local market and can help your business connect
                with customers in Lincolnshire and beyond.
              </p>
            </AnimatedSection>

            <AnimatedSection
              delay={0.3}
              className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="bg-brand-blue/20 p-3 rounded-lg inline-block mb-4">
                <Globe className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Reach</h3>
              <p className="text-gray-300">
                While we're based in Grantham, we work with clients worldwide, bringing international design trends and
                best practices to your project.
              </p>
            </AnimatedSection>

            <AnimatedSection
              delay={0.4}
              className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="bg-brand-purple/20 p-3 rounded-lg inline-block mb-4">
                <Award className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quality Service</h3>
              <p className="text-gray-300">
                We pride ourselves on delivering exceptional service to our clients, with personal attention and regular
                communication throughout your project.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Local SEO Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent to-brand-dark/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden">
                <ReliableImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9033-kjSaTO8SMkJ2aIi4jjsCcqunH17eLR.jpeg"
                  alt="Grantham town center with historic Guildhall and clock tower surrounded by green space"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                  fallbackSrc="/placeholder.svg?key=r0po7"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Local SEO for Grantham Businesses</h2>
              <p className="text-gray-300">
                Stand out in local search results with our specialised SEO services for Grantham businesses. We help you
                attract more local customers through targeted optimisation.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <span>Google My Business optimisation for better local visibility</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <span>Local keyword research and implementation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <span>Citation building across local directories</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <span>Location-specific content creation</span>
                </li>
              </ul>

              <Link href="/#contact">
                <MagneticButton strength={isMobile ? 20 : 40}>
                  <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white mt-4">
                    Boost Your Local Presence <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </Link>
            </AnimatedSection>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Surrounding Villages Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Web Design for Grantham and Surrounding Areas</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                We provide professional web design services not only in Grantham but also to businesses in these
                surrounding villages and towns throughout Lincolnshire and beyond.
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {granthamAreaLocations.map((location, index) => (
              <AnimatedSection
                key={location.slug}
                delay={0.1 + index * 0.05}
                className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <MapPin className="h-5 w-5 text-brand-pink mb-2" />
                  <h3 className="text-lg font-medium">{location.name}</h3>
                  <div className="mt-2 text-xs text-brand-blue">
                    <span>Web Design</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WebFuZsion for Your Grantham Business</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                We combine local knowledge with global expertise to deliver exceptional web design services for
                businesses in Grantham and beyond.
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection
              delay={0.3}
              className="bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 backdrop-blur-sm border border-white/10 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">For Local Businesses</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="h-6 w-6 text-brand-blue mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium block">Face-to-face meetings</span>
                    <span className="text-gray-300">
                      Available for in-person consultations in Grantham and surrounding areas
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="h-6 w-6 text-brand-blue mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium block">Local market knowledge</span>
                    <span className="text-gray-300">Understanding of the Lincolnshire business landscape</span>
                  </div>
                </li>
              </ul>
            </AnimatedSection>

            <AnimatedSection
              delay={0.4}
              className="bg-gradient-to-br from-brand-pink/20 to-brand-orange/20 backdrop-blur-sm border border-white/10 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">For Global Clients</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Globe className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium block">Remote collaboration</span>
                    <span className="text-gray-300">Seamless project management and communication tools</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium block">International perspective</span>
                    <span className="text-gray-300">Global design trends and best practices</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium block">Flexible scheduling</span>
                    <span className="text-gray-300">Working across time zones to meet your needs</span>
                  </div>
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl p-8 md:p-12 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Grantham Business Online?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Contact us today to discuss how we can help your Grantham-based business succeed with a professional
                website and digital presence.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#contact">
                  <MagneticButton strength={isMobile ? 20 : 40}>
                    <Button className="bg-white hover:bg-white/90 text-brand-purple text-lg px-8 py-6">
                      Get Started Today
                    </Button>
                  </MagneticButton>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
