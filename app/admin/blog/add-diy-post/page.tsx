"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddDIYBlogPost() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const addBlogPost = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/add-diy-blog-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setMessage("✅ Blog post added successfully! You can now view it at /blog/diy-vs-professional-web-design")
      } else {
        setMessage(`❌ Error: ${data.message}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add DIY vs Professional Web Design Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Blog Post Details:</h3>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Title:</strong> DIY vs. Professional Web Design: When to Hire an Expert
              </li>
              <li>
                <strong>Slug:</strong> diy-vs-professional-web-design
              </li>
              <li>
                <strong>Category:</strong> Business Strategy
              </li>
              <li>
                <strong>Reading Time:</strong> 12 min read
              </li>
              <li>
                <strong>Author:</strong> WebFuZsion Team
              </li>
            </ul>
          </div>

          <Button onClick={addBlogPost} disabled={isLoading} className="w-full">
            {isLoading ? "Adding Blog Post..." : "Add Blog Post to Database"}
          </Button>

          {message && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>
              <strong>What this will do:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Add the blog post to your Supabase database</li>
              <li>Make it appear on your /blog page</li>
              <li>Make it accessible at /blog/diy-vs-professional-web-design</li>
              <li>Include all SEO metadata and social sharing tags</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
