import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Exciting News: WebFuZsion Web Design Studio is Now Live! | WebFuZsion",
  description:
    "We're thrilled to announce the official launch of WebFuZsion Web Design Studio! Discover our services, mission, and how we can help your business succeed online.",
  openGraph: {
    title: "Exciting News: WebFuZsion Web Design Studio is Now Live!",
    description:
      "We're thrilled to announce the official launch of WebFuZsion Web Design Studio! Discover our services, mission, and how we can help your business succeed online.",
    url: "https://www.webfuzsion.co.uk/blog/webfuzsion-launch-announcement",
    siteName: "WebFuZsion",
    locale: "en_GB",
    type: "article",
    publishedTime: "2025-04-28T09:00:00.000Z",
    authors: ["Steve at WebFuZsion"],
    images: [
      {
        url: "https://webfuzsion.co.uk/webfuzsion-launch-announcement.webp",
        width: 1200,
        height: 627,
        alt: "WebFuZsion Web Design Studio Launch Announcement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Exciting News: WebFuZsion Web Design Studio is Now Live!",
    description:
      "We're thrilled to announce the official launch of WebFuZsion Web Design Studio! Discover our services, mission, and how we can help your business succeed online.",
    images: ["https://webfuzsion.co.uk/webfuzsion-launch-announcement.webp"],
  },
}

export default function LaunchAnnouncementBlogPost() {
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
            Exciting News: WebFuZsion Web Design Studio is Now Live!
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>April 28, 2025</span>
            <span className="mx-2">•</span>
            <span>Steve at WebFuZsion</span>
            <span className="mx-2">•</span>
            <span>4 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/webfuzsion-launch-announcement.webp"
              alt="WebFuZsion Web Design Studio Launch Announcement"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Today marks an exciting milestone as we officially launch WebFuZsion Web Design Studio! After months of
              preparation, planning, and passion, we're thrilled to introduce our services to businesses in Grantham and
              beyond.
            </p>

            <h2>Our Mission</h2>

            <p>
              At WebFuZsion, we believe that every business deserves a stunning, functional website that drives results.
              Our mission is simple: to provide professional web design services that help small businesses, tradesmen,
              and content creators establish a powerful online presence without breaking the bank.
            </p>

            <p>
              We're not just another web design agency. We're a partner in your digital journey, committed to
              understanding your unique needs and delivering solutions that help you achieve your business goals.
            </p>

            <h2>Our Services</h2>

            <p>We're proud to offer a comprehensive range of web design and development services, including:</p>

            <ul>
              <li>
                <strong>Full Website Builds:</strong> Complete website design and development from concept to launch
              </li>
              <li>
                <strong>Landing Pages:</strong> High-converting landing pages designed to capture leads
              </li>
              <li>
                <strong>Redesigns:</strong> Transform your outdated website into a modern digital experience
              </li>
              <li>
                <strong>Maintenance:</strong> Keep your website secure, updated, and performing at its best
              </li>
            </ul>

            <p>
              All our services are offered with transparent pricing and no hidden fees, making professional web design
              accessible to businesses of all sizes.
            </p>

            <h2>Why Choose WebFuZsion?</h2>

            <p>In a sea of web design options, what makes WebFuZsion different?</p>

            <ul>
              <li>
                <strong>Local Expertise:</strong> Based in Grantham, we understand the local business landscape
              </li>
              <li>
                <strong>Global Perspective:</strong> We bring international design trends and best practices to your
                project
              </li>
              <li>
                <strong>Personal Attention:</strong> As a boutique studio, we provide dedicated service to every client
              </li>
              <li>
                <strong>Results-Focused:</strong> We design with your business goals in mind, not just aesthetics
              </li>
              <li>
                <strong>Affordable Excellence:</strong> Professional quality without the agency price tag
              </li>
            </ul>

            <h2>Our Portfolio</h2>

            <p>
              We're proud of the work we've done for our clients. Our portfolio showcases a diverse range of projects,
              from local tradesmen to restaurants and e-commerce stores. Each project reflects our commitment to
              quality, functionality, and results.
            </p>

            <p>
              Visit our{" "}
              <Link href="/#portfolio" className="text-blue-400 hover:text-blue-300">
                portfolio section
              </Link>{" "}
              to see examples of our work and get inspired for your own project.
            </p>

            <h2>EARLY BIRD OFFER</h2>

            <p>
              To celebrate our launch, we're offering a special early bird discount on all website packages booked
              before May 31, 2025:
            </p>

            <ul>
              <li>
                <strong>Starter Site:</strong> £300 (Regular price: £500) - Save £200!
              </li>
              <li>
                <strong>Business Site:</strong> £500 (Regular price: £800) - Save £300!
              </li>
              <li>
                <strong>Premium Site:</strong> £1000 (Regular price: £1200) - Save £200!
              </li>
            </ul>

            <p>
              This is the perfect opportunity to get the website your business deserves at a significantly reduced
              price. Don't miss out on these special launch rates!
            </p>

            <h2>Let's Connect</h2>

            <p>
              We're excited to be part of your business journey! Whether you're ready to start a project or just want to
              learn more about our services, we'd love to hear from you.
            </p>

            <p>
              You can reach us through our{" "}
              <Link href="/#contact" className="text-blue-400 hover:text-blue-300">
                contact form
              </Link>
              , by phone at 07590 763430, or by email at steve@luckyfuzsion.com.
            </p>

            <p>
              Follow us on social media for the latest updates, web design tips, and special offers. Share this post
              with anyone who might benefit from our services!
            </p>

            <h2>Thank You</h2>

            <p>
              Finally, we want to express our gratitude to everyone who has supported us on this journey. We're excited
              about the future and look forward to helping businesses thrive online.
            </p>

            <p>Here's to new beginnings and digital success!</p>

            <div className="mt-8 p-6 bg-brand-dark/50 border border-brand-blue/30 rounded-lg">
              <h3 className="text-xl font-bold text-brand-pink mb-3">Ready to Get Started?</h3>
              <p className="mb-4">
                Take advantage of our early bird pricing and give your business the online presence it deserves.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Contact Us Today
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
