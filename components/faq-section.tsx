"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  itemsPerPage?: number
}

export default function FAQSection({ items, itemsPerPage = 5 }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [visibleItems, setVisibleItems] = useState(itemsPerPage)
  const [expanded, setExpanded] = useState(false)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const loadMore = () => {
    setVisibleItems(items.length)
    setExpanded(true)
  }

  const showLess = () => {
    setVisibleItems(itemsPerPage)
    setExpanded(false)
    // If the open item will be hidden, close it
    if (openIndex !== null && openIndex >= itemsPerPage) {
      setOpenIndex(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {items.slice(0, visibleItems).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-lg font-medium text-white">{item.question}</h3>
              <ChevronDown
                className={`h-5 w-5 text-brand-pink transition-transform duration-300 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-gray-300 border-t border-white/10">{item.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {items.length > itemsPerPage && (
        <div className="mt-8 text-center">
          {!expanded ? (
            <motion.button
              onClick={loadMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-pink hover:bg-brand-pink/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Load More Questions
            </motion.button>
          ) : (
            <motion.button
              onClick={showLess}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-dark hover:bg-brand-dark/80 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-brand-pink/50"
            >
              Show Less
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}
