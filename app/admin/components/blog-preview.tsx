"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

interface BlogPreviewProps {
  title: string
  content: string
  excerpt: string
  author: string
  image: string
}

export default function BlogPreview({ title, content, excerpt, author, image }: BlogPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h3 className="text-lg font-semibold">Preview</h3>
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{title || "Blog Title"}</h1>

        {image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-64 object-cover" />
          </div>
        )}

        <div className="mb-6 text-gray-600">
          <p className="italic">{excerpt || "Blog excerpt will appear here..."}</p>
          <p className="mt-2">
            By {author || "Author"} • {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose max-w-none">
          <ReactMarkdown>{content || "Blog content will appear here..."}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
