import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "A Comprehensive Guide to Web Accessibility | WebFuZsion",
  description:
    "Learn how to make your website accessible to everyone, including people with disabilities, and why accessibility is essential for modern websites.",
  openGraph: {
    title: "A Comprehensive Guide to Web Accessibility",
    description:
      "Learn how to make your website accessible to everyone, including people with disabilities, and why accessibility is essential for modern websites.",
    url: "https://www.webfuzsion.co.uk/blog/web-accessibility-guide",
    siteName: "WebFuZsion",
    locale: "en_GB",
    type: "article",
    publishedTime: "2025-04-14T10:00:00.000Z",
    authors: ["Steve at WebFuZsion"],
    images: [
      {
        url: "https://webfuzsion.co.uk/accessibility-inclusion-puzzle.png",
        width: 1200,
        height: 627,
        alt: "Web accessibility and inclusion concept",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Comprehensive Guide to Web Accessibility",
    description:
      "Learn how to make your website accessible to everyone, including people with disabilities, and why accessibility is essential for modern websites.",
    images: ["https://webfuzsion.co.uk/accessibility-inclusion-puzzle.png"],
  },
}

export default function WebAccessibilityGuideBlogPost() {
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
            A Comprehensive Guide to Web Accessibility
          </h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>April 14, 2025</span>
            <span className="mx-2">•</span>
            <span>Steve at WebFuZsion</span>
            <span className="mx-2">•</span>
            <span>7 min read</span>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src="/accessibility-inclusion-puzzle.png"
              alt="Web accessibility and inclusion concept"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Web accessibility ensures your website can be used by everyone, including people with disabilities. Beyond
              being the right thing to do, accessibility is increasingly becoming a legal requirement and offers
              significant business benefits. This comprehensive guide will help you understand and implement web
              accessibility best practises.
            </p>

            <h2>Understanding WCAG Guidelines</h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) provide standards for making web content more accessible.
              Developed by the World Wide Web Consortium (W3C), these guidelines are organized around four principles:
              websites must be Perceivable, Operable, Understandable, and Robust (POUR).
            </p>

            <p>WCAG has three conformance levels:</p>
            <ul>
              <li>
                <strong>Level A:</strong> The minimum level of accessibility, addressing the most basic accessibility
                features
              </li>
              <li>
                <strong>Level AA:</strong> The standard most organizations aim for, addressing the most common barriers
              </li>
              <li>
                <strong>Level AAA:</strong> The highest level, providing enhanced accessibility for all users
              </li>
            </ul>

            <p>
              For most websites, aiming for WCAG 2.1 Level AA compliance is a good target that balances comprehensive
              accessibility with practical implementation.
            </p>

            <h2>Keyboard Navigation</h2>
            <p>
              Ensure all functionality is available using a keyboard alone, as many users cannot use a mouse. This
              includes people with motor disabilities, visual impairments, and those using alternative input devices.
            </p>

            <p>Key keyboard accessibility considerations include:</p>
            <ul>
              <li>All interactive elements should be focusable using the Tab key</li>
              <li>Focus order should follow a logical sequence</li>
              <li>Focus indicators should be clearly visible</li>
              <li>No keyboard traps where users can't navigate away from an element</li>
              <li>Custom widgets should follow appropriate keyboard interaction patterns</li>
            </ul>

            <p>
              Test your website by unplugging your mouse and navigating using only the keyboard. Can you access all
              features and content? Is it clear which element has focus at all times?
            </p>

            <h2>Alternative Text for Images</h2>
            <p>
              Add descriptive alt text to images so screen readers can convey their content to visually impaired users.
              Effective alt text should concisely describe the image's content and function in context.
            </p>

            <p>Guidelines for writing effective alt text:</p>
            <ul>
              <li>Be specific and descriptive about the image content</li>
              <li>Keep descriptions concise (generally under 125 characters)</li>
              <li>Include relevant information conveyed by the image</li>
              <li>Don't include "image of" or "picture of" (screen readers already announce this)</li>
              <li>Use empty alt attributes (alt="") for decorative images that don't add meaningful content</li>
            </ul>

            <h2>Colour Contrast</h2>
            <p>
              Use sufficient colour contrast between text and background to ensure readability for users with visual
              impairments. WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for
              large text.
            </p>

            <p>Best practises for colour contrast:</p>
            <ul>
              <li>Test your colour combinations using tools like the WebAIM Contrast Checker</li>
              <li>Don't rely solely on colour to convey information</li>
              <li>Consider how your site appears to users with colour blindness</li>
              <li>Provide high contrast modes or user-adjustable contrast settings when possible</li>
              <li>Ensure focus indicators have sufficient contrast against backgrounds</li>
            </ul>

            <h2>Clear Heading Structure</h2>
            <p>
              Implement a logical heading structure (H1, H2, H3, etc.) to help screen reader users navigate your
              content. Headings should create a hierarchical outline of your page content.
            </p>

            <p>Guidelines for heading structure:</p>
            <ul>
              <li>Use only one H1 per page, typically for the main page title</li>
              <li>Don't skip heading levels (e.g., don't jump from H2 to H4)</li>
              <li>Use headings for structure, not for styling (use CSS for visual styling)</li>
              <li>Ensure headings accurately describe the content that follows</li>
              <li>Keep heading text concise and meaningful</li>
            </ul>

            <h2>Accessible Forms</h2>
            <p>
              Label form fields clearly and provide error messages that explain how to fix issues. Forms are often
              critical interaction points on websites, so ensuring their accessibility is particularly important.
            </p>

            <p>Form accessibility best practises:</p>
            <ul>
              <li>Associate labels with form controls using the 'for' attribute</li>
              <li>Group related form elements using fieldset and legend</li>
              <li>Provide clear instructions before the form and within labels</li>
              <li>Ensure error messages are specific and helpful</li>
              <li>Don't rely solely on colour to indicate errors</li>
              <li>Allow sufficient time for form completion</li>
              <li>Support both mouse and keyboard input for all form interactions</li>
            </ul>

            <h2>Transcripts and Captions</h2>
            <p>
              Provide transcripts for audio content and captions for video to make them accessible to deaf or
              hard-of-hearing users. This also benefits users in noisy environments, those who prefer reading to
              listening, and improves content searchability.
            </p>

            <p>Media accessibility guidelines:</p>
            <ul>
              <li>Provide synchronized captions for all video content with audio</li>
              <li>Include audio descriptions for videos when important visual information is presented</li>
              <li>Offer transcripts for audio-only content like podcasts</li>
              <li>Ensure media players have accessible controls</li>
              <li>Avoid auto-playing media with sound</li>
            </ul>

            <h2>Testing with Assistive Technologies</h2>
            <p>
              Regularly test your website with screen readers and other assistive technologies to identify accessibility
              issues. While automated testing tools are helpful, they can only analyse about 30% of accessibility
              issues. Manual testing is essential for comprehensive evaluation.
            </p>

            <p>Testing approaches to consider:</p>
            <ul>
              <li>Test with screen readers like NVDA (free), JAWS, or VoiceOver (built into macOS)</li>
              <li>Use keyboard-only navigation to identify operability issues</li>
              <li>Test with browser extensions that simulate various disabilities</li>
              <li>Conduct user testing with people who have disabilities</li>
              <li>Use automated tools like Axe or WAVE as a starting point</li>
            </ul>

            <h2>Additional Accessibility Considerations</h2>

            <h3>Responsive Design</h3>
            <p>
              Ensure your website works well at different zoom levels and on various devices. Users with visual
              impairments often zoom in to read content, and your layout should accommodate this without horizontal
              scrolling or overlapping elements.
            </p>

            <h3>Document Structure</h3>
            <p>
              Use semantic HTML elements like &lt;nav&gt;, &lt;main&gt;, &lt;article&gt;, and &lt;section&gt; to provide
              clear document structure. These elements help assistive technologies understand the page organization and
              improve navigation.
            </p>

            <h3>Link Text</h3>
            <p>
              Use descriptive link text that makes sense out of context. Avoid generic phrases like "click here" or
              "read more" as these don't provide meaningful information to screen reader users who may navigate by
              scanning links.
            </p>

            <h3>ARIA Roles and Attributes</h3>
            <p>
              Use ARIA (Accessible Rich Internet Applications) roles and attributes when necessary to enhance
              accessibility, particularly for dynamic content and custom widgets. However, remember that native HTML
              elements with built-in accessibility are always preferable when available.
            </p>

            <h2>The Business Case for Accessibility</h2>

            <p>Beyond ethical and legal considerations, web accessibility offers significant business benefits:</p>

            <ul>
              <li>
                <strong>Expanded audience:</strong> Approximately 15% of the global population has some form of
                disability
              </li>
              <li>
                <strong>SEO improvements:</strong> Many accessibility practises also enhance search engine optimisation
              </li>
              <li>
                <strong>Better usability for all:</strong> Accessible sites are generally more usable for everyone
              </li>
              <li>
                <strong>Legal compliance:</strong> Reduces the risk of lawsuits and complaints
              </li>
              <li>
                <strong>Brand reputation:</strong> Demonstrates corporate social responsibility
              </li>
            </ul>

            <h2>Conclusion</h2>

            <p>
              Web accessibility is not just about compliance—it's about creating an inclusive digital environment where
              everyone can access and interact with your content. By implementing these accessibility best practises,
              you'll not only make your website available to a wider audience but also improve the overall user
              experience for all visitors.
            </p>

            <p>
              At WebFuZsion, we believe the web should be accessible to everyone. We incorporate accessibility best
              practises into all our web design projects, ensuring that the websites we create are usable by as many
              people as possible, regardless of their abilities or disabilities.
            </p>

            <div className="mt-8 p-6 bg-brand-dark/50 border border-brand-blue/30 rounded-lg">
              <h3 className="text-xl font-bold text-brand-pink mb-3">Need Help Making Your Website Accessible?</h3>
              <p className="mb-4">
                Our team can audit your existing website for accessibility issues or help you build a new site that's
                accessible from the ground up. Contact us to discuss how we can help make your digital presence more
                inclusive.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Contact Us About Accessibility
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
