export function ResourceHints() {
  return (
    <>
      {/* Preconnect to your own domain */}
      <link rel="preconnect" href="https://webfuzsion.com" />

      {/* If using a CDN, preconnect to it */}
      {process.env.NEXT_PUBLIC_CDN_URL && <link rel="preconnect" href={process.env.NEXT_PUBLIC_CDN_URL} />}

      {/* Preload critical images */}
      <link rel="preload" href="/images/webfuzsion-logo-compressed.webp" as="image" type="image/webp" />
    </>
  )
}
