import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { EditorToolbar } from './EditorToolbar';
import { SelectionBubble } from './SelectionBubble';
import { cn } from '@/lib/utils';

interface TiptapEditorProps {
  content: any;
  onChange: (content: any, wordCount: number) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = "Start typing..." }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4 hover:text-primary/80',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base max-w-none',
          'min-h-[200px] w-full rounded-md border border-input bg-background',
          'px-3 py-2 text-sm ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Prose styles
          'prose-headings:text-foreground prose-p:text-foreground',
          'prose-strong:text-foreground prose-em:text-foreground',
          'prose-code:text-foreground prose-code:bg-muted prose-code:rounded prose-code:px-1',
          'prose-pre:bg-muted prose-pre:text-foreground',
          'prose-blockquote:text-muted-foreground prose-blockquote:border-l-border',
          'prose-hr:border-border',
          'prose-li:text-foreground prose-ul:text-foreground prose-ol:text-foreground',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const characterCount = editor.storage.characterCount;
      const wordCount = characterCount?.words() || 0;
      onChange(json, wordCount);
    },
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!editor) return;

    // Handle keyboard shortcuts
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'b') {
        e.preventDefault();
        editor.chain().focus().toggleBold().run();
      } else if (e.key === 'i') {
        e.preventDefault();
        editor.chain().focus().toggleItalic().run();
      }
    }

    // Close selection bubble on Escape
    if (e.key === 'Escape') {
      editor.chain().focus().setTextSelection(editor.state.selection.from).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" onKeyDown={handleKeyDown}>
      <EditorToolbar editor={editor} />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <EditorContent 
            editor={editor} 
            className="min-h-full focus-within:outline-none"
          />
        </div>
      </div>

      <SelectionBubble editor={editor} />
    </div>
  );
}