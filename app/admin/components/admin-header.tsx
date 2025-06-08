"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, Menu, X } from "lucide-react"

export function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center text-white hover:text-brand-pink transition-colors">
          <Home className="h-5 w-5 mr-2" />
          <span>Back to Website</span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-brand-pink transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/admin" className="text-white hover:text-brand-pink transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/invoices" className="text-white hover:text-brand-pink transition-colors">
            Invoices
          </Link>
          <Link href="/admin/twelve-week-plan" className="text-white hover:text-brand-pink transition-colors">
            12-Week Plan
          </Link>
          <Link href="/admin/social-media-guide" className="text-white hover:text-brand-pink transition-colors">
            Social Media Guide
          </Link>
          <button onClick={handleLogout} className="text-white hover:text-brand-pink transition-colors">
            Logout
          </button>
        </nav>
      </div>

      {isMenuOpen && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg md:hidden">
          <nav className="flex flex-col space-y-3">
            <Link href="/admin" className="text-white hover:text-brand-pink transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/invoices" className="text-white hover:text-brand-pink transition-colors">
              Invoices
            </Link>
            <Link href="/admin/twelve-week-plan" className="text-white hover:text-brand-pink transition-colors">
              12-Week Plan
            </Link>
            <Link href="/admin/social-media-guide" className="text-white hover:text-brand-pink transition-colors">
              Social Media Guide
            </Link>
            <button onClick={handleLogout} className="text-white hover:text-brand-pink transition-colors text-left">
              Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
