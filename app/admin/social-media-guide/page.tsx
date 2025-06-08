"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackButton } from "./back-button"
import { LogoutButton } from "./logout-button"
import Image from "next/image"

export default function SocialMediaGuide() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if authenticated on client side
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check-auth")
        if (!res.ok) {
          router.push("/admin/login")
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Social Media Integration Guide</h1>
            <div className="flex space-x-4">
              <BackButton />
              <LogoutButton />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 w-full h-full opacity-5">
              <Image
                src="/images/webfuzsion-logo.png"
                alt="WebFuZsion Watermark"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-brand-blue">Facebook Integration Options</h2>
                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-brand-blue">Facebook Page Plugin</h3>
                  <p className="mb-4">
                    The Facebook Page Plugin lets you embed a client's Facebook page directly on their website. This is
                    great for businesses that regularly update their Facebook page with events, photos, or posts.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-md mb-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {`<iframe 
  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fclientpage&tabs=timeline&width=340&height=500" 
  width="340" 
  height="500" 
  style="border:none;overflow:hidden" 
  scrolling="no" 
  frameborder="0" 
  allowTransparency="true" 
  allow="encrypted-media">
</iframe>`}
                    </pre>
                  </div>
                  <p>
                    <strong>Best for:</strong> Restaurants, event venues, retail shops, and service businesses with
                    active Facebook pages.
                  </p>
                </div>

                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold mb-3 text-brand-blue">Facebook Share Button</h3>
                  <p className="mb-4">
                    Add Facebook share buttons to allow visitors to share content from the client's website directly to
                    Facebook.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-md mb-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {`<a 
  href="https://www.facebook.com/sharer/sharer.php?u=https://clientwebsite.com/page-to-share" 
  target="_blank" 
  rel="noopener noreferrer">
  Share on Facebook
</a>`}
                    </pre>
                  </div>
                  <p>
                    <strong>Best for:</strong> Blogs, news sites, product pages, and any content that benefits from
                    social sharing.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-brand-purple">Instagram Integration Options</h2>
                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-brand-purple">Instagram Feed</h3>
                  <p className="mb-4">
                    Embed an Instagram feed on the client's website to showcase their latest Instagram posts. This is
                    particularly effective for visually-oriented businesses.
                  </p>
                  <p>
                    <strong>Implementation options:</strong>
                  </p>
                  <ul className="list-disc ml-6 mb-4 space-y-2">
                    <li>
                      <strong>Instagram Basic Display API</strong> - For developers comfortable with API integration
                    </li>
                    <li>
                      <strong>Third-party widgets</strong> - Easier implementation with services like Elfsight, Smash
                      Balloon, or Taggbox
                    </li>
                    <li>
                      <strong>Embed code</strong> - Simple embedding of individual posts (limited functionality)
                    </li>
                  </ul>
                  <p>
                    <strong>Best for:</strong> Photographers, designers, restaurants, fashion brands, travel businesses,
                    and any business with strong visual content.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-brand-pink">Twitter/X Integration Options</h2>
                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-brand-pink">Twitter Timeline</h3>
                  <p className="mb-4">
                    Embed a Twitter timeline to display the client's latest tweets directly on their website.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-md mb-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {`<a 
  class="twitter-timeline" 
  href="https://twitter.com/clienthandle"
  data-width="300"
  data-height="500">
  Tweets by @clienthandle
</a>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`}
                    </pre>
                  </div>
                  <p>
                    <strong>Best for:</strong> News organizations, thought leaders, businesses with frequent updates or
                    announcements.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-brand-orange">LinkedIn Integration Options</h2>
                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-brand-orange">LinkedIn Share Button</h3>
                  <p className="mb-4">
                    Add LinkedIn share buttons to allow visitors to share content from the client's website directly to
                    LinkedIn.
                  </p>
                  <div className="bg-gray-800 p-4 rounded-md mb-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      {`<a 
  href="https://www.linkedin.com/sharing/share-offsite/?url=https://clientwebsite.com/page-to-share" 
  target="_blank" 
  rel="noopener noreferrer">
  Share on LinkedIn
</a>`}
                    </pre>
                  </div>
                  <p>
                    <strong>Best for:</strong> B2B businesses, professional services, thought leadership content, and
                    corporate websites.
                  </p>
                </div>

                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold mb-3 text-brand-orange">LinkedIn Profile Badge</h3>
                  <p className="mb-4">
                    Embed a LinkedIn profile or company page badge to showcase professional credentials or company
                    information.
                  </p>
                  <p>
                    <strong>Best for:</strong> Professional service providers, consultants, and B2B businesses.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-brand-blue">Best Practices</h2>
                <div className="bg-brand-dark/30 border border-white/5 rounded-lg p-6">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-brand-blue/20 p-1 rounded-full mr-3 mt-1">
                        <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                      </div>
                      <span>
                        Don't overload the website with too many social media widgets - choose 1-2 that are most
                        relevant
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-blue/20 p-1 rounded-full mr-3 mt-1">
                        <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                      </div>
                      <span>Ensure social media integrations match the website's design and branding</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-blue/20 p-1 rounded-full mr-3 mt-1">
                        <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                      </div>
                      <span>Test social media widgets on mobile devices to ensure they're responsive</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-blue/20 p-1 rounded-full mr-3 mt-1">
                        <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                      </div>
                      <span>Consider page load times - social media widgets can slow down websites</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-blue/20 p-1 rounded-full mr-3 mt-1">
                        <div className="h-4 w-4 bg-brand-blue rounded-full"></div>
                      </div>
                      <span>Always include privacy policy information when integrating social media features</span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
