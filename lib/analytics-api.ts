// Mock analytics data for preview purposes
// This removes the dependency on google-auth-library which is not supported in v0

// Cache for storing analytics data to reduce API calls
const cache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

// Mock data for preview
const mockPageViews = {
  labels: ["05/01", "05/02", "05/03", "05/04", "05/05", "05/06", "05/07"],
  data: [120, 145, 132, 167, 189, 176, 210],
}

const mockTopPages = [
  { path: "/", views: 450 },
  { path: "/blog/importance-of-seo-strategy", views: 230 },
  { path: "/services/web-design", views: 180 },
  { path: "/blog/do-businesses-still-need-websites", views: 120 },
  { path: "/contact", views: 95 },
]

const mockDeviceBreakdown = {
  labels: ["Desktop", "Mobile", "Tablet"],
  data: [45, 48, 7],
}

const mockVisitorStats = {
  activeUsers: 1250,
  newUsers: 780,
  pageViews: 3450,
  avgEngagementTime: 125, // seconds
}

export async function getPageViews(startDate: string, endDate: string) {
  const cacheKey = `pageviews-${startDate}-${endDate}`

  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data
  }

  // Store in cache
  cache[cacheKey] = {
    data: mockPageViews,
    timestamp: Date.now(),
  }

  return mockPageViews
}

export async function getTopPages(startDate: string, endDate: string, limit = 10) {
  const cacheKey = `toppages-${startDate}-${endDate}-${limit}`

  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data
  }

  // Store in cache
  cache[cacheKey] = {
    data: mockTopPages.slice(0, limit),
    timestamp: Date.now(),
  }

  return mockTopPages.slice(0, limit)
}

export async function getDeviceBreakdown(startDate: string, endDate: string) {
  const cacheKey = `devices-${startDate}-${endDate}`

  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data
  }

  // Store in cache
  cache[cacheKey] = {
    data: mockDeviceBreakdown,
    timestamp: Date.now(),
  }

  return mockDeviceBreakdown
}

export async function getVisitorStats(startDate: string, endDate: string) {
  const cacheKey = `visitors-${startDate}-${endDate}`

  // Check cache first
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data
  }

  // Store in cache
  cache[cacheKey] = {
    data: mockVisitorStats,
    timestamp: Date.now(),
  }

  return mockVisitorStats
}
