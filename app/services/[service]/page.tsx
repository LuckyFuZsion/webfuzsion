import type { Metadata } from "next"
import ServicePageClient from "./ServicePageClient"

// Service data
const services = {
  "full-website-builds": {
    title: "Full Website Builds",
    description: "Complete website design and development from concept to launch, tailored to your business needs.",
    metaTitle: "Professional Website Design & Development in Grantham | WebFuZsion",
    metaDescription:
      "Complete website design and development services in Grantham. Custom websites built from concept to launch, tailored to your business needs.",
    keywords:
      "website design Grantham, web development Lincolnshire, custom website build, professional website design, business website creation",
    image: "/responsive-devices-showcase.png",
    features: [
      "Custom design tailored to your brand",
      "Mobile-responsive layout",
      "SEO optimization",
      "Contact forms and integrations",
      "Social media integration",
      "Content management system (if required)",
      "Analytics setup",
      "Training and documentation",
    ],
    price: "From £500",
    earlyBirdPrice: "From £300 (Limited Time)",
    timeframe: "2-4 weeks",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
  "landing-pages": {
    title: "Landing Pages",
    description: "High-converting landing pages designed to capture leads and drive customer action.",
    metaTitle: "High-Converting Landing Page Design in Grantham | WebFuZsion",
    metaDescription:
      "Professional landing page design services in Grantham. Create high-converting landing pages that capture leads and drive customer action.",
    keywords:
      "landing page design Grantham, lead generation pages, conversion-focused web design, landing page development Lincolnshire",
    image: "/modern-ecommerce-checkout.png",
    features: [
      "Conversion-focused design",
      "Clear call-to-action elements",
      "Mobile optimization",
      "A/B testing capability",
      "Lead capture forms",
      "Integration with marketing tools",
      "Fast loading speed",
      "Analytics tracking",
    ],
    price: "From £300",
    earlyBirdPrice: "From £200 (Limited Time)",
    timeframe: "1-2 weeks",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
  redesigns: {
    title: "Website Redesigns",
    description: "Transform your outdated website into a modern, user-friendly digital experience.",
    metaTitle: "Website Redesign Services in Grantham | Modern Web Design | WebFuZsion",
    metaDescription:
      "Transform your outdated website into a modern, user-friendly digital experience. Professional website redesign services in Grantham and Lincolnshire.",
    keywords:
      "website redesign Grantham, website refresh, modern web design, website update Lincolnshire, website modernization",
    image: "/content-web-integration.png",
    features: [
      "Modern, updated design",
      "Improved user experience",
      "Mobile responsiveness",
      "Enhanced SEO structure",
      "Faster loading speeds",
      "Updated content and imagery",
      "Improved navigation",
      "New functionality integration",
    ],
    price: "From £400",
    earlyBirdPrice: "From £300 (Limited Time)",
    timeframe: "2-3 weeks",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
  maintenance: {
    title: "Website Maintenance",
    description: "Keep your website secure, updated, and performing at its best with our maintenance services.",
    metaTitle: "Website Maintenance Services in Grantham | WebFuZsion",
    metaDescription:
      "Professional website maintenance services in Grantham. Keep your website secure, updated, and performing at its best with our comprehensive maintenance packages.",
    keywords:
      "website maintenance Grantham, website updates, website security, website support Lincolnshire, website care plans",
    image: "/website-speed-metrics-dashboard.png",
    features: [
      "Regular software updates",
      "Security monitoring",
      "Performance optimization",
      "Regular backups",
      "Content updates",
      "Technical support",
      "Monthly reports",
      "SEO monitoring",
    ],
    price: "From £100/month",
    earlyBirdPrice: "From £75/month (Limited Time)",
    timeframe: "Ongoing",
    localAreas: ["Grantham", "Stamford", "Bourne", "Sleaford", "Newark", "Melton Mowbray", "Oakham"],
  },
}

// Generate metadata for each service page
export async function generateMetadata({ params }: { params: { service: string } }): Promise<Metadata> {
  const service = params.service
  const serviceData = services[service as keyof typeof services]

  if (!serviceData) {
    return {
      title: "Web Design Services | WebFuZsion",
      description: "Professional web design services for businesses across Lincolnshire and beyond.",
    }
  }

  return {
    title: serviceData.metaTitle,
    description: serviceData.metaDescription,
    keywords: serviceData.keywords,
    alternates: {
      canonical: `https://webfuzsion.co.uk/services/${service}`,
    },
    openGraph: {
      title: serviceData.metaTitle,
      description: serviceData.metaDescription,
      url: `https://webfuzsion.co.uk/services/${service}`,
      siteName: "WebFuZsion Web Design Studio",
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: `https://webfuzsion.co.uk${serviceData.image}`,
          width: 1200,
          height: 630,
          alt: serviceData.title,
        },
      ],
    },
  }
}

export default function ServicePage({ params }: { params: { service: string } }) {
  return <ServicePageClient params={params} />
}
