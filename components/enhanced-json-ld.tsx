"use client"
import { usePathname } from "next/navigation"

interface JsonLdProps {
  title: string
  description: string
  imageUrl?: string
  type?: "WebSite" | "LocalBusiness" | "BlogPosting" | "Service" | "WebPage"
  datePublished?: string
  dateModified?: string
  authorName?: string
  serviceName?: string
  village?: string
}

export default function EnhancedJsonLd({
  title,
  description,
  imageUrl = "https://webfuzsion.co.uk/images/webfuzsion-og.png",
  type = "WebPage",
  datePublished,
  dateModified,
  authorName = "Steve Fuszard",
  serviceName,
  village,
}: JsonLdProps) {
  const pathname = usePathname()
  const canonicalUrl = `https://webfuzsion.co.uk${pathname}`

  // Base organization data
  const organizationData = {
    "@type": "Organization",
    name: "WebFuZsion",
    url: "https://webfuzsion.co.uk",
    logo: "https://webfuzsion.co.uk/images/webfuzsion-logo.png",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61575611918979",
      "https://www.linkedin.com/company/webfuzsion",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+447123456789",
      email: "steve@luckyfuzsion.com",
      contactType: "customer service",
    },
  }

  // Base website data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://webfuzsion.co.uk",
    name: "WebFuZsion",
    description: "Professional web design services in Grantham and surrounding areas",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://webfuzsion.co.uk/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  // Local business data
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://webfuzsion.co.uk/#localbusiness",
    name: "WebFuZsion",
    image: "https://webfuzsion.co.uk/images/webfuzsion-logo.png",
    url: "https://webfuzsion.co.uk",
    telephone: "+447123456789",
    email: "steve@luckyfuzsion.com",
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Web Design Street",
      addressLocality: "Grantham",
      addressRegion: "Lincolnshire",
      postalCode: "NG31 1AA",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.9127,
      longitude: -0.6433,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    areaServed: village
      ? {
          "@type": "City",
          name: village,
        }
      : [
          {
            "@type": "City",
            name: "Grantham",
          },
          {
            "@type": "City",
            name: "Lincolnshire",
          },
        ],
  }

  // Blog post data
  const blogPostData = datePublished
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
        headline: title,
        description: description,
        image: imageUrl,
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: organizationData,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
      }
    : null

  // Service data
  const serviceData = serviceName
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: serviceName,
        provider: organizationData,
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: 52.9127,
            longitude: -0.6433,
          },
          geoRadius: "30000",
        },
        description: description,
        name: title,
        url: canonicalUrl,
      }
    : null

  // Web page data
  const webPageData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    url: canonicalUrl,
    name: title,
    description: description,
    isPartOf: {
      "@id": "https://webfuzsion.co.uk/#website",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://webfuzsion.co.uk",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: canonicalUrl,
        },
      ],
    },
  }

  // Determine which schema to use based on type
  let schemaData
  switch (type) {
    case "WebSite":
      schemaData = websiteData
      break
    case "LocalBusiness":
      schemaData = localBusinessData
      break
    case "BlogPosting":
      schemaData = blogPostData
      break
    case "Service":
      schemaData = serviceData
      break
    default:
      schemaData = webPageData
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      {/* Always include the organization data */}
      {type !== "Organization" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              ...organizationData,
            }),
          }}
        />
      )}
      {/* Always include the website data */}
      {type !== "WebSite" && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }} />
      )}
    </>
  )
}
