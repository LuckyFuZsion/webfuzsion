import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock data for now to avoid execution issues
    const mockData = {
      tags: [
        {
          name: "Google Analytics",
          type: "Analytics",
          lastModified: "2023-09-15",
          modifiedBy: "Admin",
          status: "active",
          impact: "medium",
          size: "42KB",
        },
        {
          name: "Facebook Pixel",
          type: "Marketing",
          lastModified: "2023-09-10",
          modifiedBy: "Admin",
          status: "active",
          impact: "high",
          size: "56KB",
        },
        {
          name: "HotJar",
          type: "Analytics",
          lastModified: "2023-08-22",
          modifiedBy: "Admin",
          status: "paused",
          impact: "high",
          size: "78KB",
        },
      ],
      recommendations: [
        "Consolidate analytics tags to reduce redundant data collection",
        "Consider removing or optimizing HotJar due to high performance impact",
        "Update Facebook Pixel to use the latest version for better performance",
      ],
    }

    return NextResponse.json({
      success: true,
      ...mockData,
    })
  } catch (error) {
    console.error("Error in audit-scripts route:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch audit data",
        tags: [],
        recommendations: [],
      },
      { status: 500 },
    )
  }
}
