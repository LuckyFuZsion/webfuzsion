"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

interface BlogPreviewProps {
  title: string
  content: string
  excerpt: string
  author: string
  image?: string
}

export default function BlogPreview({ title, content, excerpt, author, image }: BlogPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-8 text-center">Loading preview...</div>
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden shadow">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{title || "Blog Post Title"}</h1>

        <div className="flex items-center text-sm text-gray-600 mb-6">
          <span>By {author || "Author"}</span>
          <span className="mx-2">•</span>
          <span>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        {image && (
          <div className="mb-6">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/blog-post-image.png"
              }}
            />
          </div>
        )}

        <div className="prose max-w-none mb-6">
          <p className="text-lg font-medium text-gray-700">{excerpt || "Blog post excerpt..."}</p>
        </div>

        <div className="prose prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:my-4 prose-a:text-blue-600 prose-a:underline prose-img:rounded-lg prose-img:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 max-w-none">
          <ReactMarkdown>{content || "Blog post content..."}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
