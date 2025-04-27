export function WebDesignBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "WebFuZsion Web Design Studio",
          image: "https://webfuzsion.com/images/webfuzsion-logo.png",
          "@id": "https://webfuzsion.com",
          url: "https://webfuzsion.com",
          telephone: "07590763430",
          address: {
            "@type": "PostalAddress",
            addressCountry: "GB",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 51.5074,
            longitude: 0.1278,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
          sameAs: ["https://www.facebook.com/webfuzsion", "https://www.instagram.com/webfuzsion"],
          priceRange: "££",
          servesCuisine: "Web Design Services",
          description:
            "Professional web design services for small businesses, tradesmen, and content creators. Custom websites, landing pages, redesigns and maintenance services at competitive prices.",
          makesOffer: [
            {
              "@type": "Offer",
              name: "Full Website Builds",
              description:
                "Complete website design and development from concept to launch, tailored to your business needs.",
            },
            {
              "@type": "Offer",
              name: "Landing Pages",
              description: "High-converting landing pages designed to capture leads and drive customer action.",
            },
            {
              "@type": "Offer",
              name: "Redesigns",
              description: "Transform your outdated website into a modern, user-friendly digital experience.",
            },
            {
              "@type": "Offer",
              name: "Maintenance",
              description:
                "Keep your website secure, updated, and performing at its best with our maintenance services.",
            },
          ],
        }),
      }}
    />
  )
}

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "WebFuZsion Web Design Studio",
          image: "https://webfuzsion.com/images/webfuzsion-logo.png",
          "@id": "https://webfuzsion.com",
          url: "https://webfuzsion.com",
          telephone: "07590763430",
          priceRange: "££",
          address: {
            "@type": "PostalAddress",
            addressCountry: "GB",
          },
        }),
      }}
    />
  )
}

export function WebsiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "WebFuZsion Web Design Studio",
          url: "https://webfuzsion.com",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://webfuzsion.com/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  )
}

export function BreadcrumbJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://webfuzsion.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: "https://webfuzsion.com/#services",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Portfolio",
              item: "https://webfuzsion.com/#portfolio",
            },
            {
              "@type": "ListItem",
              position: 4,
              name: "Pricing",
              item: "https://webfuzsion.com/#pricing",
            },
            {
              "@type": "ListItem",
              position: 5,
              name: "Contact",
              item: "https://webfuzsion.com/#contact",
            },
          ],
        }),
      }}
    />
  )
}
