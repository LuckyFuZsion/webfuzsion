"use client"

import Link from "next/link"
import Image from "next/image"

interface BlogPostCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    date: string
    author: string
    image: string
    category: string
    reading_time: string
  }
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-brand-pink/50 transition-all duration-300 hover:transform hover:scale-105">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            className="group-hover:scale-110 transition-transform duration-500"
            priority={post.slug === "diy-vs-professional-web-design"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="text-gray-400">{post.date}</span>
            <span className="text-brand-pink font-medium">{post.reading_time}</span>
          </div>

          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-pink transition-colors duration-300 line-clamp-2">
            {post.title}
          </h2>

          <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{post.author}</span>
            <span className="bg-brand-pink/20 text-brand-pink text-xs px-3 py-1 rounded-full border border-brand-pink/30">
              {post.category || "Uncategorized"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
} 