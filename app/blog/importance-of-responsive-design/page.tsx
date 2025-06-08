import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "The Importance of Responsive Design in 2025 | WebFuZsion",
  description:
    "Learn why having a responsive website is crucial for businesses in today's mobile-first world and how it impacts user experience and SEO.",
  openGraph: {
    title: "The Importance of Responsive Design in 2025",
    description:
      "Learn why having a responsive website is crucial for businesses in today's mobile-first world and how it impacts user experience and SEO.",
    url: "https://www.webfuzsion.co.uk/blog/importance-of-responsive-design",
    siteName: "WebFuZsion",
    locale: "en_GB",
    type: "article",
    publishedTime: "2025-04-24T09:00:00.000Z",
    authors: ["Steve at WebFuZsion"],
    images: [
      {
        url: "https://webfuzsion.co.uk/responsive-devices-showcase.webp",
        width: 1200,
        height: 627,
        alt: "Responsive website design across multiple devices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Importance of Responsive Design in 2025",
    description:
      "Learn why having a responsive website is crucial for businesses in today's mobile-first world and how it impacts user experience and SEO.",
    images: ["https://webfuzsion.co.uk/responsive-devices-showcase.webp"],
  },
}

export default function ResponsiveDesignBlogPost() {
  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      <Header />

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to all posts
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            The Importance of Responsive Design in 2025
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>April 24, 2025</span>
            <span className="mx-2">•</span>
            <span>Steve at WebFuZsion</span>
            <span className="mx-2">•</span>
            <span>5 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/responsive-devices-showcase.webp"
              alt="Responsive website design across multiple devices"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              In today's digital landscape, having a responsive website is no longer optional—it's essential. With
              mobile devices accounting for over 50% of global web traffic, businesses must ensure their websites
              provide an optimal viewing experience across all devices.
            </p>

            <h2>What is Responsive Design?</h2>

            <p>
              Responsive web design is an approach that makes your website adapt to different screen sizes and
              viewports. Instead of creating separate websites for desktop and mobile, responsive design uses CSS media
              queries to adjust the layout based on the user's device.
            </p>

            <p>Key elements of responsive design include:</p>

            <ul>
              <li>Fluid grids that scale based on the device's screen size</li>
              <li>Flexible images that resize within their containing elements</li>
              <li>Media queries that apply different styles based on device characteristics</li>
            </ul>

            <h2>Why Responsive Design Matters for SEO</h2>

            <p>
              Google uses mobile-first indexing, meaning it primarily uses the mobile version of a website for indexing
              and ranking. If your site isn't mobile-friendly, it could negatively impact your search engine rankings.
            </p>

            <p>
              Additionally, responsive design helps reduce bounce rates. When users visit a site that's difficult to
              navigate on their device, they're likely to leave quickly. High bounce rates signal to search engines that
              your content may not be relevant or valuable to users.
            </p>

            <h2>User Experience Benefits</h2>

            <p>Beyond SEO, responsive design significantly improves user experience. Benefits include:</p>

            <ul>
              <li>Consistent experience across devices, building trust with your audience</li>
              <li>Faster loading times compared to separate mobile sites</li>
              <li>Easier sharing of content, as all users access the same URL</li>
              <li>Simplified website management with a single codebase</li>
            </ul>

            <h2>Implementing Responsive Design</h2>

            <p>When implementing responsive design, consider these best practices:</p>

            <ol>
              <li>Use a mobile-first approach, designing for small screens first</li>
              <li>Test your website on various devices and browsers</li>
              <li>Optimise images for faster loading on mobile devices</li>
              <li>Ensure touch elements are appropriately sized for finger tapping</li>
              <li>Simplify navigation for smaller screens</li>
            </ol>

            <h2>Conclusion</h2>

            <p>
              Responsive design is no longer a luxury—it's a necessity for businesses that want to succeed online. By
              providing an optimal viewing experience across all devices, you can improve user engagement, boost SEO
              rankings, and ultimately drive more conversions.
            </p>

            <div className="mt-8 p-6 bg-brand-dark/50 border border-brand-blue/30 rounded-lg">
              <h3 className="text-xl font-bold text-brand-pink mb-3">Is Your Website Responsive?</h3>
              <p className="mb-4">
                If your website isn't fully responsive, you could be losing valuable customers. Contact WebFuZsion today
                for a free website audit and learn how we can help make your site work beautifully on all devices.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Request a Free Website Audit
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
