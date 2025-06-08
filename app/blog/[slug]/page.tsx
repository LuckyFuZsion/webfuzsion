import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BlogPostClient from "./BlogPostClient"

// Static blog posts data - same as in the main blog page
const BLOG_POSTS = [
  {
    slug: "diy-vs-professional-web-design",
    title: "DIY vs. Professional Web Design: When to Hire an Expert",
    excerpt:
      "Discover when to build your own website vs. hiring a professional web designer. Compare costs, time, quality, and long-term benefits to make the right choice for your business.",
    date: "2024-12-06",
    author: "WebFuZsion Team",
    image: "https://gxciioabwrkahdfe.public.blob.vercel-storage.com/logos/Opengraph-LTuWN7l8ecvsZc73ZO51pjs0Rn03AN.png",
    category: "Business Strategy",
    reading_time: "12 min read",
    content: `
      <div class="blog-content">
        <h1>DIY vs. Professional Web Design: When to Hire an Expert</h1>
        
        <p>In today's digital landscape, having a strong online presence is crucial for business success. One of the first decisions you'll face is whether to build your own website yourself or hire a professional web designer. This comprehensive guide will help you understand the pros and cons of each approach and determine which option is best for your specific situation.</p>

        <h2>The DIY Approach: Building Your Own Website</h2>

        <h3>✅ Advantages of DIY Web Design</h3>

        <ul>
          <li><strong>Cost-Effective:</strong> DIY website builders like Wix, Squarespace, and WordPress.com offer affordable monthly plans starting from £10-30 per month.</li>
          <li><strong>Complete Control:</strong> You have full control over the design process and can make changes whenever you want.</li>
          <li><strong>Learning Experience:</strong> Building your own website helps you understand how websites work and gives you valuable digital skills.</li>
          <li><strong>Quick Start:</strong> Many website builders offer templates that allow you to get online quickly.</li>
          <li><strong>No Communication Barriers:</strong> You don't need to explain your vision to someone else – you can implement it directly.</li>
        </ul>

        <h3>❌ Disadvantages of DIY Web Design</h3>

        <ul>
          <li><strong>Time-Intensive:</strong> Learning to build a website properly takes significant time that could be spent on your core business.</li>
          <li><strong>Limited Customisation:</strong> Template-based solutions often have restrictions on design and functionality.</li>
          <li><strong>Technical Challenges:</strong> You may encounter technical issues that are difficult to resolve without expertise.</li>
          <li><strong>SEO Limitations:</strong> Without proper knowledge, your website may not be optimised for search engines.</li>
          <li><strong>Professional Appearance:</strong> It can be challenging to achieve a truly professional look without design experience.</li>
        </ul>

        <h2>Professional Web Design: Hiring an Expert</h2>

        <h3>✅ Advantages of Professional Web Design</h3>

        <ul>
          <li><strong>Expertise and Experience:</strong> Professional designers bring years of experience and knowledge of current best practices.</li>
          <li><strong>Custom Solutions:</strong> A professional can create a completely custom website tailored to your specific needs and brand.</li>
          <li><strong>Time Savings:</strong> While you focus on running your business, the professional handles all technical aspects.</li>
          <li><strong>SEO Optimisation:</strong> Professionals understand how to build websites that rank well in search engines.</li>
          <li><strong>Mobile Responsiveness:</strong> Ensures your website works perfectly on all devices and screen sizes.</li>
          <li><strong>Ongoing Support:</strong> Many professionals offer maintenance and support services.</li>
          <li><strong>Professional Appearance:</strong> A custom-designed website often looks more professional and trustworthy.</li>
        </ul>

        <h3>❌ Disadvantages of Professional Web Design</h3>

        <ul>
          <li><strong>Higher Initial Cost:</strong> Professional web design typically costs between £1,000-£10,000+ depending on complexity.</li>
          <li><strong>Less Direct Control:</strong> You'll need to communicate your vision and may need to go through the designer for changes.</li>
          <li><strong>Timeline Dependencies:</strong> Your project timeline depends on the designer's availability and workload.</li>
          <li><strong>Ongoing Costs:</strong> You may need to pay for updates, maintenance, and hosting separately.</li>
        </ul>

        <h2>When to Choose DIY Web Design</h2>

        <p>DIY web design might be the right choice if:</p>

        <ul>
          <li>You have a very limited budget (under £500)</li>
          <li>You need a simple website with basic functionality</li>
          <li>You enjoy learning new technical skills</li>
          <li>You have plenty of time to dedicate to the project</li>
          <li>Your business is just starting and you're testing the market</li>
          <li>You need to launch quickly and can improve later</li>
        </ul>

        <h2>When to Hire a Professional</h2>

        <p>Professional web design is recommended when:</p>

        <ul>
          <li>Your business depends heavily on online presence</li>
          <li>You need custom functionality or integrations</li>
          <li>You want to rank well in search engines</li>
          <li>Your time is better spent on core business activities</li>
          <li>You need e-commerce capabilities</li>
          <li>Your brand requires a unique, professional appearance</li>
          <li>You plan to scale and need a robust foundation</li>
        </ul>

        <h2>The Hybrid Approach: Best of Both Worlds</h2>

        <p>Consider a hybrid approach where you:</p>

        <ul>
          <li>Start with a professional design and learn to make minor updates yourself</li>
          <li>Use a professional for the initial setup and handle content updates</li>
          <li>Begin with DIY and upgrade to professional design as your business grows</li>
          <li>Hire a professional for design and handle your own content management</li>
        </ul>

        <h2>Cost Comparison</h2>

        <h3>DIY Costs:</h3>
        <ul>
          <li>Website builder subscription: £10-30/month</li>
          <li>Domain name: £10-15/year</li>
          <li>Premium templates: £50-200 (one-time)</li>
          <li>Your time: 20-100+ hours</li>
        </ul>

        <h3>Professional Design Costs:</h3>
        <ul>
          <li>Basic website: £1,000-£3,000</li>
          <li>Business website: £3,000-£7,000</li>
          <li>E-commerce site: £5,000-£15,000+</li>
          <li>Enterprise solution: £10,000+</li>
        </ul>

        <h2>Making the Right Decision</h2>

        <p>The choice between DIY and professional web design ultimately depends on your specific circumstances. Consider these key factors:</p>

        <ol>
          <li><strong>Budget:</strong> How much can you realistically invest in your website?</li>
          <li><strong>Timeline:</strong> How quickly do you need to be online?</li>
          <li><strong>Technical Skills:</strong> Are you comfortable learning new technology?</li>
          <li><strong>Business Goals:</strong> How important is your website to your business success?</li>
          <li><strong>Long-term Vision:</strong> Where do you see your business in 2-3 years?</li>
        </ol>

        <h2>Conclusion</h2>

        <p>Both DIY and professional web design have their place in the digital landscape. If you're just starting out or have a simple website need, DIY might be perfect. However, if your business depends on your online presence or you need advanced functionality, investing in professional design often pays for itself through improved user experience, better search rankings, and increased conversions.</p>

        <p>Remember, your website is often the first impression potential customers have of your business. Whether you choose DIY or professional design, ensure it accurately represents your brand and provides value to your visitors.</p>

        <blockquote>
          "Your website is your digital storefront. Make sure it welcomes customers and showcases your business in the best possible light."
        </blockquote>

        <p>At WebFuZsion, we understand that every business has unique needs and budgets. We offer flexible solutions ranging from consultation for DIY projects to full custom web design services. <a href="/contact">Contact us</a> to discuss which approach might be best for your business.</p>
      </div>
    `,
  },
  // Add other blog posts here as needed
]

// Function to get blog post data from static array
function getBlogPost(slug: string) {
  console.log(`[getBlogPost] Looking for slug: ${slug}`)

  const post = BLOG_POSTS.find((p) => p.slug === slug)

  if (!post) {
    console.log(`[getBlogPost] Post not found for slug: ${slug}`)
    return null
  }

  console.log(`[getBlogPost] Found post: ${post.title}`)
  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found | WebFuZsion",
      description: "The blog post you're looking for doesn't exist or has been moved.",
    }
  }

  return {
    title: `${post.title} | WebFuZsion Blog`,
    description:
      post.excerpt ||
      `Read our blog post about ${post.title.toLowerCase()} and learn more about web design and digital marketing.`,
    openGraph: {
      title: `${post.title} | WebFuZsion Blog`,
      description:
        post.excerpt ||
        `Read our blog post about ${post.title.toLowerCase()} and learn more about web design and digital marketing.`,
      type: "article",
      url: `https://webfuzsion.co.uk/blog/${params.slug}`,
      images: [
        {
          url: post.image || "/blog-post-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "WebFuZsion blog post",
      images: [post.image || "/blog-post-image.png"],
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  console.log(`[BlogPost] Rendering blog post page for slug: ${params.slug}`)

  const post = getBlogPost(params.slug)

  // If post doesn't exist, show 404 page
  if (!post) {
    console.log(`[BlogPost] Blog post not found, showing 404: ${params.slug}`)
    notFound()
  }

  console.log(`[BlogPost] Successfully loaded post: ${post.title}`)

  // Format the blog post data for the client component
  const blogPost = {
    title: post.title,
    date: post.date,
    author: post.author,
    readTime: post.reading_time,
    category: post.category,
    imageUrl: post.image,
    content: post.content,
    tags: [],
    excerpt: post.excerpt,
  }

  return <BlogPostClient blogPost={blogPost} slug={params.slug} />
}
