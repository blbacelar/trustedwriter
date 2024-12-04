'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import { useLanguage } from "@/contexts/LanguageContext";

interface RichTextEditorProps {
  initialContent: string
  onCopy: (content: string) => void
}

const RichTextEditor = ({ initialContent, onCopy }: RichTextEditorProps) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false)

  // Convert plain text to HTML with paragraphs
  const formatContentToHtml = (content: string) => {
    return content
      .split('\n')
      .filter(para => para.trim() !== '')
      .map(para => `<p>${para}</p>`)
      .join('')
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: formatContentToHtml(initialContent),
    editable: isEditing,
  })

  // Update editor's editable state when isEditing changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing)
    }
  }, [isEditing, editor])

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleCopy = () => {
    if (editor) {
      // Get content with preserved formatting
      const htmlContent = editor.getHTML()
      // Convert HTML to plain text while preserving paragraphs
      const textContent = htmlContent
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n\n')
        .trim()
      onCopy(textContent)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <button
          onClick={toggleEdit}
          className="px-4 py-2 text-sm rounded-full transition-colors border-2 border-[#00B5B4] text-[#00B5B4] hover:bg-[#00B5B4] hover:text-white"
        >
          {isEditing ? t("dashboard.editor.save") : t("dashboard.editor.edit")}
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-sm bg-[#00B5B4] hover:bg-[#00A3A2] text-white rounded-full transition-colors"
        >
          {t("dashboard.editor.copy")}
        </button>
      </div>
      <div
        className={`prose max-w-none p-4 rounded-lg transition-colors ${
          isEditing 
            ? 'bg-white border-2 border-[#00B5B4] cursor-text' 
            : 'bg-gray-50'
        }`}
      >
        <EditorContent editor={editor} />
      </div>
      {isEditing && (
        <p className="text-sm text-gray-500 italic">
          {t("dashboard.editor.editingHint")}
        </p>
      )}
    </div>
  )
}

export default RichTextEditor 