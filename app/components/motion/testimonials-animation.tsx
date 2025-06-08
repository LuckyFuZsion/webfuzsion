"use client"

import { motion } from "framer-motion"
import { AnimatedSection } from "@/components/animated-section"

export function AnimatedTestimonials() {
  const testimonials = [
    {
      quote: "WebFuZsion transformed our online presence. Our new website has helped us attract more customers than ever before.",
      author: "Sarah Johnson",
      role: "Owner, Local Business"
    },
    {
      quote: "Professional, responsive, and delivered exactly what we needed. Highly recommended!",
      author: "Michael Brown",
      role: "CEO, Tech Startup"
    },
    {
      quote: "The team at WebFuZsion made the entire process smooth and enjoyable. Our new website looks amazing!",
      author: "Emma Wilson",
      role: "Marketing Director"
    }
  ]

  return (
    <section id="testimonials" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.author} delay={0.2 * index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
              >
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
