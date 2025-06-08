import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import BlogPostCard from "../components/blog-post-card"

export const metadata: Metadata = {
  title: "Blog | WebFuZsion",
  description: "Read our latest articles about web design, digital marketing, and more.",
}

// Static blog posts
function getBlogPosts() {
  const posts = [
    {
      slug: "diy-vs-professional-web-design",
      title: "DIY vs. Professional Web Design: When to Hire an Expert",
      excerpt:
        "Discover when to build your own website vs. hiring a professional web designer. Compare costs, time, quality, and long-term benefits to make the right choice for your business.",
      date: "2024-12-06",
      author: "WebFuZsion Team",
      image:
        "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Opengraph-LTuWN7l8ecvsZc73ZO51pjs0Rn03AN.png",
      category: "Business Strategy",
      reading_time: "12 min read",
    },
    {
      slug: "content-marketing-for-web-design",
      title: "Content Marketing for Web Design Agencies",
      excerpt: "Learn how to create compelling content that attracts clients and showcases your web design expertise.",
      date: "2024-01-15",
      author: "WebFuZsion Team",
      image: "/content-web-integration.png",
      category: "Marketing",
      reading_time: "8 min read",
    },
    {
      slug: "do-businesses-need-websites-in-social-media-age",
      title: "Do Businesses Need Websites in the Social Media Age?",
      excerpt:
        "Exploring why having a professional website remains crucial for business success, even with social media dominance.",
      date: "2024-01-10",
      author: "WebFuZsion Team",
      image: "/business-website-vs-social.png",
      category: "Business",
      reading_time: "6 min read",
    },
    {
      slug: "early-bird-website-pricing-offer",
      title: "Early Bird Website Pricing Offer",
      excerpt: "Limited time offer for new clients - get premium web design services at special introductory rates.",
      date: "2024-01-05",
      author: "WebFuZsion Team",
      image: "/early-bird-offer.png",
      category: "Offers",
      reading_time: "3 min read",
    },
    {
      slug: "ecommerce-design-best-practices",
      title: "E-commerce Design Best Practices",
      excerpt:
        "Essential design principles for creating successful online stores that convert visitors into customers.",
      date: "2024-01-20",
      author: "WebFuZsion Team",
      image: "/modern-ecommerce-checkout.png",
      category: "E-commerce",
      reading_time: "10 min read",
    },
    {
      slug: "importance-of-business-website",
      title: "The Importance of Having a Business Website",
      excerpt: "Why every business needs a professional website and how it impacts your success in the digital age.",
      date: "2024-01-12",
      author: "WebFuZsion Team",
      image: "/business-website-importance.png",
      category: "Business",
      reading_time: "7 min read",
    },
    {
      slug: "importance-of-responsive-design",
      title: "The Importance of Responsive Design",
      excerpt: "Learn why responsive design is crucial for modern websites and how it affects user experience and SEO.",
      date: "2024-01-18",
      author: "WebFuZsion Team",
      image: "/responsive-devices-showcase.png",
      category: "Web Design",
      reading_time: "6 min read",
    },
    {
      slug: "importance-of-seo-strategy",
      title: "The Importance of SEO Strategy",
      excerpt: "Discover how a solid SEO strategy can boost your website's visibility and drive organic traffic.",
      date: "2024-01-22",
      author: "WebFuZsion Team",
      image: "/seo-strategy-diagram.png",
      category: "SEO",
      reading_time: "9 min read",
    },
    {
      slug: "local-seo-tips",
      title: "Local SEO Tips for Small Businesses",
      excerpt: "Practical strategies to improve your local search rankings and attract more customers in your area.",
      date: "2024-01-25",
      author: "WebFuZsion Team",
      image: "/website-ranking-boost.png",
      category: "SEO",
      reading_time: "8 min read",
    },
    {
      slug: "seo-tips-for-small-businesses",
      title: "SEO Tips for Small Businesses",
      excerpt:
        "Simple and effective SEO strategies that small businesses can implement to improve their online visibility.",
      date: "2024-01-28",
      author: "WebFuZsion Team",
      image: "/images/seo.png",
      category: "SEO",
      reading_time: "7 min read",
    },
    {
      slug: "top-10-website-template-mistakes",
      title: "Top 10 Website Template Mistakes to Avoid",
      excerpt: "Common pitfalls when using website templates and how to avoid them for a professional-looking site.",
      date: "2024-01-30",
      author: "WebFuZsion Team",
      image: "/website-warning-templates.png",
      category: "Web Design",
      reading_time: "5 min read",
    },
    {
      slug: "web-accessibility-guide",
      title: "Web Accessibility Guide",
      excerpt:
        "Essential guidelines for making your website accessible to all users, including those with disabilities.",
      date: "2024-02-02",
      author: "WebFuZsion Team",
      image: "/accessibility-inclusion-puzzle.png",
      category: "Accessibility",
      reading_time: "12 min read",
    },
    {
      slug: "webfuzsion-launch-announcement",
      title: "WebFuZsion Launch Announcement",
      excerpt: "Introducing WebFuZsion - your new partner for professional web design and digital marketing services.",
      date: "2024-01-01",
      author: "WebFuZsion Team",
      image: "/webfuzsion-launch-announcement.png",
      category: "Company News",
      reading_time: "4 min read",
    },
    {
      slug: "website-speed-optimization",
      title: "Website Speed Optimization",
      excerpt: "Techniques and best practices to improve your website's loading speed and overall performance.",
      date: "2024-02-05",
      author: "WebFuZsion Team",
      image: "/website-speed-metrics-dashboard.png",
      category: "Performance",
      reading_time: "11 min read",
    },
  ]

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="bg-brand-dark min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-brand-dark via-brand-dark to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            WebFuZsion <span className="text-brand-pink">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Insights, tips, and news about web design, digital marketing, and growing your online presence.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700/50 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">No blog posts found</h2>
                <p className="text-gray-300">Check back soon for new content!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
