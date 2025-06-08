import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TextReveal } from "@/components/text-reveal"
import { AnimatedSection } from "@/components/animated-section"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { BlogSocialShare } from "@/components/blog-social-share"

// Define metadata explicitly for this page
export const metadata: Metadata = {
  title: "The Top 10 Mistakes of Making Your Own Website with Templates | WebFuZsion",
  description:
    "Discover the most common pitfalls to avoid when creating your own website using templates, and learn how professional web design can help you achieve better results.",
  openGraph: {
    title: "The Top 10 Mistakes of Making Your Own Website with Templates | WebFuZsion",
    description:
      "Discover the most common pitfalls to avoid when creating your own website using templates, and learn how professional web design can help you achieve better results.",
    url: "https://www.webfuzsion.co.uk/blog/top-10-website-template-mistakes",
    siteName: "WebFuZsion",
    images: [
      {
        url: "https://webfuzsion.co.uk/website-warning-templates.webp",
        width: 1200,
        height: 627,
        alt: "Website template warning examples",
      },
    ],
    locale: "en_GB",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Top 10 Mistakes of Making Your Own Website with Templates | WebFuZsion",
    description:
      "Discover the most common pitfalls to avoid when creating your own website using templates, and learn how professional web design can help you achieve better results.",
    images: ["https://webfuzsion.co.uk/website-warning-templates.webp"],
  },
  alternates: {
    canonical: "https://www.webfuzsion.co.uk/blog/top-10-website-template-mistakes",
  },
}

export default function BlogPost() {
  return (
    <div className="min-h-screen text-white overflow-hidden bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-brand-pink/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      {/* Back to Blog */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <Link
          href="/blog"
          className="inline-flex items-center text-brand-blue hover:text-brand-blue/80 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
      </div>

      {/* Blog Content */}
      <article className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-brand-pink">Web Design</span>
            <span className="text-sm text-gray-400">May 11, 2025</span>
          </div>

          <TextReveal>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              The Top 10 Mistakes of Making Your Own Website with Templates
            </h1>
          </TextReveal>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/website-warning-templates.webp"
              alt="Website template warning examples"
              fill
              className="object-cover"
              priority
            />
          </div>

          <AnimatedSection delay={0.1}>
            <p className="text-gray-300 mb-6">
              DIY website builders and templates promise professional-looking websites with minimal effort. However,
              many business owners find themselves frustrated with the results. Here are the top 10 mistakes people make
              when creating websites with templates, and how to avoid them.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Choosing a Template Based on Aesthetics Alone</h2>
            <p className="text-gray-300 mb-4">
              Many people select templates purely based on how they look, without considering functionality or their
              specific business needs. A beautiful template that doesn't serve your business goals is ultimately
              ineffective.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Failing to Customise the Template</h2>
            <p className="text-gray-300 mb-4">
              Using a template exactly as it comes makes your website look generic and forgettable. Without proper
              customisation, your site will look identical to countless others using the same template.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Overlooking Mobile Responsiveness</h2>
            <p className="text-gray-300 mb-4">
              Not all templates are truly mobile-responsive. With over 50% of web traffic coming from mobile devices, a
              template that doesn't adapt perfectly to all screen sizes will alienate a significant portion of your
              audience.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Ignoring Page Load Speed</h2>
            <p className="text-gray-300 mb-4">
              Many templates come with bloated code and unnecessary features that slow down your website. Slow-loading
              pages lead to high bounce rates and poor search engine rankings.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Neglecting SEO Fundamentals</h2>
            <p className="text-gray-300 mb-4">
              Template websites often lack proper SEO structure. Without optimised headings, meta descriptions, and
              schema markup, your site will struggle to rank in search results.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Using Stock Images Excessively</h2>
            <p className="text-gray-300 mb-4">
              Relying too heavily on the stock photos that come with templates makes your business look inauthentic.
              Original photography creates a more trustworthy and unique brand image.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Poor Content Organisation</h2>
            <p className="text-gray-300 mb-4">
              Simply filling template sections with content without strategic organisation leads to confusing user
              experiences. Effective websites guide visitors through a logical journey.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Inadequate Call-to-Actions</h2>
            <p className="text-gray-300 mb-4">
              Many DIY websites fail to include clear, compelling calls-to-action. Without strategic CTAs, visitors
              won't know what steps to take next, resulting in missed conversion opportunities.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Neglecting Analytics Setup</h2>
            <p className="text-gray-300 mb-4">
              Template users often forget to set up proper analytics. Without data on how visitors interact with your
              site, you can't make informed improvements to increase conversions.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Underestimating Maintenance Requirements</h2>
            <p className="text-gray-300 mb-4">
              Many business owners don't realise that websites require regular updates and maintenance. Neglected
              websites become security risks and gradually lose effectiveness.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Professional Alternative</h3>
            <p className="text-gray-300 mb-6">
              While templates can be a starting point, professional web design addresses all these issues. A
              custom-designed website tailored to your specific business needs will deliver better results, stronger
              brand identity, and ultimately a better return on investment.
            </p>

            <div className="bg-brand-blue/20 border border-brand-blue/30 rounded-xl p-6 mt-8">
              <h3 className="text-xl font-bold mb-3">Need a website that stands out from template designs?</h3>
              <p className="text-gray-300 mb-4">
                At WebFuZsion, we create custom websites that avoid all these common template pitfalls. Contact us today
                for a free consultation.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Get in Touch
              </Link>
            </div>

            {/* Social Share Buttons */}
            <BlogSocialShare
              title="The Top 10 Mistakes of Making Your Own Website with Templates"
              url="https://www.webfuzsion.co.uk/blog/top-10-website-template-mistakes"
            />
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  )
}
