import { NextResponse } from "next/server"
import { getDeviceBreakdown, getPageViews, getTopPages, getVisitorStats } from "@/lib/analytics-api"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const startDate = url.searchParams.get("startDate") || "7daysAgo"
    const endDate = url.searchParams.get("endDate") || "today"
    const dataType = url.searchParams.get("dataType") || "all"

    let data = {}

    switch (dataType) {
      case "pageViews":
        data = await getPageViews(startDate, endDate)
        break
      case "topPages":
        data = await getTopPages(startDate, endDate)
        break
      case "deviceBreakdown":
        data = await getDeviceBreakdown(startDate, endDate)
        break
      case "visitorStats":
        data = await getVisitorStats(startDate, endDate)
        break
      case "all":
      default:
        const [pageViews, topPages, deviceBreakdown, visitorStats] = await Promise.all([
          getPageViews(startDate, endDate),
          getTopPages(startDate, endDate),
          getDeviceBreakdown(startDate, endDate),
          getVisitorStats(startDate, endDate),
        ])
        data = {
          pageViews,
          topPages,
          deviceBreakdown,
          visitorStats,
        }
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 },
    )
  }
}
