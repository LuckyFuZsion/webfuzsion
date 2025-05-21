import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "10 SEO Tips for Small Businesses in Grantham | WebFuZsion",
  description:
    "Discover practical SEO strategies that local businesses in Grantham can implement to improve their search engine rankings and attract more customers.",
  openGraph: {
    title: "10 SEO Tips for Small Businesses in Grantham",
    description:
      "Discover practical SEO strategies that local businesses in Grantham can implement to improve their search engine rankings and attract more customers.",
    url: "https://www.webfuzsion.co.uk/blog/seo-tips-for-small-businesses",
    siteName: "WebFuZsion",
    locale: "en_GB",
    type: "article",
    publishedTime: "2025-04-20T09:00:00.000Z",
    authors: ["Steve at WebFuZsion"],
    images: [
      {
        url: "https://webfuzsion.co.uk/website-ranking-boost.png",
        width: 1200,
        height: 627,
        alt: "SEO tips for small businesses in Grantham",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "10 SEO Tips for Small Businesses in Grantham",
    description:
      "Discover practical SEO strategies that local businesses in Grantham can implement to improve their search engine rankings and attract more customers.",
    images: ["https://webfuzsion.co.uk/website-ranking-boost.png"],
  },
}

export default function SEOTipsForSmallBusinessesBlogPost() {
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
            10 SEO Tips for Small Businesses in Grantham
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>April 20, 2025</span>
            <span className="mx-2">•</span>
            <span>Steve at WebFuZsion</span>
            <span className="mx-2">•</span>
            <span>6 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/website-ranking-boost.png"
              alt="SEO tips for small businesses in Grantham"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Search Engine Optimisation (SEO) is crucial for small businesses looking to increase their online
              visibility. Here are 10 practical SEO tips specifically for businesses in Grantham.
            </p>

            <h2>1. Optimise for Local Search</h2>
            <p>
              Include "Grantham" and other local keywords in your website content, meta descriptions, and page titles to
              improve local search rankings. Consider incorporating nearby towns and villages that your business serves,
              such as Gonerby, Barrowby, and Great Ponton.
            </p>

            <h2>2. Create a Google Business Profile</h2>
            <p>
              Set up and optimise your Google Business Profile with accurate information, photos, and regular updates to
              improve local visibility. Make sure your business category, opening hours, and contact details are
              up-to-date and consistent with your website.
            </p>

            <h2>3. Build Local Citations</h2>
            <p>
              Ensure your business is listed in local directories with consistent name, address, and phone number
              information. Important UK directories include Yell, Thomson Local, and Yelp, as well as Grantham-specific
              directories like the Grantham Journal business listings.
            </p>

            <h2>4. Gather Customer Reviews</h2>
            <p>
              Encourage satisfied customers to leave positive reviews on Google, Facebook, and other relevant platforms.
              Respond to all reviews, both positive and negative, to show that you value customer feedback and are
              actively engaged with your community.
            </p>

            <h2>5. Create Location-Specific Content</h2>
            <p>
              Develop content that addresses local issues, events, or news relevant to Grantham residents. This could
              include blog posts about local events like the Grantham Carnival, the Gravity Fields Festival, or
              developments in the town centre.
            </p>

            <h2>6. Optimise Website Speed</h2>
            <p>
              Ensure your website loads quickly on all devices to improve user experience and search rankings. Compress
              images, minify code, and consider using a content delivery network (CDN) to improve loading times for
              visitors from different locations.
            </p>

            <h2>7. Make Your Website Mobile-Friendly</h2>
            <p>
              With most searches now happening on mobile devices, ensure your website is fully responsive. Test your
              site on various devices and screen sizes to ensure it provides a seamless experience for all users,
              regardless of how they access your site.
            </p>

            <h2>8. Use Structured Data Markup</h2>
            <p>
              Implement schema markup to help search engines understand your content better and potentially enhance your
              search listings. For local businesses, LocalBusiness schema is particularly important as it helps search
              engines understand your business type, location, and services.
            </p>

            <h2>9. Build Quality Backlinks</h2>
            <p>
              Partner with other local businesses and organisations to build relevant backlinks to your website.
              Consider joining the Grantham Chamber of Commerce, sponsoring local events, or contributing to community
              initiatives to earn natural backlinks from reputable local sources.
            </p>

            <h2>10. Monitor and Analyse Performance</h2>
            <p>
              Regularly check your website analytics to understand what's working and what needs improvement. Track key
              metrics like organic traffic, bounce rate, and conversion rate to measure the effectiveness of your SEO
              efforts and make data-driven decisions.
            </p>

            <p>
              By implementing these SEO strategies, small businesses in Grantham can improve their online visibility and
              attract more local customers. Remember that SEO is a long-term investment, and consistent effort over time
              will yield the best results.
            </p>

            <div className="mt-8 p-6 bg-brand-dark/50 border border-brand-blue/30 rounded-lg">
              <h3 className="text-xl font-bold text-brand-pink mb-3">Need Help with Your Local SEO?</h3>
              <p className="mb-4">
                At WebFuZsion, we specialise in helping local businesses in Grantham optimise their online presence for
                better search engine rankings. Contact us to learn how we can help your business attract more local
                customers.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Contact Us for SEO Help
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
