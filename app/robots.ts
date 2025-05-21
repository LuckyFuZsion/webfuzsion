import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webfuzsion.co.uk"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/v0-admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
