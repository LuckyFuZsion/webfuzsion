/**
 * Utility functions for image optimization
 */

// Get the appropriate image size based on viewport width
export function getResponsiveImageSize(viewportWidth: number): number {
  if (viewportWidth < 640) return 640
  if (viewportWidth < 768) return 750
  if (viewportWidth < 1024) return 1080
  if (viewportWidth < 1280) return 1200
  if (viewportWidth < 1920) return 1920
  return 2048
}

// Convert image URL to WebP format if possible
export function getWebPUrl(url: string): string {
  // If URL already ends with .webp, return as is
  if (url.toLowerCase().endsWith(".webp")) return url

  // If URL ends with .jpg, .jpeg, .png, replace with .webp
  const webpUrl = url.replace(/\.(jpe?g|png)$/i, ".webp")

  // If the URL was changed, return the new URL, otherwise return the original
  return webpUrl !== url ? webpUrl : url
}

// Check if the browser supports WebP
export async function supportsWebP(): Promise<boolean> {
  if (typeof window === "undefined") return false

  const webpData = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = webpData
  })
}

// Get optimized image URL with width parameter
export function getOptimizedImageUrl(src: string, width: number): string {
  // If src is a data URL or external URL, return as is
  if (src.startsWith("data:") || src.startsWith("http")) return src

  // Add width parameter for Next.js Image Optimization API
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`
}
