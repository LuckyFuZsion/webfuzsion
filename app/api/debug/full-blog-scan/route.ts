import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const results: any = {
      success: true,
      scans: {},
    }

    // Check multiple possible locations
    const possiblePaths = [
      path.join(process.cwd(), "app", "blog"),
      path.join(process.cwd(), "src", "app", "blog"),
      path.join(process.cwd(), "blog"),
      path.join(process.cwd(), "content", "blog"),
      path.join(process.cwd(), "posts"),
    ]

    for (const blogPath of possiblePaths) {
      try {
        if (fs.existsSync(blogPath)) {
          const entries = fs.readdirSync(blogPath, { withFileTypes: true })
          results.scans[blogPath] = {
            exists: true,
            entries: entries.map((entry) => ({
              name: entry.name,
              isDirectory: entry.isDirectory(),
              isFile: entry.isFile(),
            })),
          }
        } else {
          results.scans[blogPath] = {
            exists: false,
          }
        }
      } catch (error) {
        results.scans[blogPath] = {
          exists: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    // Also check the root directory structure
    try {
      const rootEntries = fs.readdirSync(process.cwd(), { withFileTypes: true })
      results.rootDirectory = {
        path: process.cwd(),
        entries: rootEntries
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .slice(0, 20), // Limit to first 20 directories
      }
    } catch (error) {
      results.rootDirectory = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // Check app directory structure
    try {
      const appPath = path.join(process.cwd(), "app")
      if (fs.existsSync(appPath)) {
        const appEntries = fs.readdirSync(appPath, { withFileTypes: true })
        results.appDirectory = {
          path: appPath,
          entries: appEntries.map((entry) => ({
            name: entry.name,
            isDirectory: entry.isDirectory(),
          })),
        }
      }
    } catch (error) {
      results.appDirectory = {
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
