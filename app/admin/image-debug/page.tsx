"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ImageDebugPage() {
  const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({})
  const [loadingComplete, setLoadingComplete] = useState(false)

  const imagesToTest = [
    "/images/webfuzsion-flame-logo.png",
    "/images/webfuzsion-logo.png",
    "/images/webfuzsion-logo-colorful.png",
    "/images/webfuzsion-logo-outline.png",
    "/images/jammmy-slots.png",
    "/images/pressure-washer-new.webp",
    "/images/sharkys-new.webp",
    "/images/andys-new.webp",
    "/images/mt-plumbing-new.webp",
    "/images/painted-gardener-new.webp",
  ]

  useEffect(() => {
    const checkImages = async () => {
      const results: Record<string, boolean> = {}

      for (const imagePath of imagesToTest) {
        try {
          const img = new Image()
          img.src = imagePath

          await new Promise((resolve, reject) => {
            img.onload = () => {
              results[imagePath] = true
              resolve(true)
            }
            img.onerror = () => {
              results[imagePath] = false
              resolve(false)
            }
          })
        } catch (error) {
          results[imagePath] = false
        }
      }

      setImageStatus(results)
      setLoadingComplete(true)
    }

    checkImages()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Image Debug Tool</h1>
        <p>This tool checks if images are accessible and displays their status.</p>
      </div>

      <div className="mb-8">
        <Link href="/admin">
          <Button className="bg-blue-500 hover:bg-blue-600">Back to Admin</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingComplete ? (
          imagesToTest.map((imagePath, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{imagePath}</h2>
              <div
                className={`p-2 rounded-lg ${imageStatus[imagePath] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                Status: {imageStatus[imagePath] ? "Available ✅" : "Not Found ❌"}
              </div>
              {imageStatus[imagePath] && (
                <div className="mt-4">
                  <p className="mb-2">Preview:</p>
                  <img
                    src={imagePath || "/placeholder.svg"}
                    alt={`Preview of ${imagePath}`}
                    className="max-w-full h-auto max-h-40 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center p-8">
            <p className="text-lg">Checking image availability...</p>
          </div>
        )}
      </div>
    </div>
  )
}
