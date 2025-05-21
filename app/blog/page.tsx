"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { TextReveal } from "@/components/text-reveal"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  imageUrl: string
}

export default function BlogPage() {
  // Complete blog posts list - updated to include the new SEO strategy post
  const blogPosts: BlogPost[] = [
    {
      slug: "top-10-website-template-mistakes",
      title: "The Top 10 Mistakes of Making Your Own Website with Templates",
      excerpt:
        "Discover the most common pitfalls to avoid when creating your own website using templates, and learn how professional web design can help you achieve better results.",
      date: "May 11, 2025",
      category: "Web Design",
      imageUrl: "/website-warning-templates.png",
    },
    {
      slug: "importance-of-seo-strategy",
      title: "Why Every Online Business Needs a Solid SEO Strategy",
      excerpt:
        "Discover why a comprehensive SEO strategy is essential for online business success, how to develop one, and the key components that drive organic traffic and growth.",
      date: "May 10, 2025",
      category: "SEO",
      imageUrl: "/seo-strategy-diagram.png",
    },
    {
      slug: "do-businesses-need-websites-in-social-media-age",
      title: "Do Businesses Still Need Websites in the Age of Social Media?",
      excerpt:
        "With the rise of social media and Google Business Profiles, are websites still necessary? Explore the pros and cons of different online presence strategies for businesses.",
      date: "May 7, 2025",
      category: "Digital Strategy",
      imageUrl: "/business-website-vs-social.png",
    },
    {
      slug: "early-bird-website-pricing-offer",
      title: "Limited Time Early Bird Offer: Save Up to £300 on Professional Website Design",
      excerpt:
        "For a limited time only, save up to £300 on professional website design packages. Book before May 31, 2025 to secure your discounted rate on Starter, Business, or Premium websites.",
      date: "May 2, 2025",
      category: "Pricing",
      imageUrl: "/early-bird-offer.png",
    },
    {
      slug: "local-seo-tips",
      title: "10 Easy Ways to Improve Your Website's SEO and Attract Local Customers",
      excerpt:
        "Discover practical strategies to enhance your website's search engine visibility and attract more local customers to your business.",
      date: "May 1, 2025",
      category: "SEO",
      imageUrl: "/website-ranking-boost.png",
    },
    {
      slug: "webfuzsion-launch-announcement",
      title: "Exciting News: WebFuZsion Web Design Studio is Now Live!",
      excerpt:
        "We're thrilled to announce the official launch of WebFuZsion Web Design Studio! Discover our services, mission, and how we can help your business succeed online.",
      date: "April 28, 2025",
      category: "Announcement",
      imageUrl: "/webfuzsion-launch-announcement.png",
    },
    {
      slug: "importance-of-business-website",
      title: "The Importance of Having a Business Website",
      excerpt:
        "Discover why having a professional website is essential for businesses of all sizes in today's digital marketplace and how it can drive growth and customer engagement.",
      date: "April 27, 2025",
      category: "Business",
      imageUrl: "/business-website-importance.png",
    },
    {
      slug: "importance-of-responsive-design",
      title: "The Importance of Responsive Design in 2025",
      excerpt:
        "Learn why having a responsive website is crucial for businesses in today's mobile-first world and how it impacts user experience and SEO.",
      date: "April 24, 2025",
      category: "Web Design",
      imageUrl: "/responsive-devices-showcase.png",
    },
    {
      slug: "seo-tips-for-small-businesses",
      title: "10 SEO Tips for Small Businesses in Grantham",
      excerpt:
        "Discover practical SEO strategies that local businesses in Grantham can implement to improve their search engine rankings and attract more customers.",
      date: "April 20, 2025",
      category: "SEO",
      imageUrl: "/website-ranking-boost.png",
    },
    {
      slug: "website-speed-optimization",
      title: "How to Optimize Your Website Speed for Better Performance",
      excerpt:
        "Slow websites lose visitors. Learn practical techniques to improve your website's loading speed and provide a better user experience.",
      date: "April 17, 2025",
      category: "Performance",
      imageUrl: "/website-speed-metrics-dashboard.png",
    },
    {
      slug: "ecommerce-design-best-practices",
      title: "E-commerce Design Best Practices for Higher Conversions",
      excerpt:
        "Explore design strategies that can help increase conversions on your e-commerce website, from product pages to checkout processes.",
      date: "April 15, 2025",
      category: "E-commerce",
      imageUrl: "/modern-ecommerce-checkout.png",
    },
    {
      slug: "content-marketing-for-web-design",
      title: "How Content Marketing Complements Your Web Design",
      excerpt:
        "Discover the synergy between great web design and effective content marketing, and how they work together to drive business results.",
      date: "April 14, 2025",
      category: "Content Marketing",
      imageUrl: "/content-web-integration.png",
    },
    {
      slug: "web-accessibility-guide",
      title: "A Comprehensive Guide to Web Accessibility",
      excerpt:
        "Learn how to make your website accessible to everyone, including people with disabilities, and why accessibility is essential for modern websites.",
      date: "April 14, 2025",
      category: "Accessibility",
      imageUrl: "/accessibility-inclusion-puzzle.png",
    },
  ]

  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      {/* Hero Section - Reduced padding */}
      <section className="pt-20 pb-4 md:pt-24 md:pb-4 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block bg-brand-pink/20 backdrop-blur-sm border border-brand-pink/30 rounded-full px-4 py-1 text-sm text-brand-pink font-medium mb-3"
            >
              <span>Web Design Insights</span>
            </motion.div>

            <TextReveal direction="up" delay={0.2}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3">WebFuZsion Blog</h1>
            </TextReveal>

            <TextReveal direction="up" delay={0.4}>
              <p className="text-lg text-gray-300 mb-4">
                Insights, tips, and trends in web design, development, and digital marketing to help your business
                succeed online.
              </p>
            </TextReveal>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid - Reduced padding and gap */}
      <section className="py-4 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.slug} delay={0.1 * index} className="h-full">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-full transition-transform duration-300 hover:scale-[1.02]">
                    <div className="relative h-40 w-full">
                      <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-brand-pink">{post.category}</span>
                        <span className="text-sm text-gray-400">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center text-brand-blue">
                        <span className="text-sm">Read more</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
