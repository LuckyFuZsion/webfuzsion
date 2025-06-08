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
          email: "steve@luckyfuzsion.co.uk",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Grantham",
            addressRegion: "Lincolnshire",
            addressCountry: "GB",
            postalCode: "NG31",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 52.9127,
            longitude: -0.638,
          },
          areaServed: [
            {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 52.9127,
                longitude: -0.638,
              },
              geoRadius: "50000",
            },
            "Worldwide",
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "17:00",
          },
          sameAs: ["https://www.facebook.com/profile.php?id=61575611918979"],
          priceRange: "££",
          servesCuisine: "Web Design Services",
          description:
            "Professional web design services based in Grantham, Lincolnshire, serving small businesses, tradesmen, and content creators worldwide. Custom websites, landing pages, redesigns and maintenance services at competitive prices.",
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
            addressLocality: "Grantham",
            addressRegion: "Lincolnshire",
            addressCountry: "GB",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 52.9127,
            longitude: -0.6433,
          },
          areaServed: [
            {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 52.9127,
                longitude: -0.6433,
              },
              geoRadius: "50000",
            },
            {
              "@type": "Place",
              name: "Global",
            },
          ],
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
            {
              "@type": "ListItem",
              position: 6,
              name: "FAQ",
              item: "https://webfuzsion.com/#faq",
            },
            {
              "@type": "ListItem",
              position: 7,
              name: "Blog",
              item: "https://webfuzsion.com/blog",
            },
            {
              "@type": "ListItem",
              position: 8,
              name: "Grantham Web Design",
              item: "https://webfuzsion.com/locations/grantham",
            },
          ],
        }),
      }}
    />
  )
}

export function FAQJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How much does a website cost?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our website packages start from £500 for a starter site. The final cost depends on your specific requirements, number of pages, and functionality needed. We offer transparent pricing with no hidden fees.",
              },
            },
            {
              "@type": "Question",
              name: "How long does it take to build a website?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Most standard websites take 2-4 weeks from concept to launch. More complex projects with custom functionality may take 4-8 weeks. We'll provide you with a specific timeline during our initial consultation.",
              },
            },
            {
              "@type": "Question",
              name: "Do you work with clients outside of Grantham?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! While we're based in Grantham, Lincolnshire, we work with clients globally. We use video calls, email, and project management tools to collaborate effectively with clients anywhere in the world.",
              },
            },
            {
              "@type": "Question",
              name: "Will my website work on mobile devices?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Absolutely. All our websites are fully responsive and optimized for all devices including smartphones, tablets, laptops, and desktop computers. We test extensively across multiple device types and screen sizes.",
              },
            },
            {
              "@type": "Question",
              name: "Do you offer website maintenance services?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, we offer ongoing maintenance packages to keep your website secure, updated, and performing optimally. Our maintenance services include regular updates, security monitoring, backups, and technical support.",
              },
            },
            {
              "@type": "Question",
              name: "Can you help with SEO for my website?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, all our websites are built with SEO best practices in mind. We also offer additional SEO services including keyword research, on-page optimization, content creation, and local SEO to help improve your search engine rankings.",
              },
            },
          ],
        }),
      }}
    />
  )
}

export function ReviewJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          author: {
            "@type": "Person",
            name: "John Smith",
          },
          itemReviewed: {
            "@type": "LocalBusiness",
            name: "WebFuZsion Web Design Studio",
            image: "https://webfuzsion.com/images/webfuzsion-logo.png",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Grantham",
              addressRegion: "Lincolnshire",
              addressCountry: "GB",
            },
          },
          reviewBody:
            "WebFuZsion transformed our online presence. Our new website has already brought in several new clients within the first month!",
        }),
      }}
    />
  )
}
