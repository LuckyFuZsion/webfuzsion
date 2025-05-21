/**
 * Utility to preload critical images
 */

export const criticalImages = [
  "/images/webfuzsion-flame-logo.png",
  "/images/webfuzsion-logo.png",
  "/images/webfuzsion-logo-outline.png",
  "/favicon.ico",
  "/favicon.png",
]

export function preloadCriticalImages(): void {
  if (typeof window === "undefined") return

  criticalImages.forEach((src) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  })
}
