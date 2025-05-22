"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import RichTextEditor from "../../components/rich-text-editor"
import BlogPreview from "../../components/blog-preview"
import { saveBlogPost } from "../../../actions/blog-actions"

export default function NewBlogPost() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [author, setAuthor] = useState("WebFuZsion")
  const [tags, setTags] = useState("")
  const [category, setCategory] = useState("Web Design")
  const [image, setImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [activeTab, setActiveTab] = useState("edit")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("excerpt", excerpt)
    formData.append("author", author)
    formData.append("tags", tags)
    formData.append("category", category)
    formData.append("image", image)

    try {
      const result = await saveBlogPost(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Redirect to the new blog post after a short delay
        setTimeout(() => {
          router.push(`/blog/${result.slug}`)
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Back to Blog List
        </button>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-300">
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === "edit" ? "border-b-2 border-brand-pink font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={`px-4 py-2 ${activeTab === "preview" ? "border-b-2 border-brand-pink font-medium" : "text-gray-500"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      {activeTab === "edit" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block mb-2 font-medium">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block mb-2 font-medium">
              Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor initialValue={content} onChange={setContent} minHeight="400px" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block mb-2 font-medium">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Web Design">Web Design</option>
                <option value="SEO">SEO</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Technology">Technology</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block mb-2 font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="web design, responsive, seo"
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 font-medium">
              Featured Image URL
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-brand-pink text-white rounded-md hover:bg-pink-600 disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Blog Post"}
            </button>
          </div>
        </form>
      ) : (
        <BlogPreview title={title} content={content} excerpt={excerpt} author={author} image={image} />
      )}
    </div>
  )
}
