import type { MetadataRoute } from "next"
import { granthamAreaLocations } from "./locations/villages"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webfuzsion.co.uk"
  const currentDate = new Date()

  // Generate location URLs
  const locationUrls = granthamAreaLocations.map((location) => ({
    url: `${baseUrl}/locations/${location.slug || location.name.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Add location names to the main Grantham page for SEO
  const granthamPageWithLocations = {
    url: `${baseUrl}/locations/grantham`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }

  // Blog posts
  const blogPosts = [
    {
      url: `${baseUrl}/blog/top-10-website-template-mistakes`,
      lastModified: new Date("2025-05-11"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/importance-of-seo-strategy`,
      lastModified: new Date("2025-05-10"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/do-businesses-need-websites-in-social-media-age`,
      lastModified: new Date("2025-05-07"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/early-bird-website-pricing-offer`,
      lastModified: new Date("2025-05-05"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/importance-of-responsive-design`,
      lastModified: new Date("2023-06-15"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/seo-tips-for-small-businesses`,
      lastModified: new Date("2023-07-22"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/website-speed-optimization`,
      lastModified: new Date("2023-08-10"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/ecommerce-design-best-practices`,
      lastModified: new Date("2023-09-05"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/content-marketing-for-web-design`,
      lastModified: new Date("2023-10-18"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/web-accessibility-guide`,
      lastModified: new Date("2023-11-30"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/local-seo-tips`,
      lastModified: new Date("2025-05-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/importance-of-business-website`,
      lastModified: new Date("2025-04-27"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/webfuzsion-launch-announcement`,
      lastModified: new Date("2025-04-28"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]

  // Services pages
  const servicesPages = [
    {
      url: `${baseUrl}/services/full-website-builds`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/landing-pages`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/redesigns`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services/maintenance`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#portfolio`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#testimonials`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    granthamPageWithLocations,
    ...locationUrls,
    ...blogPosts,
    ...servicesPages,
  ]
}
