"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { TextReveal } from "@/components/text-reveal"
import { AnimatedSection } from "@/components/animated-section"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  index: number
}

const FAQItem = ({ question, answer, isOpen, onClick, index }: FAQItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="border-b border-white/10 last:border-b-0 dark:border-gray-700/30"
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full py-5 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-medium text-white dark:text-white">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <Minus className="h-5 w-5 text-brand-pink dark:text-brand-pink" />
          ) : (
            <Plus className="h-5 w-5 text-brand-pink dark:text-brand-pink" />
          )}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-5 text-gray-300 dark:text-gray-300">{answer}</div>
      </motion.div>
    </motion.div>
  )
}

export function FAQSection({ disableOnFastScroll = false }: { disableOnFastScroll?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How much does a website cost?",
      answer:
        "Our website packages start from £500 for a starter site. The final cost depends on your specific requirements, number of pages, and functionality needed. We offer transparent pricing with no hidden fees.",
    },
    {
      question: "How long does it take to build a website?",
      answer:
        "Most standard websites take 2-4 weeks from concept to launch. More complex projects with custom functionality may take 4-8 weeks. We'll provide you with a specific timeline during our initial consultation.",
    },
    {
      question: "Do you work with clients outside of Grantham?",
      answer:
        "Yes! While we're based in Grantham, Lincolnshire, we work with clients globally. We use video calls, email, and project management tools to collaborate effectively with clients anywhere in the world.",
    },
    {
      question: "Will my website work on mobile devices?",
      answer:
        "Absolutely. All our websites are fully responsive and optimized for all devices including smartphones, tablets, laptops, and desktop computers. We test extensively across multiple device types and screen sizes.",
    },
    {
      question: "Do you offer website maintenance services?",
      answer:
        "Yes, we offer ongoing maintenance packages to keep your website secure, updated, and performing optimally. Our maintenance services include regular updates, security monitoring, backups, and technical support.",
    },
    {
      question: "Can you help with SEO for my website?",
      answer:
        "Yes, all our websites are built with SEO best practices in mind. We also offer additional SEO services including keyword research, on-page optimization, content creation, and local SEO to help improve your search engine rankings.",
    },
  ]

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-12 relative section-anchor" data-section-color="purple-pink">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-8" disableOnFastScroll={disableOnFastScroll}>
          <TextReveal disableOnFastScroll={disableOnFastScroll}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </TextReveal>
          <TextReveal delay={0.2} disableOnFastScroll={disableOnFastScroll}>
            <p className="text-gray-300">
              Have questions about our web design services? Find answers to common questions below.
            </p>
          </TextReveal>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 dark:bg-gray-800/50 dark:border-gray-700/50">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[100px] -z-10 dark:bg-brand-purple/5"></div>
    </section>
  )
}
