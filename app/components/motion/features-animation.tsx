"use client"

import { motion } from "framer-motion"
import { AnimatedSection } from "@/components/animated-section"

export function AnimatedFeatures() {
  const features = [
    {
      title: "Responsive Design",
      description: "Your website will look great on all devices, from mobile phones to desktop computers.",
      icon: "📱"
    },
    {
      title: "SEO Optimized",
      description: "Built with search engines in mind to help your business rank higher in search results.",
      icon: "🔍"
    },
    {
      title: "Fast Performance",
      description: "Optimized for speed to provide the best user experience and keep visitors engaged.",
      icon: "⚡"
    }
  ]

  return (
    <section id="features" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title} delay={0.2 * index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
