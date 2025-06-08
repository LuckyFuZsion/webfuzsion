"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface PricingCardProps {
  title: string
  price: string
  earlyBirdPrice?: string
  description: string
  features: string[]
  isPopular?: boolean
  gradient: string
}

export default function PricingCard({ title, price, earlyBirdPrice, description, features, isPopular, gradient }: PricingCardProps) {
  return (
    <motion.div
      className={`relative bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 ${
        isPopular ? "border-brand-pink/50 shadow-lg shadow-brand-pink/10" : "hover:border-brand-pink/30"
      } transition-all duration-300 cursor-card`}
      whileHover={{ y: -5 }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-brand-pink text-white text-sm font-medium py-1 px-3 rounded-full">
          Most Popular
        </div>
      )}
      <div className={`w-full h-1 rounded-full mb-6 ${gradient}`}></div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <div className="mb-4">
        {earlyBirdPrice ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{earlyBirdPrice}</span>
              <span className="text-lg line-through text-gray-400">{price}</span>
            </div>
            <div className="mt-1 bg-brand-pink/20 text-brand-pink text-xs font-medium py-1 px-2 rounded inline-block">
              Early Bird Offer until May 31st
            </div>
          </>
        ) : (
          <span className="text-3xl font-bold text-white">{price}</span>
        )}
      </div>
      <p className="text-gray-300 mb-6">{description}</p>
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-brand-pink mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          className={`w-full ${
            isPopular
              ? "bg-brand-pink hover:bg-brand-pink/80"
              : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
          }`}
        >
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  )
}
