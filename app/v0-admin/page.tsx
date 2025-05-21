"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function V0AdminEntry() {
  const router = useRouter()

  useEffect(() => {
    // Automatically redirect to the admin dashboard
    router.push("/admin")
  }, [router])

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">v0 Admin Access</h1>
          <p className="text-center mb-4">Redirecting to admin dashboard...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-pink"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
