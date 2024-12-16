'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'
import { useLanguage } from "@/contexts/LanguageContext";

interface RichTextEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel?: () => void;
  onCopy: (content: string) => void;
}

export default function RichTextEditor({ initialContent, onSave, onCancel, onCopy }: RichTextEditorProps) {
  const { t } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);

  // Format content if it's plain text
  const formatContent = (content: string) => {
    // Check if content is already HTML
    if (content.includes('</p>')) {
      return content;
    }
    // Convert plain text to HTML with paragraphs
    return content
      .split('\n')
      .filter(para => para.trim() !== '')
      .map(para => `<p>${para}</p>`)
      .join('');
  };

  // Clean HTML to plain text with proper line breaks
  const cleanHtml = (html: string) => {
    // Replace paragraph breaks with double newlines
    const withLineBreaks = html.replace(/<\/p><p>/g, '\n\n');
    // Create DOM parser
    const doc = new DOMParser().parseFromString(withLineBreaks, 'text/html');
    // Get text content
    const textContent = doc.body.textContent || '';
    // Clean up extra whitespace but preserve intentional line breaks
    return textContent.replace(/\n{3,}/g, '\n\n').trim();
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: formatContent(initialContent),
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] p-4 border rounded-lg'
      }
    }
  });

  const handleSave = async () => {
    if (editor) {
      setIsSaving(true);
      try {
        const htmlContent = editor.getHTML();
        const cleanContent = cleanHtml(htmlContent);
        await onSave(cleanContent);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCopy = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      const cleanContent = cleanHtml(htmlContent);
      onCopy(cleanContent);
    }
  };

  return (
    <div>
      <EditorContent editor={editor} />
      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            'Save'
          )}
        </button>
        <button
          onClick={handleCopy}
          disabled={isSaving}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Copy
        </button>
      </div>
    </div>
  );
} 