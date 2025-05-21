"use client"

import { useState, useEffect } from "react"
import { Facebook, Twitter, Linkedin, Mail, LinkIcon } from "lucide-react"

interface SocialShareProps {
  title?: string
  url?: string
  description?: string
}

export default function SocialShare({ title, url, description }: SocialShareProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(url || "")
  const [copied, setCopied] = useState(false)

  // Get the current URL if not provided
  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }
  }, [url])

  const encodedUrl = encodeURIComponent(currentUrl)
  const encodedTitle = encodeURIComponent(title || "Check out this article")
  const encodedDescription = encodeURIComponent(
    description || "I found this interesting article I wanted to share with you",
  )

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook size={20} className="text-white" />
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter size={20} className="text-white" />
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={20} className="text-white" />
        </a>

        <a
          href={shareLinks.email}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
          aria-label="Share via Email"
        >
          <Mail size={20} className="text-white" />
        </a>

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-900 transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon size={20} className="text-white" />
        </button>

        {copied && <span className="ml-2 text-sm text-green-600 dark:text-green-400 self-center">Link copied!</span>}
      </div>
    </div>
  )
}
