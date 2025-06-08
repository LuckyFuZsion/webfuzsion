import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogSocialShare } from "@/components/blog-social-share"

export const metadata: Metadata = {
  title: "10 Easy Ways to Improve Your Website's SEO and Attract Local Customers | WebFuZsion",
  description:
    "In today's digital marketplace, having a strong local online presence is essential for businesses of all sizes.",
  openGraph: {
    title: "10 Easy Ways to Improve Your Website's SEO and Attract Local Customers",
    description:
      "In today's digital marketplace, having a strong local online presence is essential for businesses of all sizes.",
    url: "https://www.webfuzsion.co.uk/blog/local-seo-tips",
    siteName: "WebFuZsion",
    locale: "en_GB",
    type: "article",
    publishedTime: "2025-05-01T09:00:00.000Z",
    authors: ["Steve at WebFuZsion"],
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/64e7e178-345e-4dd3-b22d-2200e975f1cc.png?token=fjsdekolh62pYHMPc_SSxT8Odxi6l-LVmjf6-hJ9DkI&height=627&width=1200&expires=33282168679",
        width: 1200,
        height: 627,
        alt: "SEO Tips for Local Businesses",
        type: "image/png",
      },
    ],
    appId: "1178547523595198",
  },
  twitter: {
    card: "summary_large_image",
    title: "10 Easy Ways to Improve Your Website's SEO and Attract Local Customers",
    description:
      "In today's digital marketplace, having a strong local online presence is essential for businesses of all sizes.",
    images: [
      "https://opengraph.b-cdn.net/production/images/64e7e178-345e-4dd3-b22d-2200e975f1cc.png?token=fjsdekolh62pYHMPc_SSxT8Odxi6l-LVmjf6-hJ9DkI&height=627&width=1200&expires=33282168679",
    ],
  },
}

export default function LocalSEOTipsBlogPost() {
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
            10 Easy Ways to Improve Your Website's SEO and Attract Local Customers
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>May 1, 2025</span>
            <span className="mx-2">•</span>
            <span>Steve at WebFuZsion</span>
            <span className="mx-2">•</span>
            <span>7 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/website-ranking-boost.png"
              alt="Website ranking boost illustration"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              In today's digital marketplace, having a strong local online presence is essential for businesses of all
              sizes. <strong>Search Engine Optimisation (SEO)</strong> is the key to ensuring your website appears when
              potential customers in your area are searching for the products or services you offer. Here are ten
              straightforward ways to boost your website's SEO and attract more local customers.
            </p>

            {/* Content continues... */}

            <div className="mt-8 p-6 bg-brand-dark/50 border border-brand-blue/30 rounded-lg">
              <h3 className="text-xl font-bold text-brand-pink mb-3">Need Help With Your Local SEO?</h3>
              <p className="mb-4">
                At WebFuZsion, we specialise in helping local businesses improve their online presence through effective
                SEO strategies. Contact us to learn how we can help your business attract more local customers through
                your website.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Get in Touch
              </Link>
            </div>

            {/* Social Share Buttons */}
            <BlogSocialShare
              title="10 Easy Ways to Improve Your Website's SEO and Attract Local Customers"
              url="https://www.webfuzsion.co.uk/blog/local-seo-tips"
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
