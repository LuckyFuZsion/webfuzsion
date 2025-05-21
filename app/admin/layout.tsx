import type { ReactNode } from "react"
import AdminAnalyticsTracker from "@/components/admin-analytics-tracker"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdminAnalyticsTracker />
    </>
  )
}
