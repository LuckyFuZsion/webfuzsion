import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type React from "react"

// This is a dynamic layout for blog posts
// It will generate metadata for each blog post based on the slug
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // For these blog posts, we'll return empty object to let the page define its own metadata
  if (params.slug === "importance-of-seo-strategy" || params.slug === "top-10-website-template-mistakes") {
    return {}
  }

  // For other blog posts, generate metadata based on the slug
  // This is just a placeholder - in a real app, you'd fetch this data from a CMS or API
  const title = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return {
    title: `${title} | WebFuZsion Blog`,
    description: `Read our blog post about ${title.toLowerCase()} and learn more about web design and digital marketing.`,
    openGraph: {
      title: `${title} | WebFuZsion Blog`,
      description: `Read our blog post about ${title.toLowerCase()} and learn more about web design and digital marketing.`,
      type: "article",
    },
  }
}

export default function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  // List of valid blog slugs
  const validSlugs = [
    "do-businesses-still-need-websites",
    "early-bird-website-pricing-offer",
    "importance-of-seo-strategy",
    "top-10-website-template-mistakes",
    "local-seo-tips",
    "webfuzsion-launch-announcement",
    "importance-of-business-website",
    "importance-of-responsive-design",
    "seo-tips-for-small-businesses",
    "website-speed-optimization",
    "ecommerce-design-best-practices",
    "content-marketing-for-web-design",
    "web-accessibility-guide",
    // Add other valid blog slugs here
  ]

  // Check if the slug is valid
  if (!validSlugs.includes(params.slug)) {
    notFound()
  }

  return <>{children}</>
}
