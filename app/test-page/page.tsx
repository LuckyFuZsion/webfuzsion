export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>This is a simple test page to check if basic rendering works.</p>

      <div className="mt-4">
        <a href="/api/simple-test" className="text-blue-600 underline">
          Test Simple API
        </a>
      </div>

      <div className="mt-4">
        <a href="/api/env-check-safe" className="text-blue-600 underline">
          Test Environment Variables
        </a>
      </div>
    </div>
  )
}
