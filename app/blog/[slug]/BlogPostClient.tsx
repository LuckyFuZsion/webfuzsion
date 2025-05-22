"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import { ClientMotionDiv, ClientMotionH1 } from "../../components/motion/client-motion"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { BlogSocialShare } from "@/components/blog-social-share"
import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { BlogPost } from "../types"
import { formatDate } from "../utils"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface BlogPost {
  title: string
  date: string
  author: string
  readTime: string
  category: string
  imageUrl: string
  content: string
}

interface BlogPostClientProps {
  post?: BlogPost
  blogPost?: BlogPost
  slug: string
}

export default function BlogPostClient({ post, blogPost, slug }: BlogPostClientProps) {
  // Support both prop names (post and blogPost)
  const blogData = post || blogPost

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  if (!blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-6">The blog post you're looking for doesn't exist or has been moved.</p>
          <Link
            href="/blog"
            className="inline-block bg-brand-blue px-6 py-2 rounded-md hover:bg-brand-blue/80 transition-colors"
          >
            Return to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      {/* Blog Post Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div>
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-brand-blue hover:text-brand-pink transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Blog</span>
          </Link>

          {/* Blog Post Header */}
          <div className="mb-8">
            <ClientMotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium mb-3"
            >
              <span>{blogData.category}</span>
            </ClientMotionDiv>

            <ClientMotionH1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              {blogData.title}
            </ClientMotionH1>

            <ClientMotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center text-sm text-gray-400 gap-4"
            >
              <span>{blogData.date}</span>
              <span>•</span>
              <span>{blogData.author}</span>
              <span>•</span>
              <span>{blogData.readTime}</span>
            </ClientMotionDiv>
          </div>

          {/* Featured Image */}
          <ClientMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-10"
          >
            <Image
              src={blogData.imageUrl || "/placeholder.svg"}
              alt={blogData.title || "Blog post featured image"}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </ClientMotionDiv>

          {/* Blog Content */}
          <ClientMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="prose prose-lg prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          ></ClientMotionDiv>

          {/* Social Share Buttons */}
          <BlogSocialShare title={blogData.title} url={`https://webfuzsion.co.uk/blog/${slug}`} />
        </div>
      </div>

      <Footer />
    </div>
  )
}
