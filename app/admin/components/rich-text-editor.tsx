"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange(newValue)
  }

  // Helper function to ensure proper line breaks for Markdown
  const ensureProperLineBreaks = (text: string, start: number, end: number, prefix: string): string => {
    // Get the text before and after the selection
    const beforeSelection = text.substring(0, start)
    const selection = text.substring(start, end)
    const afterSelection = text.substring(end)

    // Check if we need to add a line break before the heading
    const needsLineBreakBefore = start > 0 && beforeSelection.charAt(beforeSelection.length - 1) !== "\n"

    // Check if we need to add a line break after the heading
    const needsLineBreakAfter = end < text.length && afterSelection.charAt(0) !== "\n"

    // Build the new text with proper line breaks
    let newText = beforeSelection
    if (needsLineBreakBefore) newText += "\n"
    newText += prefix + " " + selection
    if (needsLineBreakAfter) newText += "\n"
    newText += afterSelection

    return newText
  }

  const insertHeading = (level: 1 | 2) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const prefix = level === 1 ? "#" : "##"

    // If there's no selection, insert a placeholder
    if (start === end) {
      const beforeCursor = value.substring(0, start)
      const afterCursor = value.substring(end)

      // Check if we need line breaks
      const needsLineBreakBefore = start > 0 && beforeCursor.charAt(beforeCursor.length - 1) !== "\n"
      const needsLineBreakAfter = end < value.length && afterCursor.charAt(0) !== "\n"

      let newText = beforeCursor
      if (needsLineBreakBefore) newText += "\n"
      newText += prefix + " Heading " + level
      if (needsLineBreakAfter) newText += "\n"
      newText += afterCursor

      setValue(newText)
      onChange(newText)

      // Set cursor position after the inserted heading
      const newCursorPos = start + (needsLineBreakBefore ? 1 : 0) + prefix.length + 9 // 9 = " Heading X".length
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    } else {
      // There is selected text, format it as a heading
      const newText = ensureProperLineBreaks(value, start, end, prefix)
      setValue(newText)
      onChange(newText)

      // Calculate new selection position
      const additionalCharsBefore = start > 0 && value.charAt(start - 1) !== "\n" ? 1 : 0
      const newSelectionStart = start + additionalCharsBefore + prefix.length + 1 // +1 for the space
      const newSelectionEnd = newSelectionStart + (end - start)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd)
      }, 0)
    }
  }

  const insertBold = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // If there's no selection, insert placeholder
    if (start === end) {
      const newText = value.substring(0, start) + "**bold text**" + value.substring(end)
      setValue(newText)
      onChange(newText)

      // Place cursor inside the bold markers
      const newCursorPos = start + 2
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos + 9) // Select "bold text"
      }, 0)
    } else {
      const newText = value.substring(0, start) + "**" + value.substring(start, end) + "**" + value.substring(end)
      setValue(newText)
      onChange(newText)

      // Select the text including the markers
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, end + 4) // +4 for the ** markers
      }, 0)
    }
  }

  const insertItalic = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // If there's no selection, insert placeholder
    if (start === end) {
      const newText = value.substring(0, start) + "*italic text*" + value.substring(end)
      setValue(newText)
      onChange(newText)

      // Place cursor inside the italic markers
      const newCursorPos = start + 1
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos + 11) // Select "italic text"
      }, 0)
    } else {
      const newText = value.substring(0, start) + "*" + value.substring(start, end) + "*" + value.substring(end)
      setValue(newText)
      onChange(newText)

      // Select the text including the markers
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, end + 2) // +2 for the * markers
      }, 0)
    }
  }

  const insertLink = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    // If there's no selection, insert placeholder
    if (start === end) {
      const newText = value.substring(0, start) + "[link text](https://example.com)" + value.substring(end)
      setValue(newText)
      onChange(newText)

      // Select the link text for easy editing
      const newCursorPos = start + 1
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos + 9) // Select "link text"
      }, 0)
    } else {
      const newText =
        value.substring(0, start) + "[" + value.substring(start, end) + "](https://example.com)" + value.substring(end)
      setValue(newText)
      onChange(newText)

      // Place cursor in the URL part
      const newCursorPos = end + 3 // +3 for "](h"
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos + 18) // Select "https://example.com"
      }, 0)
    }
  }

  const insertImage = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart

    // Ensure there's a line break before the image if needed
    const beforeCursor = value.substring(0, start)
    const needsLineBreakBefore = start > 0 && beforeCursor.charAt(beforeCursor.length - 1) !== "\n"

    let newText = value.substring(0, start)
    if (needsLineBreakBefore) newText += "\n"
    newText += "![Image description](https://example.com/image.jpg)\n" + value.substring(start)

    setValue(newText)
    onChange(newText)

    // Select the image description for easy editing
    const newCursorPos = start + (needsLineBreakBefore ? 1 : 0) + 2 // +2 for "!["
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos + 16) // Select "Image description"
    }, 0)
  }

  const insertList = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart

    // Ensure there's a line break before the list if needed
    const beforeCursor = value.substring(0, start)
    const needsLineBreakBefore = start > 0 && beforeCursor.charAt(beforeCursor.length - 1) !== "\n"

    let newText = value.substring(0, start)
    if (needsLineBreakBefore) newText += "\n"
    newText += "- First item\n- Second item\n- Third item\n\n" + value.substring(start)

    setValue(newText)
    onChange(newText)

    // Place cursor after the list
    const newCursorPos = start + (needsLineBreakBefore ? 1 : 0) + 38 // Length of the list text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertBold}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertItalic}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertLink}
          title="Link"
        >
          Link
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertImage}
          title="Image"
        >
          Image
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertList}
          title="Bulleted List"
        >
          • List
        </button>
      </div>
      <textarea
        ref={textareaRef}
        id="rich-text-editor"
        className="w-full p-4 focus:outline-none font-mono"
        style={{ minHeight }}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div className="bg-gray-100 border-t border-gray-300 p-2 text-xs text-gray-500">
        <p>Use Markdown for formatting: # Heading 1, ## Heading 2, **bold**, *italic*, [link](url), ![image](url)</p>
        <p>Press Enter twice for paragraph breaks. Each heading should be on its own line.</p>
      </div>
    </div>
  )
}
