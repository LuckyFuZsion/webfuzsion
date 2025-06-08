"use client"

import { useEffect, useState } from "react"
import DateRangeSelector from "../components/date-range-selector"
import StatsCard from "../components/stats-card"
import AnalyticsChart from "../components/analytics-chart"
import { Users, Eye, Clock, RefreshCw, AlertTriangle } from "lucide-react"

interface AnalyticsData {
  pageViews: {
    labels: string[]
    data: number[]
  }
  topPages: Array<{
    path: string
    views: number
  }>
  deviceBreakdown: {
    labels: string[]
    data: number[]
  }
  visitorStats: {
    activeUsers: number
    newUsers: number
    pageViews: number
    avgEngagementTime: number
  }
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7days")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if we're in preview mode (v0)
      if (typeof window !== "undefined" && window.location.hostname.includes("vercel-v0.app")) {
        setIsPreviewMode(true)
        // Use mock data in preview mode
        setData({
          pageViews: {
            labels: ["05/01", "05/02", "05/03", "05/04", "05/05", "05/06", "05/07"],
            data: [120, 145, 132, 167, 189, 176, 210],
          },
          topPages: [
            { path: "/", views: 450 },
            { path: "/blog/importance-of-seo-strategy", views: 230 },
            { path: "/services/web-design", views: 180 },
            { path: "/blog/do-businesses-still-need-websites", views: 120 },
            { path: "/contact", views: 95 },
          ],
          deviceBreakdown: {
            labels: ["Desktop", "Mobile", "Tablet"],
            data: [45, 48, 7],
          },
          visitorStats: {
            activeUsers: 1250,
            newUsers: 780,
            pageViews: 3450,
            avgEngagementTime: 125, // seconds
          },
        })
        setIsLoading(false)
        return
      }

      let startDate = "7daysAgo"
      let endDate = "today"

      switch (dateRange) {
        case "30days":
          startDate = "30daysAgo"
          break
        case "90days":
          startDate = "90daysAgo"
          break
        case "thisMonth":
          startDate = "firstDayOfMonth"
          break
        case "lastMonth":
          startDate = "firstDayOfLastMonth"
          endDate = "lastDayOfLastMonth"
          break
        case "thisYear":
          startDate = "firstDayOfYear"
          break
      }

      const response = await fetch(`/api/admin/analytics?startDate=${startDate}&endDate=${endDate}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch analytics data")
      }

      const result = await response.json()
      setData(result.data)
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError((err as Error).message || "Failed to fetch analytics data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <DateRangeSelector selectedRange={dateRange} onRangeChange={setDateRange} />
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-2 flex items-center text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Try Again
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Verify that your Google service account is properly set up</li>
            <li>Check that the service account has access to your Google Analytics property</li>
            <li>Ensure your environment variables are correctly formatted</li>
            <li>Confirm that the Google Analytics Data API is enabled in your Google Cloud project</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {isPreviewMode && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Preview Mode</h3>
            <p className="text-sm text-yellow-700">
              You're viewing mock analytics data for preview purposes. Real analytics data will be available in the
              deployed version.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
          <DateRangeSelector selectedRange={dateRange} onRangeChange={setDateRange} />
          <button
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                </div>
                <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full h-12 w-12"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Visitors"
            value={data?.visitorStats.activeUsers || 0}
            icon={<Users className="w-6 h-6 text-blue-500" />}
          />
          <StatsCard
            title="New Users"
            value={data?.visitorStats.newUsers || 0}
            icon={<Users className="w-6 h-6 text-green-500" />}
          />
          <StatsCard
            title="Page Views"
            value={data?.visitorStats.pageViews || 0}
            icon={<Eye className="w-6 h-6 text-purple-500" />}
          />
          <StatsCard
            title="Avg. Session Duration"
            value={formatTime(data?.visitorStats.avgEngagementTime || 0)}
            icon={<Clock className="w-6 h-6 text-orange-500" />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {isLoading && !data ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AnalyticsChart type="line" data={data?.pageViews || { labels: [], data: [] }} title="Page Views" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <AnalyticsChart
                type="doughnut"
                data={data?.deviceBreakdown || { labels: [], data: [] }}
                title="Device Breakdown"
                colors={["#3b82f6", "#10b981", "#f59e0b"]}
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">Top Pages</h2>
        {isLoading && !data ? (
          <div className="animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        ) : data?.topPages && data.topPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 font-medium">Page</th>
                  <th className="pb-2 font-medium text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((page, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 truncate max-w-[300px]" title={page.path}>
                      {page.path}
                    </td>
                    <td className="py-3 text-right">{page.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No page view data available.</p>
        )}
      </div>
    </div>
  )
}
