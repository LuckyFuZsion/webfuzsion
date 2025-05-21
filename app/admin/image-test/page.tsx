"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

export default function ImageTestPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadStatus, setLoadStatus] = useState({
    direct: false,
    nextjs: false,
    absolute: false,
    webp: false,
    svg: false,
  })

  useEffect(() => {
    // Simulate loading delay to ensure component is mounted
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  const handleImageLoad = (type: keyof typeof loadStatus) => {
    setLoadStatus((prev) => ({
      ...prev,
      [type]: true,
    }))
    console.log(`✅ ${type} image loaded successfully`)
  }

  const handleImageError = (type: keyof typeof loadStatus) => {
    console.error(`❌ ${type} image failed to load`)
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <div className="container mx-auto px-4 py-20">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-8">
          <div className="mb-6">
            <Link href="/admin" className="inline-flex items-center text-brand-pink hover:text-brand-pink/80 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
            <h1 className="text-3xl font-bold mb-2">Image Loading Test</h1>
            <p className="text-gray-300">This page tests different methods of loading images to diagnose issues.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Basic Image Loading Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">1. Direct Image Tag</h3>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center rounded overflow-hidden">
                      <img
                        src="/images/webfuzsion-logo.png"
                        alt="WebFuZsion Logo"
                        className="max-w-full max-h-full object-contain"
                        onLoad={() => handleImageLoad("direct")}
                        onError={() => handleImageError("direct")}
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      Status:{" "}
                      {loadStatus.direct ? (
                        <span className="text-green-400">✓ Loaded</span>
                      ) : (
                        <span className="text-yellow-400">⟳ Loading...</span>
                      )}
                    </div>
                    <code className="block mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">
                      {'<img src="/images/webfuzsion-logo.png" alt="Logo" />'}
                    </code>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">2. Next.js Image (Unoptimized)</h3>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center rounded overflow-hidden">
                      <Image
                        src="/images/webfuzsion-logo.png"
                        alt="WebFuZsion Logo"
                        width={300}
                        height={150}
                        unoptimized={true}
                        onLoad={() => handleImageLoad("nextjs")}
                        onError={() => handleImageError("nextjs")}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      Status:{" "}
                      {loadStatus.nextjs ? (
                        <span className="text-green-400">✓ Loaded</span>
                      ) : (
                        <span className="text-yellow-400">⟳ Loading...</span>
                      )}
                    </div>
                    <code className="block mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">
                      {'<Image src="/images/webfuzsion-logo.png" width={300} height={150} unoptimized={true} />'}
                    </code>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">3. Absolute URL Image</h3>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center rounded overflow-hidden">
                      <img
                        src="https://www.webfuzsion.co.uk/images/webfuzsion-logo.png"
                        alt="WebFuZsion Logo"
                        className="max-w-full max-h-full object-contain"
                        onLoad={() => handleImageLoad("absolute")}
                        onError={() => handleImageError("absolute")}
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      Status:{" "}
                      {loadStatus.absolute ? (
                        <span className="text-green-400">✓ Loaded</span>
                      ) : (
                        <span className="text-yellow-400">⟳ Loading...</span>
                      )}
                    </div>
                    <code className="block mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">
                      {'<img src="https://www.webfuzsion.co.uk/images/webfuzsion-logo.png" alt="Logo" />'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Additional Format Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">4. WebP Image Format</h3>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center rounded overflow-hidden">
                      <img
                        src="/favicon.webp"
                        alt="WebP Test"
                        className="max-w-full max-h-full object-contain"
                        onLoad={() => handleImageLoad("webp")}
                        onError={() => handleImageError("webp")}
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      Status:{" "}
                      {loadStatus.webp ? (
                        <span className="text-green-400">✓ Loaded</span>
                      ) : (
                        <span className="text-yellow-400">⟳ Loading...</span>
                      )}
                    </div>
                    <code className="block mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">
                      {'<img src="/favicon.webp" alt="WebP Test" />'}
                    </code>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">5. SVG Image Format</h3>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center rounded overflow-hidden">
                      <img
                        src="/webfuzsion-logo.png"
                        alt="SVG Test"
                        className="max-w-full max-h-full object-contain"
                        onLoad={() => handleImageLoad("svg")}
                        onError={() => handleImageError("svg")}
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      Status:{" "}
                      {loadStatus.svg ? (
                        <span className="text-green-400">✓ Loaded</span>
                      ) : (
                        <span className="text-yellow-400">⟳ Loading...</span>
                      )}
                    </div>
                    <code className="block mt-2 text-xs bg-black/30 p-2 rounded overflow-x-auto">
                      {'<img src="/webfuzsion-logo.png" alt="SVG Test" />'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Troubleshooting Steps</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Check which images load successfully and which fail</li>
                  <li>Open browser developer tools (F12) and go to the Network tab</li>
                  <li>Look for failed image requests (they'll be highlighted in red)</li>
                  <li>Check the URLs of failed requests to identify path issues</li>
                  <li>Clear your browser cache completely and reload the page</li>
                  <li>Try accessing the image URLs directly in a new browser tab</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
