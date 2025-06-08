/**
 * CDN Configuration Helper
 *
 * This file provides utilities for working with CDN resources
 * without changing how images are loaded in the application.
 */

// CDN base URL - change this to your actual CDN URL when ready
const CDN_BASE_URL = process.env.NEXT_PUBLIC_CDN_URL || ""

// Whether to use CDN in the current environment
const USE_CDN = process.env.NODE_ENV === "production" && !!CDN_BASE_URL

/**
 * Converts a local asset path to a CDN URL if CDN is enabled
 * This can be used for manual CDN path construction if needed
 */
export function getCdnUrl(path: string): string {
  // If CDN is not enabled or path is already a full URL, return the path as is
  if (!USE_CDN || path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path
  }

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // Return the CDN URL
  return `${CDN_BASE_URL}${normalizedPath}`
}

/**
 * Configuration object for CDN settings
 */
export const cdnConfig = {
  enabled: USE_CDN,
  baseUrl: CDN_BASE_URL,
  imagesDomain: new URL(CDN_BASE_URL || "https://example.com").hostname,
}

export default cdnConfig
