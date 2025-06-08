"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckBlogPostPage() {
  const [slug, setSlug] = useState("test")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkBlogPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/debug/check-blog-post?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error:", error)
      setResult({ success: false, error: "Failed to check blog post" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Check Blog Post</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search for Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter blog post slug"
              className="flex-1"
            />
            <Button onClick={checkBlogPost} disabled={loading}>
              {loading ? "Checking..." : "Check Post"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </CardContent>
          </Card>

          {result.allPosts && result.allPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Blog Posts in Database ({result.totalPosts})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.allPosts.map((post: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <strong>{post.title}</strong>
                        <br />
                        <span className="text-sm text-gray-600">Slug: {post.slug}</span>
                      </div>
                      <span className="text-xs text-gray-500">{post.created_at}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
