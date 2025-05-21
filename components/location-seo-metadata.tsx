import Head from "next/head"
import { granthamAreaLocations } from "@/app/locations/villages"

export function LocationSeoMetadata() {
  // Create a comma-separated list of all location names
  const locationsList = granthamAreaLocations.map((location) => location.name).join(", ")

  return (
    <Head>
      {/* Meta description with locations */}
      <meta
        name="description"
        content={`Professional web design services in Grantham and surrounding areas including ${locationsList}. Custom websites for local businesses throughout Lincolnshire.`}
      />

      {/* Keywords with locations */}
      <meta
        name="keywords"
        content={`web design, website development, Grantham, Lincolnshire, ${locationsList}, professional websites, local business websites`}
      />

      {/* Open Graph data */}
      <meta
        property="og:description"
        content={`Professional web design services in Grantham and surrounding areas including ${locationsList}. Custom websites for local businesses throughout Lincolnshire.`}
      />

      {/* Twitter card data */}
      <meta
        name="twitter:description"
        content={`Professional web design services in Grantham and surrounding areas including ${locationsList}. Custom websites for local businesses throughout Lincolnshire.`}
      />
    </Head>
  )
}
