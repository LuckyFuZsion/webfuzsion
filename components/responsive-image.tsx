"use client"

import type React from "react"
import Image from "next/image"

interface ResponsiveImageProps {
  src: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
  quality?: number
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  width?: number
  height?: number
  style?: React.CSSProperties
}

export function ResponsiveImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
  priority = false,
  quality = 85,
  objectFit = "cover",
  width,
  height,
  style,
}: ResponsiveImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        sizes={sizes}
        className={`
        transition-opacity duration-500 ease-in-out
        object-${objectFit}
      `}
        priority={priority}
        quality={quality}
        unoptimized={true} // Always use unoptimized
        onError={(e) => {
          // Log error and fallback to placeholder
          console.warn(`Failed to load image: ${src}`)
          // @ts-ignore - TypeScript doesn't know about currentTarget.src
          e.currentTarget.src = "/placeholder.svg"
        }}
        style={{
          ...style,
        }}
      />
    </div>
  )
}
