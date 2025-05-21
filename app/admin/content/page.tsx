"use client"

import { AdminHeader } from "../components/admin-header"
import { V0EnvironmentNotice } from "../components/v0-environment-notice"

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <AdminHeader />
        <V0EnvironmentNotice />

        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-4">Content Management</h1>
          <p className="text-gray-300 mb-8">Update website content and blog posts</p>

          <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
            <p className="text-gray-400">This feature is currently under development.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
