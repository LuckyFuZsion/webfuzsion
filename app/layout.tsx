import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PageTransition } from "@/components/page-transition"
import { CustomCursor } from "@/components/custom-cursor"
import { WebDesignBusinessJsonLd, LocalBusinessJsonLd, WebsiteJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

export const metadata = {
  title: "WebFuZsion Web Design Studio | Professional Website Design Services",
  description:
    "Professional web design services for small businesses, tradesmen, and content creators. Custom websites, landing pages, redesigns and maintenance services at competitive prices.",
  keywords:
    "web design, website development, small business websites, tradesman websites, content creator websites, professional web design, affordable web design, UK web design, responsive websites",
  authors: [{ name: "WebFuZsion" }],
  creator: "WebFuZsion",
  publisher: "WebFuZsion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://webfuzsion.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WebFuZsion Web Design Studio | Professional Website Design Services",
    description:
      "Professional web design services for small businesses, tradesmen, and content creators. Custom websites, landing pages, redesigns and maintenance services at competitive prices.",
    url: "https://webfuzsion.com",
    siteName: "WebFuZsion Web Design Studio",
    images: [
      {
        url: "/images/webfuzsion-og.png",
        width: 1200,
        height: 630,
        alt: "WebFuZsion Web Design Studio",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebFuZsion Web Design Studio | Professional Website Design Services",
    description:
      "Professional web design services for small businesses, tradesmen, and content creators. Custom websites, landing pages, redesigns and maintenance services at competitive prices.",
    images: ["/images/webfuzsion-og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: { url: "/icon.png", type: "image/png" },
    shortcut: { url: "/favicon.png" },
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
        <link rel="preload" href="/fonts/BLANKA.otf" as="font" type="font/otf" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <PageTransition>{children}</PageTransition>
          <CustomCursor />
          <WebDesignBusinessJsonLd />
          <LocalBusinessJsonLd />
          <WebsiteJsonLd />
          <BreadcrumbJsonLd />
        </ThemeProvider>
      </body>
    </html>
  )
}
