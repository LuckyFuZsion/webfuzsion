"use client"

import { Facebook, Twitter, Linkedin, Mail, LinkIcon } from "lucide-react"
import { useState } from "react"

interface BlogSocialShareProps {
  url?: string
  title?: string
}

export function BlogSocialShare({ url, title }: BlogSocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Use the current URL if none is provided
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const pageTitle = title || "Check out this blog post"

  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(pageTitle)

  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center">
        <LinkIcon className="h-5 w-5 mr-2 text-brand-pink" />
        Share this article
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#166FE5] transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Share on Facebook"
        >
          <Facebook size={20} className="text-white" />
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1DA1F2] hover:bg-[#0c85d0] transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Share on Twitter"
        >
          <Twitter size={20} className="text-white" />
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A66C2] hover:bg-[#0958a7] transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={20} className="text-white" />
        </a>

        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Share via Email"
        >
          <Mail size={20} className="text-white" />
        </a>

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-pink hover:bg-brand-pink/80 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Copy link"
        >
          <LinkIcon size={20} className="text-white" />
        </button>
      </div>

      {copied && (
        <div className="mt-4 text-center">
          <span className="text-green-400 bg-green-400/20 px-4 py-2 rounded-full text-sm border border-green-400/30 animate-fade-in">
            ✓ Link copied to clipboard!
          </span>
        </div>
      )}
    </div>
  )
}
