import type React from "react"
import "@/app/globals.css"
import "@/app/hide-tag-assistant.css" // Import the CSS to hide Tag Assistant
import { ThemeProvider } from "@/components/theme-provider"
import { PageTransition } from "@/components/page-transition"
import { CustomCursor } from "@/components/custom-cursor"
import { FloatingContactMenu } from "@/components/floating-contact-menu"
import { WebDesignBusinessJsonLd, LocalBusinessJsonLd, WebsiteJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import { FAQSchema } from "@/components/faq-schema"
import { ReviewJsonLd } from "@/components/json-ld"
import ConsentBanner from "@/components/consent-banner"
import AnalyticsTracker from "@/components/analytics-tracker"
import { Suspense } from "react"

// External CDN URL for OpenGraph image
const ogImageUrl =
  "https://opengraph.b-cdn.net/production/images/41f632b8-c98b-48a2-b8d8-4c82c4d97bb6.png?token=6AwC-lCEuCc5RIDYBab1rWUmmtU0Y0lKrzj_EDH3tfc&height=627&width=1200&expires=33282745666"

export const metadata = {
  // Updated title tag - shortened to 59 characters
  title: "WebFuZsion | Professional Web Design Services in Grantham, Lincolnshire, UK",
  // Updated meta description - shortened to 158 characters
  description:
    "Expert web design for small businesses and tradesmen in Grantham, Lincolnshire and beyond. Custom websites, landing pages, and redesigns at competitive prices.",
  keywords:
    "web design Grantham, website development Grantham, Grantham web designer, Lincolnshire web design, small business websites Grantham, tradesman websites Grantham, content creator websites, professional web design, affordable web design Grantham, UK web design, responsive websites, global web design",
  authors: [{ name: "WebFuZsion" }],
  creator: "WebFuZsion",
  publisher: "WebFuZsion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://webfuzsion.co.uk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    // Updated OpenGraph title
    title: "WebFuZsion | Professional Web Design Services in Grantham, Lincolnshire, UK",
    // Updated OpenGraph description
    description:
      "Expert web design for small businesses and tradesmen in Grantham, Lincolnshire and beyond. Custom websites, landing pages, and redesigns at competitive prices.",
    url: "https://webfuzsion.co.uk",
    siteName: "WebFuZsion Web Design Studio",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 627,
        alt: "WebFuZsion Web Design Studio - Professional web design services",
      },
    ],
    locale: "en_GB",
    type: "website",
    appId: "1178547523595198",
  },
  twitter: {
    card: "summary_large_image",
    // Updated Twitter title
    title: "WebFuZsion | Professional Web Design Services in Grantham, Lincolnshire, UK",
    // Updated Twitter description
    description:
      "Expert web design for small businesses and tradesmen in Grantham, Lincolnshire and beyond. Custom websites, landing pages, and redesigns at competitive prices.",
    images: [ogImageUrl],
  },
  icons: {
    icon: [
      { url: `/favicon.ico`, sizes: "any" },
      { url: `/icon.png`, type: "image/png" },
    ],
    apple: { url: `/apple-touch-icon.png`, type: "image/png" },
    shortcut: { url: `/favicon.png` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with your actual verification code
    facebook: "gd6neaagsk9l9tq4m473fulr56fozk",
  },
  locationInfo: {
    city: "Grantham",
    region: "Lincolnshire",
    country: "United Kingdom",
    postalCode: "NG31",
  },
  headers: {
    "Content-Security-Policy": `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://analytics.ahrefs.com;
  connect-src 'self' https://analytics.ahrefs.com;
  img-src 'self' data: https: blob:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`
      .replace(/\s+/g, " ")
      .trim(),
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ahrefs analytics - direct script tag */}
        <script 
          src="https://analytics.ahrefs.com/analytics.js" 
          data-key="1oXGkSDjbF9OcKwKfmfDgA" 
          async 
          defer
        />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-site-verification" content="SFv7PrQP_eyfyEcGTPqch6-g5Fez1Rmctky39RZQ4Ro" />
        <meta name="facebook-domain-verification" content="gd6neaagsk9l9tq4m473fulr56fozk" />
        <meta property="fb:app_id" content="1178547523595198" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Force favicon refresh with explicit links */}
        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.png" />

        {/* Explicit OpenGraph tags as provided - updated with new title and description */}
        <meta property="og:url" content="https://webfuzsion.co.uk" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="WebFuZsion | Professional Web Design Services in Grantham, Lincolnshire, UK"
        />
        <meta
          property="og:description"
          content="Expert web design for small businesses and tradesmen in Grantham, Lincolnshire and beyond. Custom websites, landing pages, and redesigns at competitive prices."
        />
        <meta property="og:image" content={ogImageUrl} />

        {/* Explicit Twitter tags as provided - updated with new title and description */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="webfuzsion.co.uk" />
        <meta property="twitter:url" content="https://webfuzsion.co.uk" />
        <meta
          name="twitter:title"
          content="WebFuZsion | Professional Web Design Services in Grantham, Lincolnshire, UK"
        />
        <meta
          name="twitter:description"
          content="Expert web design for small businesses and tradesmen in Grantham, Lincolnshire and beyond. Custom websites, landing pages, and redesigns at competitive prices."
        />
        <meta name="twitter:image" content={ogImageUrl} />

        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div>Loading...</div>}>
            <PageTransition>{children}</PageTransition>
            <FloatingContactMenu />
            <CustomCursor />
            <WebDesignBusinessJsonLd />
            <LocalBusinessJsonLd />
            <WebsiteJsonLd />
            <BreadcrumbJsonLd />
            <FAQSchema />
            <ReviewJsonLd />
            <ConsentBanner />
            <AnalyticsTracker />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
