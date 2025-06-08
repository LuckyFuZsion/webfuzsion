"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { TextReveal } from "@/components/text-reveal"
import { AnimatedSection } from "@/components/animated-section"

export function AnimatedHero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative z-10 pt-24 pb-12">
      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4"
      >
        <div className="text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-block bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium mb-3">
              <span>Web Design & Development</span>
            </div>
          </AnimatedSection>

          <TextReveal direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Transform Your Online Presence with Professional Web Design
            </h1>
          </TextReveal>

          <TextReveal direction="up" delay={0.4}>
            <p className="text-lg text-gray-300 mb-8">
              We create stunning, high-performance websites that help businesses grow and succeed in the digital world.
            </p>
          </TextReveal>

          <AnimatedSection delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white px-8 py-3 rounded-md transition-colors"
              >
                Get Started
              </a>
              <a
                href="#services"
                className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-md transition-colors"
              >
                Our Services
              </a>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  )
}
