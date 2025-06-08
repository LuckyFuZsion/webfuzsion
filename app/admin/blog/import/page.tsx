"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  content?: string
}

export default function ImportBlogPosts() {
  const router = useRouter()
  const [existingPosts, setExistingPosts] = useState<BlogPost[]>([])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [importResults, setImportResults] = useState<{ slug: string; success: boolean; message: string }[]>([])

  useEffect(() => {
    const fetchExistingPosts = async () => {
      try {
        const response = await fetch("/api/admin/existing-blog-posts")
        if (!response.ok) {
          throw new Error("Failed to fetch existing blog posts")
        }
        const data = await response.json()
        setExistingPosts(data.posts)
      } catch (err) {
        console.error("Error fetching existing posts:", err)
        setMessage({ type: "error", text: "Failed to load existing blog posts" })
      } finally {
        setLoading(false)
      }
    }

    fetchExistingPosts()
  }, [])

  const handleSelectAll = () => {
    if (selectedPosts.length === existingPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(existingPosts.map((post) => post.slug))
    }
  }

  const handleToggleSelect = (slug: string) => {
    if (selectedPosts.includes(slug)) {
      setSelectedPosts(selectedPosts.filter((s) => s !== slug))
    } else {
      setSelectedPosts([...selectedPosts, slug])
    }
  }

  const handleImport = async () => {
    if (selectedPosts.length === 0) {
      setMessage({ type: "error", text: "Please select at least one blog post to import" })
      return
    }

    setImporting(true)
    setMessage({ type: "", text: "" })
    setImportResults([])

    try {
      const results = []

      for (const slug of selectedPosts) {
        // Get the full post content
        const postResponse = await fetch(`/api/admin/blog-post-content?slug=${slug}`)
        if (!postResponse.ok) {
          results.push({
            slug,
            success: false,
            message: `Failed to fetch post content: ${postResponse.statusText}`,
          })
          continue
        }

        const postData = await postResponse.json()
        if (!postData.success) {
          results.push({
            slug,
            success: false,
            message: postData.error || "Failed to fetch post content",
          })
          continue
        }

        // Import the post to the database
        const importResponse = await fetch("/api/admin/import-blog-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData.post),
        })

        if (!importResponse.ok) {
          results.push({
            slug,
            success: false,
            message: `Failed to import: ${importResponse.statusText}`,
          })
          continue
        }

        const importResult = await importResponse.json()
        results.push({
          slug,
          success: importResult.success,
          message: importResult.message,
        })
      }

      setImportResults(results)
      const successCount = results.filter((r) => r.success).length
      setMessage({
        type: successCount > 0 ? "success" : "error",
        text: `Imported ${successCount} of ${results.length} blog posts`,
      })
    } catch (err) {
      console.error("Error during import:", err)
      setMessage({ type: "error", text: "An unexpected error occurred during import" })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Import Existing Blog Posts</h1>
        <button
          onClick={() => router.push("/admin/blog")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Blog List
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Existing Blog Posts</h2>
            <div className="flex gap-4">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={loading}
              >
                {selectedPosts.length === existingPosts.length ? "Deselect All" : "Select All"}
              </button>
              <button
                onClick={handleImport}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || importing || selectedPosts.length === 0}
              >
                {importing ? "Importing..." : "Import Selected"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading existing blog posts...</div>
          ) : existingPosts.length === 0 ? (
            <div className="text-center py-8">No existing blog posts found in the file system.</div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPosts.length === existingPosts.length && existingPosts.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {existingPosts.map((post) => (
                    <tr key={post.slug} className={selectedPosts.includes(post.slug) ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPosts.includes(post.slug)}
                          onChange={() => handleToggleSelect(post.slug)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.author}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {importResults.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Import Results</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Slug
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importResults.map((result) => (
                      <tr key={result.slug}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{result.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.success ? "Success" : "Failed"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{result.message}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
