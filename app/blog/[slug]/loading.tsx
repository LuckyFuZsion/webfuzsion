export default function BlogPostLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Title skeleton */}
        <div className="h-10 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-8 animate-pulse"></div>

        {/* Meta info skeleton */}
        <div className="flex gap-4 mb-8">
          <div className="h-5 bg-gray-200 rounded-md w-24 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-32 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-20 animate-pulse"></div>
        </div>

        {/* Image skeleton */}
        <div className="h-64 md:h-96 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>

        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-md w-3/5 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
