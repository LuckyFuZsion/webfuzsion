"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { MagneticButton } from "@/components/magnetic-button"
import { TextReveal } from "@/components/text-reveal"
import { AnimatedSection } from "@/components/animated-section"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import Image from "next/image"

// Service data
const services = {
  "full-website-builds": {
    title: "Full Website Builds",
    description: "Complete website design and development from concept to launch, tailored to your business needs.",
    metaTitle: "Professional Website Design & Development in Grantham | WebFuZsion",
    metaDescription:
      "Complete website design and development services in Grantham. Custom websites built from concept to launch, tailored to your business needs.",
    keywords:
      "website design Grantham, web development Lincolnshire, custom website build, professional website design, business website creation",
    image: "/responsive-devices-showcase.png",
    features: [
      "Custom design tailored to your brand",
      "Mobile-responsive layout",
      "SEO optimization",
      "Contact forms and integrations",
      "Social media integration",
      "Content management system (if required)",
      "Analytics setup",
      "Training and documentation",
    ],
    price: "From £500",
    earlyBirdPrice: "From £300 (Limited Time)",
    timeframe: "2-4 weeks",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
  "landing-pages": {
    title: "Landing Pages",
    description: "High-converting landing pages designed to capture leads and drive customer action.",
    metaTitle: "High-Converting Landing Page Design in Grantham | WebFuZsion",
    metaDescription:
      "Professional landing page design services in Grantham. Create high-converting landing pages that capture leads and drive customer action.",
    keywords:
      "landing page design Grantham, lead generation pages, conversion-focused web design, landing page development Lincolnshire",
    image: "/modern-ecommerce-checkout.png",
    features: [
      "Conversion-focused design",
      "Clear call-to-action elements",
      "Mobile optimization",
      "A/B testing capability",
      "Lead capture forms",
      "Integration with marketing tools",
      "Fast loading speed",
      "Analytics tracking",
    ],
    price: "From £300",
    earlyBirdPrice: "From £200 (Limited Time)",
    timeframe: "1-2 weeks",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
  redesigns: {
    title: "Website Redesigns",
    description: "Transform your outdated website into a modern, user-friendly digital experience.",
    metaTitle: "Website Redesign Services in Grantham | Modern Web Design | WebFuZsion",
    metaDescription:
      "Transform your outdated website into a modern, user-friendly digital experience. Professional website redesign services in Grantham and Lincolnshire.",
    keywords:
      "website redesign Grantham, website refresh, modern web design, website update Lincolnshire, website modernization",
    image: "/content-web-integration.png",
    features: [
      "Modern, updated design",
      "Improved user experience",
      "Mobile responsiveness",
      "Enhanced SEO structure",
      "Faster loading speeds",
      "Updated content and imagery",
      "Improved navigation",
      "New functionality integration",
    ],
    price: "From £400",
    earlyBirdPrice: "From £300 (Limited Time)",
    timeframe: "2-3 weeks",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
  maintenance: {
    title: "Website Maintenance",
    description: "Keep your website secure, updated, and performing at its best with our maintenance services.",
    metaTitle: "Website Maintenance Services in Grantham | WebFuZsion",
    metaDescription:
      "Professional website maintenance services in Grantham. Keep your website secure, updated, and performing at its best with our comprehensive maintenance packages.",
    keywords:
      "website maintenance Grantham, website updates, website security, website support Lincolnshire, website care plans",
    image: "/website-speed-metrics-dashboard.png",
    features: [
      "Regular software updates",
      "Security monitoring",
      "Performance optimization",
      "Regular backups",
      "Content updates",
      "Technical support",
      "Monthly reports",
      "SEO monitoring",
    ],
    price: "From £100/month",
    earlyBirdPrice: "From £75/month (Limited Time)",
    timeframe: "Ongoing",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
}

export default function ServicePageClient({ params }: { params: { service: string } }) {
  const { isMobile } = useMobile()
  const serviceSlug = params.service

  // Find the service data
  const serviceData = services[serviceSlug as keyof typeof services]

  // If service not found, use default content
  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <p className="mb-6">The service you're looking for doesn't exist or has been moved.</p>
          <Link href="/#services">
            <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white">View All Services</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
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
                <span>Web Design Services</span>
              </motion.div>

              <TextReveal direction="up" delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{serviceData.title}</h1>
              </TextReveal>

              <TextReveal direction="up" delay={0.4}>
                <p className="text-xl text-gray-300">
                  {serviceData.description} Available in Grantham and across Lincolnshire.
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
              <div className="relative h-[300px] w-full rounded-xl overflow-hidden">
                <Image
                  src={serviceData.image || "/placeholder.svg"}
                  alt={`${serviceData.title} - Web design services in Grantham, Lincolnshire`}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-pink/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Included</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                Our {serviceData.title.toLowerCase()} service includes everything you need for a successful online
                presence.
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceData.features.map((feature, index) => (
              <AnimatedSection
                key={index}
                delay={0.2 + index * 0.1}
                className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-brand-pink mr-3 flex-shrink-0 mt-1" />
                  <p>{feature}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative bg-gradient-to-b from-transparent to-brand-dark/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-12">
            <AnimatedSection className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
              <p className="text-gray-300">Transparent pricing with no hidden fees.</p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection delay={0.2} className="space-y-4">
                <div className="bg-brand-dark/70 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-bold mb-2">Regular Price</h3>
                  <p className="text-3xl font-bold text-brand-blue">{serviceData.price}</p>
                  <p className="text-gray-400 mt-2">Timeframe: {serviceData.timeframe}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3} className="space-y-4">
                <div className="bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 rounded-lg p-6 border border-brand-pink/30">
                  <h3 className="text-xl font-bold mb-2">Early Bird Offer</h3>
                  <p className="text-3xl font-bold text-brand-pink">{serviceData.earlyBirdPrice}</p>
                  <p className="text-gray-400 mt-2">Limited time offer - Book before May 31, 2025</p>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection delay={0.4} className="mt-8 text-center">
              <Link href="/#contact">
                <MagneticButton strength={isMobile ? 20 : 40}>
                  <Button className="bg-brand-pink hover:bg-brand-pink/80 text-white px-8 py-6">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </MagneticButton>
              </Link>
            </AnimatedSection>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[100px] -z-10"></div>
      </section>

      {/* Local Areas Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <TextReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Areas We Serve</h2>
            </TextReveal>
            <TextReveal delay={0.2}>
              <p className="text-gray-300">
                We provide {serviceData.title.toLowerCase()} services in Grantham and throughout Lincolnshire,
                including:
              </p>
            </TextReveal>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {serviceData.localAreas.map((area, index) => (
                <AnimatedSection
                  key={index}
                  delay={0.2 + index * 0.05}
                  className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                >
                  <p className="font-medium">{area}</p>
                </AnimatedSection>
              ))}
              <AnimatedSection
                delay={0.2 + serviceData.localAreas.length * 0.05}
                className="bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center col-span-2 md:col-span-3 lg:col-span-4"
              >
                <p className="font-medium">And all surrounding villages in Lincolnshire</p>
              </AnimatedSection>
            </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your {serviceData.title.toLowerCase()} needs and get a personalized quote.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/#contact">
                  <MagneticButton strength={isMobile ? 20 : 40}>
                    <Button className="bg-white hover:bg-white/90 text-brand-purple text-lg px-8 py-6">
                      Contact Us Today
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
