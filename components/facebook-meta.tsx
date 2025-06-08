import Head from "next/head"

interface FacebookMetaProps {
  appId: string
  title: string
  description: string
  imageUrl: string
  url: string
  type?: string
}

export default function FacebookMeta({
  appId,
  title,
  description,
  imageUrl,
  url,
  type = "website",
}: FacebookMetaProps) {
  return (
    <Head>
      {/* Facebook specific meta tags */}
      <meta property="fb:app_id" content={appId} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="627" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
    </Head>
  )
}
