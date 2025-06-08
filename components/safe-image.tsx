"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  style?: React.CSSProperties
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
  style,
  objectFit = "cover",
}: SafeImageProps) {
  const [useNextImage, setUseNextImage] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [imgError, setImgError] = useState(false)

  // Fallback to standard img tag if Next.js Image fails
  const handleImageError = () => {
    console.warn(`Next.js Image failed to load: ${src}`)
    setImgError(true)
    setUseNextImage(false)
  }

  // Standard img onError handler
  const handleStandardImgError = () => {
    console.warn(`Standard img failed to load: ${src}`)
    // If even the standard img fails, we'll show a placeholder
  }

  // Reset error state when src changes
  useEffect(() => {
    setImgError(false)
    setUseNextImage(true)
  }, [src])

  // If using fill mode
  if (fill) {
    return useNextImage && !imgError ? (
      <div className={`relative ${className}`} style={{ ...style }}>
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          sizes={sizes || "100vw"}
          priority={priority}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} object-${objectFit}`}
          onLoad={() => setIsLoading(false)}
          onError={handleImageError}
          quality={85}
        />
      </div>
    ) : (
      <div className={`relative ${className}`} style={{ ...style }}>
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={`w-full h-full object-${objectFit}`}
          onError={handleStandardImgError}
        />
      </div>
    )
  }

  // If using explicit width/height
  return useNextImage && !imgError ? (
    <div className={`relative ${className}`} style={{ ...style }}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width || 100}
        height={height || 100}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        quality={85}
      />
    </div>
  ) : (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={handleStandardImgError}
    />
  )
}
