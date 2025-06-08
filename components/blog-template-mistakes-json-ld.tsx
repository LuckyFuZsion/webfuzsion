import Script from "next/script"

export function BlogTemplateMistakesJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "The Top 10 Mistakes of Making Your Own Website with Templates",
    description:
      "Discover the most common pitfalls to avoid when creating your own website using templates, and learn how professional web design can help you achieve better results.",
    image:
      "https://opengraph.b-cdn.net/production/images/41f632b8-c98b-48a2-b8d8-4c82c4d97bb6.png?token=6AwC-lCEuCc5RIDYBab1rWUmmtU0Y0lKrzj_EDH3tfc&height=627&width=1200&expires=33282745666",
    datePublished: "2025-05-11T12:00:00+00:00",
    dateModified: "2025-05-11T12:00:00+00:00",
    author: {
      "@type": "Person",
      name: "WebFuZsion",
    },
    publisher: {
      "@type": "Organization",
      name: "WebFuZsion",
      logo: {
        "@type": "ImageObject",
        url: "https://www.webfuzsion.co.uk/images/webfuzsion-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.webfuzsion.co.uk/blog/top-10-website-template-mistakes",
    },
  }

  return (
    <Script
      id="blog-template-mistakes-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
