"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export function FallbackImage({ src, alt, fallbackSrc = "/placeholder.svg", ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string)
  const [hasError, setHasError] = useState(false)

  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src as string)
    setHasError(false)
  }, [src])

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
