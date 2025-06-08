"use client"

import { motion } from "framer-motion"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"

export function AnimatedServices() {
  const services = [
    {
      title: "Website Design",
      description: "Custom, responsive websites that look great on all devices.",
      link: "/services/website-design"
    },
    {
      title: "E-commerce Solutions",
      description: "Powerful online stores that drive sales and growth.",
      link: "/services/ecommerce"
    },
    {
      title: "SEO & Marketing",
      description: "Get found online and attract more customers to your business.",
      link: "/services/seo"
    }
  ]

  return (
    <section id="services" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={0.2 * index}>
              <Link href={service.link}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full"
                >
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
