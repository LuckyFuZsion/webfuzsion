import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { mkdir, writeFile, access, constants } from "fs/promises"

export async function GET() {
  const results: { test: string; result: string; success: boolean }[] = []

  try {
    // Test 1: Check if we can access the app directory
    try {
      const appDir = path.join(process.cwd(), "app")
      await access(appDir, constants.R_OK)
      results.push({
        test: "Access app directory",
        result: `Success: Can access ${appDir}`,
        success: true,
      })
    } catch (error) {
      results.push({
        test: "Access app directory",
        result: `Error: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      })
    }

    // Test 2: Check if we can access the blog directory
    try {
      const blogDir = path.join(process.cwd(), "app/blog")
      await access(blogDir, constants.R_OK)
      results.push({
        test: "Access blog directory",
        result: `Success: Can access ${blogDir}`,
        success: true,
      })
    } catch (error) {
      results.push({
        test: "Access blog directory",
        result: `Error: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      })
    }

    // Test 3: Check if we can write to the blog directory
    try {
      const testDir = path.join(process.cwd(), "app/blog/test-debug")
      await mkdir(testDir, { recursive: true })
      results.push({
        test: "Create directory in blog",
        result: `Success: Created ${testDir}`,
        success: true,
      })

      // Test 4: Check if we can write a file
      try {
        const testFile = path.join(testDir, "test.txt")
        await writeFile(testFile, "This is a test file")
        results.push({
          test: "Write file in blog directory",
          result: `Success: Wrote to ${testFile}`,
          success: true,
        })

        // Clean up
        try {
          await fs.unlink(testFile)
          await fs.rmdir(testDir)
          results.push({
            test: "Clean up test files",
            result: "Success: Removed test files",
            success: true,
          })
        } catch (error) {
          results.push({
            test: "Clean up test files",
            result: `Warning: ${error instanceof Error ? error.message : String(error)}`,
            success: false,
          })
        }
      } catch (error) {
        results.push({
          test: "Write file in blog directory",
          result: `Error: ${error instanceof Error ? error.message : String(error)}`,
          success: false,
        })
      }
    } catch (error) {
      results.push({
        test: "Create directory in blog",
        result: `Error: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      })
    }

    // Test 5: Check environment
    results.push({
      test: "Environment",
      result: `NODE_ENV: ${process.env.NODE_ENV}\nVercel: ${process.env.VERCEL ? "Yes" : "No"}`,
      success: true,
    })

    // Test 6: Check current working directory
    results.push({
      test: "Current working directory",
      result: process.cwd(),
      success: true,
    })

    // Test 7: List files in blog directory
    try {
      const blogDir = path.join(process.cwd(), "app/blog")
      const files = await fs.readdir(blogDir)
      results.push({
        test: "List blog directory",
        result: `Files: ${files.join(", ")}`,
        success: true,
      })
    } catch (error) {
      results.push({
        test: "List blog directory",
        result: `Error: ${error instanceof Error ? error.message : String(error)}`,
        success: false,
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json(
      {
        results: [
          {
            test: "Overall test execution",
            result: `Error: ${error instanceof Error ? error.message : String(error)}`,
            success: false,
          },
        ],
      },
      { status: 500 },
    )
  }
}
