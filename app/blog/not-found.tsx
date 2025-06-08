import Link from "next/link"

export default function BlogNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link
          href="/blog"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    </div>
  )
}
