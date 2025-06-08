"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogSocialShare } from "@/components/blog-social-share"

interface BlogPostProps {
  blogPost: {
    title: string
    date: string
    author: string
    readTime: string
    category: string
    imageUrl: string
    content: string
    tags?: string[]
    excerpt?: string
  }
  slug: string
}

export default function BlogPostClient({ blogPost, slug }: BlogPostProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="bg-brand-dark min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-brand-dark via-brand-dark to-purple-900">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-brand-pink hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{blogPost.title}</h1>

              {/* Author Info with Picture */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
                  <div className="relative w-12 h-12 mr-4">
                    <Image
                      src="/images/webfuzsion-logo.png"
                      alt="WebFuZsion Team"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">{blogPost.author}</div>
                    <div className="text-gray-400 text-sm">Web Design Expert</div>
                  </div>
                </div>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center text-gray-300 text-sm gap-6 mb-8">
                <div className="flex items-center bg-gray-800/30 rounded-full px-4 py-2">
                  <Calendar className="h-4 w-4 mr-2 text-brand-pink" />
                  <span>{blogPost.date}</span>
                </div>

                <div className="flex items-center bg-gray-800/30 rounded-full px-4 py-2">
                  <Clock className="h-4 w-4 mr-2 text-brand-pink" />
                  <span>{blogPost.readTime}</span>
                </div>

                <div className="flex items-center bg-gray-800/30 rounded-full px-4 py-2">
                  <Tag className="h-4 w-4 mr-2 text-brand-pink" />
                  <span>{blogPost.category}</span>
                </div>
              </div>
            </header>

            {/* Featured image */}
            {blogPost.imageUrl && (
              <div className="mb-12 relative h-64 md:h-96 rounded-xl overflow-hidden border border-gray-700/50">
                <Image
                  src="https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Opengraph-LTuWN7l8ecvsZc73ZO51pjs0Rn03AN.png"
                  alt={blogPost.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            )}
          </article>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            {/* Content */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-gray-700/50 mb-12">
              <div
                className="blog-content prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-brand-pink prose-a:text-brand-pink prose-a:no-underline hover:prose-a:underline prose-blockquote:border-brand-pink prose-blockquote:text-gray-300 prose-li:text-gray-300"
                dangerouslySetInnerHTML={{ 
                  __html: blogPost.content.replace(/<div class="blog-content">|<\/div>/g, '')
                }}
              />
            </div>

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-brand-pink" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-brand-pink/20 text-brand-pink px-4 py-2 rounded-full text-sm border border-brand-pink/30 hover:bg-brand-pink/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Sharing */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <BlogSocialShare url={`https://webfuzsion.co.uk/blog/${slug}`} title={blogPost.title} />
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  )
}
