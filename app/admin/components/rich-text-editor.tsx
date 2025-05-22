"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface RichTextEditorProps {
  initialValue?: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({
  initialValue = "",
  onChange,
  placeholder = "Start writing your blog post...",
  minHeight = "300px",
}: RichTextEditorProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex space-x-2">
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.substring(0, start) + "# " + value.substring(start, end) + value.substring(end)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.substring(0, start) + "## " + value.substring(start, end) + value.substring(end)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue =
              value.substring(0, start) + "**" + value.substring(start, end) + "**" + value.substring(end)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue = value.substring(0, start) + "*" + value.substring(start, end) + "*" + value.substring(end)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const newValue =
              value.substring(0, start) + "[" + value.substring(start, end) + "](url)" + value.substring(end)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Link"
        >
          Link
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const newValue = value.substring(0, start) + "\n![alt text](image-url)\n" + value.substring(start)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Image"
        >
          Image
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => {
            const textarea = document.getElementById("rich-text-editor") as HTMLTextAreaElement
            const start = textarea.selectionStart
            const newValue =
              value.substring(0, start) + "\n- List item\n- List item\n- List item\n" + value.substring(start)
            setValue(newValue)
            onChange(newValue)
          }}
          title="Bulleted List"
        >
          • List
        </button>
      </div>
      <textarea
        id="rich-text-editor"
        className="w-full p-4 focus:outline-none font-mono"
        style={{ minHeight }}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  )
}
