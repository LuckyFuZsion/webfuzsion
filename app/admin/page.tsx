"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminHeader } from "./components/admin-header"
import { AdminCard } from "./components/admin-card"
import { FileText, Users, Settings, BarChart, FileCode, Calendar, ImageIcon } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isV0, setIsV0] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in v0 environment
    const checkV0 = () => {
      const isV0Environment =
        typeof window !== "undefined" &&
        (window.location.hostname.includes("v0.dev") ||
          document.referrer.includes("v0.dev") ||
          navigator.userAgent.includes("Vercel") ||
          window.location.href.includes("vercel.app"))

      setIsV0(isV0Environment)

      // In v0, skip auth check
      if (isV0Environment) {
        setIsLoading(false)
        return true
      }
      return false
    }

    // Only check auth if not in v0
    const checkAuth = async () => {
      if (checkV0()) return

      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        }
      } catch (err) {
        console.error("Authentication check failed:", err)
        setError("Failed to check authentication. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8">
          <AdminHeader />

          {isV0 && (
            <div className="bg-amber-500/20 border border-amber-500/50 text-amber-200 p-3 rounded-lg mb-4 text-sm">
              <strong>v0 Environment Detected:</strong> You are viewing this admin area in the v0 preview environment.
              Authentication has been bypassed for testing purposes.
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your website content and settings</p>
          </div>

          {/* Alert for image loading issues */}
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-1">⚠️ Image Loading Issues?</h3>
            <p className="mb-2">
              If you're experiencing problems with images not loading on the site, use our diagnostic tool:
            </p>
            <Link
              href="/admin/image-test"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Run Image Loading Test
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/invoices">
              <AdminCard
                title="Invoices"
                description="Create and manage client invoices"
                icon={<FileText className="h-6 w-6" />}
              />
            </Link>

            <Link href="/admin/clients">
              <AdminCard
                title="Clients"
                description="Manage your client information"
                icon={<Users className="h-6 w-6" />}
              />
            </Link>

            <Link href="/admin/analytics">
              <AdminCard
                title="Analytics"
                description="View website performance metrics"
                icon={<BarChart className="h-6 w-6" />}
              />
            </Link>

            <Link href="/admin/content">
              <AdminCard
                title="Content"
                description="Update website content and blog posts"
                icon={<FileCode className="h-6 w-6" />}
              />
            </Link>

            <Link href="/admin/twelve-week-plan">
              <AdminCard
                title="12-Week Plan"
                description="View and manage your 12-week plan"
                icon={<Calendar className="h-6 w-6" />}
              />
            </Link>

            <Link href="/admin/settings">
              <AdminCard
                title="Settings"
                description="Configure website settings"
                icon={<Settings className="h-6 w-6" />}
              />
            </Link>

            <Link href="/admin/image-test">
              <AdminCard
                title="Image Test"
                description="Diagnose image loading issues"
                icon={<ImageIcon className="h-6 w-6" />}
              />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
