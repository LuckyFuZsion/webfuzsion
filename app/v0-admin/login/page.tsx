"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function V0AdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin"

  useEffect(() => {
    // Simulate successful login and redirect
    const timer = setTimeout(() => {
      router.push(callbackUrl)
    }, 1500)

    return () => clearTimeout(timer)
  }, [router, callbackUrl])

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">v0 Admin Login</h1>

          <div className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg mb-4">
            Auto-login successful! Redirecting to admin area...
          </div>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-pink"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
