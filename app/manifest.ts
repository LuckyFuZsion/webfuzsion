import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WebFuZsion Web Design Studio",
    short_name: "WebFuZsion",
    description: "Professional web design services for small businesses, tradesmen, and content creators.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ff3366",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
