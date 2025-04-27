import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PageTransition } from "@/components/page-transition"
import { CustomCursor } from "@/components/custom-cursor"

export const metadata = {
  title: "WebFuZsion Web Design Studio",
  description: "Professional web design services for small businesses, tradesmen, and content creators.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: { url: "/icon.png", type: "image/png" },
    shortcut: { url: "/favicon.png" },
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
        </ThemeProvider>
      </body>
    </html>
  )
}
