"use client"

import Image from "next/image"

export function ImageTest() {
  return (
    <div className="p-4 bg-white rounded shadow my-4">
      <h2 className="text-xl font-bold mb-4">Image Loading Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium mb-2">Direct Image Tag</h3>
          <img src="/images/webfuzsion-logo.png" alt="WebFuZsion Logo" className="w-full h-auto" />
        </div>

        <div>
          <h3 className="font-medium mb-2">Next.js Image (Unoptimized)</h3>
          <Image src="/images/webfuzsion-logo.png" alt="WebFuZsion Logo" width={200} height={100} unoptimized={true} />
        </div>

        <div>
          <h3 className="font-medium mb-2">Absolute URL Image</h3>
          <img
            src="https://www.webfuzsion.co.uk/images/webfuzsion-logo.png"
            alt="WebFuZsion Logo"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500">
          If images are not loading, check browser console for errors. This component helps diagnose image loading
          issues.
        </p>
      </div>
    </div>
  )
}
