import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Helper function to check authentication
function isAuthenticated() {
  const authCookie = cookies().get("admin-auth")
  return authCookie && authCookie.value === "authenticated"
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
  return `${readingTime} min read`
}

// Your existing blog posts data
const existingBlogPosts = [
  {
    slug: "content-marketing-for-web-design",
    title: "Content Marketing for Web Design: Building Your Brand Through Valuable Content",
    excerpt:
      "Learn how to leverage content marketing to grow your web design business and attract more clients through valuable, engaging content.",
    content: `<h2>Why Content Marketing Matters for Web Designers</h2>
<p>In today's competitive digital landscape, web designers need more than just technical skills to succeed. Content marketing has become an essential tool for building brand awareness, establishing expertise, and attracting potential clients.</p>

<h2>Creating Valuable Content for Your Audience</h2>
<p>Your content should address the pain points and questions your potential clients have. Consider topics like:</p>
<ul>
<li>Web design best practices</li>
<li>User experience tips</li>
<li>Website maintenance guides</li>
<li>Industry trends and insights</li>
</ul>

<h2>Content Types That Work</h2>
<p>Diversify your content strategy with:</p>
<ul>
<li><strong>Blog posts</strong> - In-depth articles about web design topics</li>
<li><strong>Case studies</strong> - Showcase your successful projects</li>
<li><strong>Tutorials</strong> - Step-by-step guides for common tasks</li>
<li><strong>Infographics</strong> - Visual representations of data and processes</li>
</ul>

<h2>Measuring Success</h2>
<p>Track your content marketing efforts through:</p>
<ul>
<li>Website traffic and engagement metrics</li>
<li>Lead generation and conversion rates</li>
<li>Social media shares and comments</li>
<li>Client inquiries and referrals</li>
</ul>

<p>Remember, content marketing is a long-term strategy that builds trust and authority over time. Stay consistent and focus on providing genuine value to your audience.</p>`,
    author: "WebFuZsion",
    date: "2024-01-15",
    category: "Marketing",
    tags: ["content marketing", "web design", "business growth", "digital marketing"],
    image: "/blog-post-image.png",
  },
  {
    slug: "do-businesses-need-websites-in-social-media-age",
    title: "Do Businesses Still Need Websites in the Social Media Age?",
    excerpt:
      "Exploring whether traditional websites remain relevant when social media platforms offer direct customer engagement and built-in audiences.",
    content: `<h2>The Social Media Revolution</h2>
<p>Social media platforms have transformed how businesses connect with customers. With billions of users on platforms like Facebook, Instagram, and TikTok, many business owners wonder if they still need a traditional website.</p>

<h2>The Case for Social Media Only</h2>
<p>Social media platforms offer several advantages:</p>
<ul>
<li><strong>Built-in audiences</strong> - Millions of potential customers already using the platform</li>
<li><strong>Easy setup</strong> - Create a business profile in minutes</li>
<li><strong>Direct engagement</strong> - Real-time interaction with customers</li>
<li><strong>Cost-effective</strong> - Many features are free to use</li>
</ul>

<h2>Why Websites Still Matter</h2>
<p>However, websites provide unique benefits that social media cannot match:</p>
<ul>
<li><strong>Complete control</strong> - You own your content and data</li>
<li><strong>Professional credibility</strong> - Establishes trust and legitimacy</li>
<li><strong>SEO benefits</strong> - Appear in Google search results</li>
<li><strong>Detailed information</strong> - Comprehensive product/service descriptions</li>
<li><strong>E-commerce capabilities</strong> - Full online store functionality</li>
</ul>

<h2>The Hybrid Approach</h2>
<p>The most effective strategy combines both:</p>
<ul>
<li>Use social media for engagement and discovery</li>
<li>Direct traffic to your website for conversions</li>
<li>Maintain consistent branding across all platforms</li>
<li>Leverage each platform's unique strengths</li>
</ul>

<h2>Conclusion</h2>
<p>While social media is powerful for customer engagement, websites remain essential for business credibility, control, and comprehensive online presence. The best approach is to use both strategically, with your website serving as your digital headquarters and social media as your outreach tools.</p>`,
    author: "WebFuZsion",
    date: "2024-01-10",
    category: "Business",
    tags: ["social media", "websites", "business strategy", "digital presence"],
    image: "/website-vs-social-media.png",
  },
  {
    slug: "do-businesses-still-need-websites",
    title: "Do Businesses Still Need Websites? The Digital Landscape in 2024",
    excerpt:
      "In an era of social media dominance and mobile apps, we explore whether traditional websites remain essential for business success.",
    content: `<h2>The Changing Digital Landscape</h2>
<p>The digital world has evolved dramatically over the past decade. With the rise of social media platforms, mobile apps, and online marketplaces, many business owners question whether they still need a traditional website.</p>

<h2>The Arguments Against Websites</h2>
<p>Some businesses argue that websites are becoming obsolete because:</p>
<ul>
<li>Social media provides direct customer interaction</li>
<li>Marketplace platforms like Amazon handle e-commerce</li>
<li>Mobile apps offer better user experiences</li>
<li>Younger consumers prefer social platforms</li>
</ul>

<h2>Why Websites Remain Crucial</h2>
<p>Despite these arguments, websites continue to be essential for several reasons:</p>

<h3>1. Professional Credibility</h3>
<p>A well-designed website establishes trust and legitimacy. Customers expect businesses to have an online presence they can verify independently.</p>

<h3>2. Search Engine Visibility</h3>
<p>Websites are crucial for SEO. When customers search for products or services, businesses with optimized websites appear in search results.</p>

<h3>3. Complete Control</h3>
<p>Unlike social media platforms, you own your website. You control the content, design, and user experience without worrying about algorithm changes or platform policies.</p>

<h3>4. Comprehensive Information Hub</h3>
<p>Websites can house detailed information about your products, services, company history, and contact details in an organized, searchable format.</p>

<h2>The Modern Website Strategy</h2>
<p>Today's successful businesses use websites as part of an integrated digital strategy:</p>
<ul>
<li><strong>Hub and spoke model</strong> - Website as the central hub, social media as spokes</li>
<li><strong>Mobile-first design</strong> - Optimized for smartphone users</li>
<li><strong>Fast loading times</strong> - Essential for user retention</li>
<li><strong>Clear calls-to-action</strong> - Guide visitors toward desired actions</li>
</ul>

<h2>Conclusion</h2>
<p>While the digital landscape continues to evolve, websites remain a cornerstone of business success. They provide credibility, control, and comprehensive information that social media and apps cannot fully replace. The key is creating a website that works seamlessly with your other digital marketing efforts.</p>`,
    author: "WebFuZsion",
    date: "2024-01-08",
    category: "Business",
    tags: ["websites", "business", "digital marketing", "online presence"],
    image: "/business-website-importance.png",
  },
  {
    slug: "early-bird-website-pricing-offer",
    title: "Early Bird Website Pricing: Limited Time Offer for New Businesses",
    excerpt:
      "Take advantage of our special early bird pricing for new businesses looking to establish their online presence with professional web design.",
    content: `<h2>Special Launch Pricing for New Businesses</h2>
<p>We're excited to announce our early bird pricing offer for new businesses ready to make their mark online. This limited-time opportunity provides exceptional value for startups and small businesses.</p>

<h2>What's Included in Our Early Bird Package</h2>
<ul>
<li><strong>Custom Website Design</strong> - Tailored to your brand and industry</li>
<li><strong>Mobile Responsive Layout</strong> - Looks great on all devices</li>
<li><strong>SEO Optimization</strong> - Help customers find you online</li>
<li><strong>Contact Forms</strong> - Easy way for customers to reach you</li>
<li><strong>Social Media Integration</strong> - Connect your online presence</li>
<li><strong>Basic Analytics Setup</strong> - Track your website performance</li>
</ul>

<h2>Why Choose WebFuZsion</h2>
<p>Our team brings years of experience in web design and digital marketing. We understand the unique challenges facing new businesses and create solutions that grow with you.</p>

<h3>Our Process</h3>
<ol>
<li><strong>Discovery Call</strong> - We learn about your business and goals</li>
<li><strong>Design Mockups</strong> - Visual concepts for your approval</li>
<li><strong>Development</strong> - Building your website with modern technologies</li>
<li><strong>Testing & Launch</strong> - Ensuring everything works perfectly</li>
<li><strong>Training</strong> - Teaching you how to manage your new site</li>
</ol>

<h2>Limited Time Offer</h2>
<p>This early bird pricing is available for a limited time only. We're offering:</p>
<ul>
<li>50% off our standard design fee</li>
<li>Free domain registration for the first year</li>
<li>Complimentary hosting setup</li>
<li>One month of free maintenance and updates</li>
</ul>

<h2>Perfect for These Industries</h2>
<ul>
<li>Local service businesses</li>
<li>Restaurants and cafes</li>
<li>Professional services</li>
<li>Retail and e-commerce</li>
<li>Creative professionals</li>
</ul>

<h2>Ready to Get Started?</h2>
<p>Don't miss this opportunity to establish your online presence at an unbeatable price. Contact us today to discuss your project and secure your early bird pricing.</p>

<p><strong>Offer expires soon - act now to secure your spot!</strong></p>`,
    author: "WebFuZsion",
    date: "2024-01-05",
    category: "Business",
    tags: ["pricing", "special offer", "new business", "web design"],
    image: "/early-bird-offer.png",
  },
  {
    slug: "ecommerce-design-best-practices",
    title: "E-commerce Design Best Practices: Converting Visitors into Customers",
    excerpt:
      "Essential design principles and strategies for creating e-commerce websites that drive sales and provide excellent user experiences.",
    content: `<h2>The Foundation of Successful E-commerce Design</h2>
<p>E-commerce design goes beyond aesthetics—it's about creating a seamless shopping experience that guides visitors toward making a purchase. Every element should work together to build trust and reduce friction in the buying process.</p>

<h2>Essential Design Elements</h2>

<h3>1. Clear Navigation</h3>
<p>Your navigation should be intuitive and help customers find products quickly:</p>
<ul>
<li>Logical category structure</li>
<li>Search functionality with filters</li>
<li>Breadcrumb navigation</li>
<li>Consistent menu placement</li>
</ul>

<h3>2. Product Pages That Convert</h3>
<p>Product pages are where purchasing decisions are made:</p>
<ul>
<li><strong>High-quality images</strong> - Multiple angles and zoom functionality</li>
<li><strong>Detailed descriptions</strong> - Benefits, specifications, and use cases</li>
<li><strong>Customer reviews</strong> - Social proof builds trust</li>
<li><strong>Clear pricing</strong> - No hidden costs or confusion</li>
<li><strong>Prominent CTA buttons</strong> - "Add to Cart" should stand out</li>
</ul>

<h3>3. Streamlined Checkout Process</h3>
<p>Reduce cart abandonment with an optimized checkout:</p>
<ul>
<li>Guest checkout option</li>
<li>Progress indicators</li>
<li>Multiple payment methods</li>
<li>Security badges and SSL certificates</li>
<li>Clear shipping and return policies</li>
</ul>

<h2>Mobile-First Approach</h2>
<p>With mobile commerce growing rapidly, your e-commerce site must excel on smartphones:</p>
<ul>
<li>Touch-friendly buttons and navigation</li>
<li>Fast loading times</li>
<li>Simplified checkout for small screens</li>
<li>Mobile payment options (Apple Pay, Google Pay)</li>
</ul>

<h2>Building Trust and Credibility</h2>
<p>Online shoppers need to trust your business before making a purchase:</p>
<ul>
<li><strong>Professional design</strong> - Clean, modern appearance</li>
<li><strong>Contact information</strong> - Easy to find phone, email, and address</li>
<li><strong>Security features</strong> - SSL certificates and secure payment processing</li>
<li><strong>Customer testimonials</strong> - Real reviews and ratings</li>
<li><strong>Return policy</strong> - Clear, fair return and refund policies</li>
</ul>

<h2>Performance Optimization</h2>
<p>Site speed directly impacts sales:</p>
<ul>
<li>Optimize images for web</li>
<li>Use content delivery networks (CDNs)</li>
<li>Minimize plugins and scripts</li>
<li>Regular performance monitoring</li>
</ul>

<h2>Measuring Success</h2>
<p>Track these key metrics to optimize your e-commerce site:</p>
<ul>
<li>Conversion rate</li>
<li>Average order value</li>
<li>Cart abandonment rate</li>
<li>Page load times</li>
<li>Customer lifetime value</li>
</ul>

<h2>Conclusion</h2>
<p>Successful e-commerce design balances aesthetics with functionality, always prioritizing the user experience. By focusing on clear navigation, compelling product pages, and streamlined checkout processes, you can create an online store that not only looks great but also drives sales and customer satisfaction.</p>`,
    author: "WebFuZsion",
    date: "2024-01-12",
    category: "Web Design",
    tags: ["ecommerce", "web design", "user experience", "conversion optimization"],
    image: "/modern-ecommerce-checkout.png",
  },
  {
    slug: "importance-of-business-website",
    title: "The Importance of Having a Business Website in 2024",
    excerpt:
      "Discover why every business needs a professional website and how it can transform your company's growth and customer reach.",
    content: `<h2>Your Digital Storefront Never Closes</h2>
<p>In today's digital-first world, your website serves as your business's most important asset. It's your 24/7 storefront, marketing tool, and customer service representative all rolled into one. Let's explore why having a professional website is no longer optional—it's essential.</p>

<h2>Credibility and Trust</h2>
<p>A professional website immediately establishes credibility with potential customers. Studies show that 75% of consumers judge a company's credibility based on their website design. Without a website, you're missing out on countless opportunities to make a positive first impression.</p>

<h3>What Builds Trust Online:</h3>
<ul>
<li>Professional design and layout</li>
<li>Clear contact information</li>
<li>Customer testimonials and reviews</li>
<li>Secure payment processing</li>
<li>Regular content updates</li>
</ul>

<h2>Reach More Customers</h2>
<p>Your website extends your reach far beyond your local area. With proper SEO optimization, customers from around the world can discover your business through search engines.</p>

<h3>Benefits of Online Visibility:</h3>
<ul>
<li><strong>24/7 accessibility</strong> - Customers can find you anytime</li>
<li><strong>Global reach</strong> - Expand beyond geographical limitations</li>
<li><strong>Cost-effective marketing</strong> - Reach more people for less money</li>
<li><strong>Targeted advertising</strong> - Connect with your ideal customers</li>
</ul>

<h2>Showcase Your Products and Services</h2>
<p>Your website provides unlimited space to showcase what you offer. Unlike print advertisements or business cards, you can include:</p>
<ul>
<li>Detailed product descriptions</li>
<li>High-quality images and videos</li>
<li>Customer case studies</li>
<li>Portfolio of past work</li>
<li>Pricing information</li>
</ul>

<h2>Improve Customer Service</h2>
<p>A well-designed website can answer customer questions before they even ask them. This reduces the burden on your staff while improving customer satisfaction.</p>

<h3>Self-Service Features:</h3>
<ul>
<li>FAQ sections</li>
<li>Product manuals and guides</li>
<li>Online booking systems</li>
<li>Live chat support</li>
<li>Contact forms</li>
</ul>

<h2>Compete with Larger Businesses</h2>
<p>A professional website levels the playing field. Small businesses can compete with larger corporations by providing excellent online experiences that showcase their unique value propositions.</p>

<h2>Generate Leads and Sales</h2>
<p>Your website works as a powerful lead generation tool:</p>
<ul>
<li>Contact forms capture potential customers</li>
<li>Email newsletter signups build your audience</li>
<li>E-commerce functionality enables direct sales</li>
<li>Call-to-action buttons guide visitors toward conversion</li>
</ul>

<h2>Analytics and Insights</h2>
<p>Unlike traditional marketing, websites provide detailed analytics about your customers:</p>
<ul>
<li>Who visits your site</li>
<li>What pages they view</li>
<li>How long they stay</li>
<li>Where they come from</li>
<li>What actions they take</li>
</ul>

<h2>Cost-Effective Marketing</h2>
<p>Compared to traditional advertising methods, a website offers exceptional return on investment:</p>
<ul>
<li>One-time design cost vs. ongoing ad spend</li>
<li>Reaches thousands of potential customers</li>
<li>Works 24/7 without additional cost</li>
<li>Easy to update and modify</li>
</ul>

<h2>Conclusion</h2>
<p>In 2024, having a business website isn't just recommended—it's essential for survival and growth. Whether you're a local service provider or a global retailer, your website serves as the foundation of your digital presence and the key to reaching new customers.</p>

<p>Don't let your competition get ahead. Invest in a professional website today and watch your business grow.</p>`,
    author: "WebFuZsion",
    date: "2024-01-20",
    category: "Business",
    tags: ["business website", "digital presence", "online marketing", "business growth"],
    image: "/business-website-importance.png",
  },
]

export async function POST(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Starting manual blog import...")

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    const results = {
      imported: 0,
      updated: 0,
      errors: 0,
      details: [] as string[],
    }

    for (const post of existingBlogPosts) {
      try {
        console.log(`Processing blog post: ${post.title}`)

        // Prepare post data
        const postData = {
          slug: post.slug,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          date: post.date,
          image: post.image,
          tags: post.tags,
          category: post.category,
          reading_time: calculateReadingTime(post.content),
          updated_at: new Date().toISOString(),
        }

        // Check if post already exists
        const { data: existingPost, error: queryError } = await supabase
          .from("blog_posts")
          .select("slug")
          .eq("slug", post.slug)
          .maybeSingle()

        if (queryError) {
          console.error(`Error querying post ${post.slug}:`, queryError)
          results.errors++
          results.details.push(`Error querying ${post.title}: ${queryError.message}`)
          continue
        }

        if (existingPost) {
          // Update existing post
          const { error: updateError } = await supabase.from("blog_posts").update(postData).eq("slug", post.slug)

          if (updateError) {
            console.error(`Error updating post ${post.slug}:`, updateError)
            results.errors++
            results.details.push(`Error updating ${post.title}: ${updateError.message}`)
          } else {
            results.updated++
            results.details.push(`Updated: ${post.title}`)
            console.log(`Updated blog post: ${post.title}`)
          }
        } else {
          // Insert new post
          const { error: insertError } = await supabase.from("blog_posts").insert({
            ...postData,
            created_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error(`Error inserting post ${post.slug}:`, insertError)
            results.errors++
            results.details.push(`Error inserting ${post.title}: ${insertError.message}`)
          } else {
            results.imported++
            results.details.push(`Imported: ${post.title}`)
            console.log(`Imported blog post: ${post.title}`)
          }
        }
      } catch (error) {
        console.error(`Unexpected error processing ${post.title}:`, error)
        results.errors++
        results.details.push(
          `Unexpected error with ${post.title}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    console.log("Manual blog import completed:", results)

    return NextResponse.json({
      success: true,
      message: "Manual blog import completed",
      results,
    })
  } catch (error) {
    console.error("Error in manual blog import:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import blog posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "Manual blog import endpoint ready",
      postsToImport: existingBlogPosts.length,
      posts: existingBlogPosts.map((post) => ({
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
      })),
    })
  } catch (error) {
    console.error("Error in manual blog import GET:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get import information",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
