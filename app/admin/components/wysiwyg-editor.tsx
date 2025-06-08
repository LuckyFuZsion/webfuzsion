"use client"
import { useState, useEffect, useRef } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
} from "lucide-react"

interface WysiwygEditorProps {
  initialValue?: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function WysiwygEditor({
  initialValue = "",
  onChange,
  placeholder = "Start writing your blog post...",
  minHeight = "400px",
}: WysiwygEditorProps) {
  const [content, setContent] = useState(initialValue)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialValue && editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue
      setContent(initialValue)
    }
  }, [initialValue])

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      onChange(newContent)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertHeading = (level: 1 | 2 | 3) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const selectedText = range.toString()

      if (selectedText) {
        // If text is selected, wrap it in heading
        const headingElement = document.createElement(`h${level}`)
        headingElement.textContent = selectedText
        headingElement.style.margin = "16px 0"
        headingElement.style.fontWeight = "bold"
        headingElement.style.fontSize = level === 1 ? "2em" : level === 2 ? "1.5em" : "1.25em"

        range.deleteContents()
        range.insertNode(headingElement)

        // Move cursor after the heading
        range.setStartAfter(headingElement)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // If no text selected, create new heading
        execCommand("formatBlock", `h${level}`)
      }
    }
    handleInput()
  }

  const insertLink = () => {
    const url = prompt("Enter the URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  const insertImage = () => {
    const url = prompt("Enter the image URL:")
    if (url) {
      execCommand("insertImage", url)
    }
  }

  const insertList = (ordered = false) => {
    execCommand(ordered ? "insertOrderedList" : "insertUnorderedList")
  }

  const setFontSize = (size: string) => {
    execCommand("fontSize", size)
  }

  const setTextAlign = (alignment: string) => {
    execCommand("justify" + alignment.charAt(0).toUpperCase() + alignment.slice(1))
  }

  const insertLineBreak = () => {
    execCommand("insertHTML", "<br><br>")
  }

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2">
        {/* Font Size */}
        <select
          onChange={(e) => setFontSize(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
          title="Font Size"
        >
          <option value="1">Small</option>
          <option value="3" selected>
            Normal
          </option>
          <option value="4">Medium</option>
          <option value="5">Large</option>
          <option value="6">X-Large</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          type="button"
          className="px-3 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50 text-sm font-bold"
          onClick={() => insertHeading(1)}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50 text-sm font-bold"
          onClick={() => insertHeading(2)}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50 text-sm font-bold"
          onClick={() => insertHeading(3)}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => execCommand("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => execCommand("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => execCommand("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Alignment */}
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => setTextAlign("left")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => setTextAlign("center")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => setTextAlign("right")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => insertList(false)}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={() => insertList(true)}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Insert Elements */}
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertLink}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="p-2 bg-white rounded border border-gray-300 hover:bg-gray-50"
          onClick={insertImage}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Line Break */}
        <button
          type="button"
          className="px-3 py-1 bg-white rounded border border-gray-300 hover:bg-gray-50 text-sm"
          onClick={insertLineBreak}
          title="Insert Line Break"
        >
          ↵ Break
        </button>

        {/* Text Color */}
        <input
          type="color"
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          onChange={(e) => execCommand("foreColor", e.target.value)}
          title="Text Color"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full p-4 focus:outline-none"
        style={{
          minHeight,
          lineHeight: "1.6",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        onInput={handleInput}
        onPaste={(e) => {
          // Allow pasting but clean up the content
          setTimeout(handleInput, 0)
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      {/* Help Text */}
      <div className="bg-gray-50 border-t border-gray-300 p-3 text-xs text-gray-600">
        <p>
          <strong>Tips:</strong> Select text and use the toolbar buttons to format. Press Enter for new paragraphs, use
          "Break" button for line breaks.
        </p>
        <p>You can paste content from Word or other editors and it will maintain basic formatting.</p>
      </div>

      {/* Custom CSS for placeholder and styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 16px 0;
          line-height: 1.2;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 14px 0;
          line-height: 1.3;
        }
        
        [contenteditable] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 12px 0;
          line-height: 1.4;
        }
        
        [contenteditable] p {
          margin: 8px 0;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        
        [contenteditable] li {
          margin: 4px 0;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 8px 0;
        }
        
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
