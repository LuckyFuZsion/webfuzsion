import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface RelatedContentProps {
  type: "blog" | "service" | "location"
  currentSlug?: string
  title: string
  limit?: number
}

export function RelatedContent({ type, currentSlug, title, limit = 3 }: RelatedContentProps) {
  // Blog posts data
  const blogPosts = [
    {
      slug: "local-seo-tips",
      title: "10 Easy Ways to Improve Your Website's SEO and Attract Local Customers",
    },
    {
      slug: "importance-of-business-website",
      title: "The Importance of Having a Business Website",
    },
    {
      slug: "importance-of-responsive-design",
      title: "The Importance of Responsive Design in 2025",
    },
    {
      slug: "seo-tips-for-small-businesses",
      title: "10 SEO Tips for Small Businesses in Grantham",
    },
    {
      slug: "website-speed-optimization",
      title: "How to Optimize Your Website Speed for Better Performance",
    },
    {
      slug: "ecommerce-design-best-practices",
      title: "E-commerce Design Best Practices for Higher Conversions",
    },
    {
      slug: "content-marketing-for-web-design",
      title: "How Content Marketing Complements Your Web Design",
    },
    {
      slug: "web-accessibility-guide",
      title: "A Comprehensive Guide to Web Accessibility",
    },
    {
      slug: "early-bird-website-pricing-offer",
      title: "Limited Time Early Bird Offer: Save Up to £300 on Professional Website Design",
    },
  ]

  // Services data
  const services = [
    {
      slug: "full-website-builds",
      title: "Full Website Builds",
    },
    {
      slug: "landing-pages",
      title: "Landing Pages",
    },
    {
      slug: "redesigns",
      title: "Website Redesigns",
    },
    {
      slug: "maintenance",
      title: "Website Maintenance",
    },
  ]

  // Locations data
  const locations = [
    {
      slug: "grantham",
      title: "Grantham",
    },
    {
      slug: "stamford",
      title: "Stamford",
    },
    {
      slug: "bourne",
      title: "Bourne",
    },
    {
      slug: "sleaford",
      title: "Sleaford",
    },
    {
      slug: "newark",
      title: "Newark-on-Trent",
    },
    {
      slug: "melton-mowbray",
      title: "Melton Mowbray",
    },
    {
      slug: "oakham",
      title: "Oakham",
    },
    {
      slug: "corby-glen",
      title: "Corby Glen",
    },
    {
      slug: "colsterworth",
      title: "Colsterworth",
    },
  ]

  // Filter out current content
  let items: { slug: string; title: string }[] = []

  if (type === "blog") {
    items = blogPosts.filter((post) => post.slug !== currentSlug).slice(0, limit)
  } else if (type === "service") {
    items = services.filter((service) => service.slug !== currentSlug).slice(0, limit)
  } else if (type === "location") {
    items = locations.filter((location) => location.slug !== currentSlug).slice(0, limit)
  }

  return (
    <div className="mt-8 p-6 bg-brand-dark/30 backdrop-blur-sm border border-white/10 rounded-xl">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ArrowRight className="h-4 w-4 text-brand-pink mr-2 flex-shrink-0" />
            <Link
              href={
                type === "blog"
                  ? `/blog/${item.slug}`
                  : type === "service"
                    ? `/services/${item.slug}`
                    : `/locations/${item.slug}`
              }
              className="text-gray-300 hover:text-white hover:underline transition-colors"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
