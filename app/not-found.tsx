"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientMotionDiv } from "./components/motion/client-motion"
import Link from "next/link"

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
          <ClientMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-300 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
              href="/"
              className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white px-6 py-3 rounded-md transition-colors"
            >
              Return Home
            </Link>
          </ClientMotionDiv>
        </div>
      </div>

      <Footer />
    </div>
  )
} 