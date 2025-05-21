import Head from "next/head"

interface LinkedInMetaProps {
  title: string
  description: string
  imageUrl: string
  url: string
}

export default function LinkedInMeta({ title, description, imageUrl, url }: LinkedInMetaProps) {
  return (
    <Head>
      {/* LinkedIn specific meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
    </Head>
  )
}
