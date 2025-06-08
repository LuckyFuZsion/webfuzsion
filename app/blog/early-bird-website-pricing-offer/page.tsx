import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Limited Time Early Bird Offer: Save Up to £300 on Professional Website Design | WebFuZsion",
  description:
    "For a limited time only, save up to £300 on professional website design packages. Book before May 31, 2025 to secure your discounted rate on Starter, Business, or Premium websites.",
  openGraph: {
    title: "Limited Time Early Bird Offer: Save Up to £300 on Professional Website Design",
    description:
      "For a limited time only, save up to £300 on professional website design packages. Book before May 31, 2025 to secure your discounted rate on Starter, Business, or Premium websites.",
    url: "https://www.webfuzsion.co.uk/blog/early-bird-website-pricing-offer",
    siteName: "WebFuZsion",
    locale: "en_GB",
    type: "article",
    publishedTime: "2025-05-02T09:00:00.000Z",
    authors: ["Steve at WebFuZsion"],
    images: [
      {
        url: "https://webfuzsion.co.uk/early-bird-offer.webp",
        width: 1200,
        height: 627,
        alt: "Early Bird Website Pricing Offer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Limited Time Early Bird Offer: Save Up to £300 on Professional Website Design",
    description:
      "For a limited time only, save up to £300 on professional website design packages. Book before May 31, 2025 to secure your discounted rate on Starter, Business, or Premium websites.",
    images: ["https://webfuzsion.co.uk/early-bird-offer.webp"],
  },
}

export default function EarlyBirdOfferBlogPost() {
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
            Limited Time Early Bird Offer: Save Up to £300 on Professional Website Design
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>May 2, 2025</span>
            <span className="mx-2">•</span>
            <span>Steve at WebFuZsion</span>
            <span className="mx-2">•</span>
            <span>3 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/early-bird-offer.webp"
              alt="Early Bird Website Pricing Offer"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              We're excited to announce our special early bird pricing for new website design projects! For a limited
              time only, you can save up to £300 on our professional website design packages.
            </p>

            <h2>Early Bird Discount Details</h2>

            <p>Book your website project before May 31, 2025, and take advantage of these special rates:</p>

            <div className="mt-6 mb-8 bg-brand-dark/30 p-6 rounded-lg border border-brand-blue/30">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-brand-pink mb-2">Starter Website</h3>
                <p className="text-lg">
                  <span className="line-through text-gray-400">Regular price: £500</span>
                </p>
                <p className="text-2xl font-bold">Early Bird Price: £300</p>
                <p className="text-brand-blue font-medium">Save £200!</p>
                <div className="mt-3 text-sm text-gray-300">
                  Perfect for small businesses just getting started online. Includes a responsive 3-5 page website with
                  essential information about your business.
                </div>
              </div>

              <div className="mb-6 pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold text-brand-pink mb-2">Business Website</h3>
                <p className="text-lg">
                  <span className="line-through text-gray-400">Regular price: £800</span>
                </p>
                <p className="text-2xl font-bold">Early Bird Price: £500</p>
                <p className="text-brand-blue font-medium">Save £300!</p>
                <div className="mt-3 text-sm text-gray-300">
                  Ideal for established businesses looking for a professional online presence. Includes a responsive 5-8
                  page website with advanced features like contact forms and image galleries.
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h3 className="text-xl font-bold text-brand-pink mb-2">Premium Website</h3>
                <p className="text-lg">
                  <span className="line-through text-gray-400">Regular price: £1,200</span>
                </p>
                <p className="text-2xl font-bold">Early Bird Price: £1,000</p>
                <p className="text-brand-blue font-medium">Save £200!</p>
                <div className="mt-3 text-sm text-gray-300">
                  For businesses that need a comprehensive online solution. Includes a responsive 8+ page website with
                  premium features like e-commerce functionality, custom animations, and advanced SEO optimisation.
                </div>
              </div>
            </div>

            <h2>Why Book Now?</h2>

            <ul>
              <li>Lock in our lowest prices of the year</li>
              <li>Secure a spot in our project calendar (which is filling up quickly)</li>
              <li>Get your new website up and running sooner</li>
              <li>Start attracting new customers and growing your business online</li>
            </ul>

            <h2>What's Included in Every Package</h2>

            <ul>
              <li>Mobile-responsive design that looks great on all devices</li>
              <li>Search engine optimisation fundamentals</li>
              <li>Fast loading speeds for better user experience</li>
              <li>Contact forms and Google Maps integration</li>
              <li>Social media integration</li>
              <li>Basic analytics setup to track website performance</li>
              <li>30 days of post-launch support</li>
            </ul>

            <h2>How to Claim This Offer</h2>

            <p>Claiming your early bird discount is easy:</p>

            <ol>
              <li>
                Contact us through our{" "}
                <Link href="/#contact" className="text-blue-400 hover:text-blue-300">
                  website contact form
                </Link>
              </li>
              <li>Call us at 07590 763430</li>
              <li>Email us at steve@luckyfuzsion.com</li>
            </ol>

            <p>
              Mention the "Early Bird Offer" when you get in touch, and we'll schedule a free consultation to discuss
              your website needs and secure your discounted rate.
            </p>

            <div className="mt-8 mb-8 p-4 bg-brand-pink/20 border border-brand-pink/30 rounded-lg">
              <p className="font-bold text-center">This offer expires on May 31, 2025. Don't miss out!</p>
            </div>

            <h2>Our Process</h2>

            <p>When you work with WebFuZsion, you can expect a smooth, collaborative process:</p>

            <ol>
              <li>
                <strong>Discovery:</strong> We'll learn about your business, goals, and website needs
              </li>
              <li>
                <strong>Planning:</strong> We'll create a sitemap and wireframes for your approval
              </li>
              <li>
                <strong>Design:</strong> We'll develop a custom design that reflects your brand
              </li>
              <li>
                <strong>Development:</strong> We'll build your website with clean, efficient code
              </li>
              <li>
                <strong>Testing:</strong> We'll ensure your website works perfectly across all devices
              </li>
              <li>
                <strong>Launch:</strong> We'll deploy your website and provide training on how to use it
              </li>
            </ol>

            <p>
              Ready to get started? Contact us today to take advantage of this limited-time offer and give your business
              the professional online presence it deserves.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
