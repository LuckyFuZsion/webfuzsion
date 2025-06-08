"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface ReliableImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export function ReliableImage({ src, alt, fallbackSrc = "/placeholder.svg", ...props }: ReliableImageProps) {
  // Transform image URLs to use the correct versions
  const getCorrectImageUrl = (url: string): string => {
    if (typeof url !== "string") return url

    // Transform image URLs to use the 'new' versions
    if (url.includes("mt-plumbing")) {
      return url.replace(/\.png|\.jpeg/g, "-new.webp")
    }
    if (url.includes("andys-man-and-van")) {
      return url.replace(/\.png|\.jpeg/g, "-new.webp")
    }
    if (url.includes("pressure-washer-coils")) {
      return url.replace(/\.png|\.jpeg/g, "-new.webp")
    }
    if (url.includes("painted-gardener")) {
      return url.replace(/\.png/g, "-new.webp")
    }
    if (url.includes("sharkys-bar")) {
      return url.replace(/\.png/g, "-new.webp")
    }

    return url
  }

  const [imgSrc, setImgSrc] = useState<string>(getCorrectImageUrl(src as string))
  const [hasError, setHasError] = useState(false)

  // Handle image load error
  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${imgSrc}`)
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={handleError}
      unoptimized={true} // Always use unoptimized
      style={{
        objectFit: props.fill ? "cover" : "contain",
        ...props.style,
      }}
    />
  )
}
