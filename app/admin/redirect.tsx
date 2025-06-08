"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Always redirect to login first
    router.push("/admin/login")
  }, [router])

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
    </div>
  )
}
