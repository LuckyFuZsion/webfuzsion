"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedNotFound } from "./components/motion/not-found-animation"

export default function NotFound() {
  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <AnimatedNotFound />
        </div>
      </div>

      <Footer />
    </div>
  )
}
