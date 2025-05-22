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

  // Custom components for ReactMarkdown to ensure proper styling
  const components = {
    h1: ({ node, ...props }: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
    p: ({ node, ...props }: any) => <p className="my-4" {...props} />,
    a: ({ node, ...props }: any) => <a className="text-blue-600 underline" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 my-4" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 my-4" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    img: ({ node, ...props }: any) => <img className="my-6 rounded-lg max-w-full" {...props} />,
    code: ({ node, inline, ...props }: any) =>
      inline ? (
        <code className="bg-gray-100 px-1 rounded" {...props} />
      ) : (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code {...props} />
        </pre>
      ),
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

        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700">{excerpt || "Blog post excerpt..."}</p>
        </div>

        <div className="blog-content">
          <ReactMarkdown components={components}>{content || "Blog post content..."}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
