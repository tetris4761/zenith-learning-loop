import React, { useState, useCallback, useEffect } from 'react';
import { X, Save, Clock, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TiptapEditor } from './TiptapEditor';
import { DocumentAISummary } from './DocumentAISummary';
import { useDocuments } from '@/hooks/useDocuments';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  title: string;
  content: any;
  folderId?: string;
  wordCount: number;
  updatedAt: string;
  createdAt: string;
}

interface EditorViewProps {
  document: Document;
  onClose: () => void;
}

export function EditorView({ document, onClose }: EditorViewProps) {
  const { updateDocument, isUpdating } = useDocuments();
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [wordCount, setWordCount] = useState(document.wordCount);
  const [isSaved, setIsSaved] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const debouncedContent = useDebounce(content, 800);
  const debouncedTitle = useDebounce(title, 800);

  // Auto-save when content or title changes
  useEffect(() => {
    if (debouncedContent !== document.content || debouncedTitle !== document.title) {
      if (debouncedContent || debouncedTitle !== document.title) {
        setIsSaved(false);
        updateDocument({
          id: document.id,
          title: debouncedTitle,
          content: debouncedContent,
          wordCount: wordCount,
        });
        setLastSavedAt(new Date());
        setIsSaved(true);
      }
    }
  }, [debouncedContent, debouncedTitle, document.content, document.title, document.id, updateDocument, wordCount]);

  const handleContentChange = useCallback((newContent: any, newWordCount: number) => {
    setContent(newContent);
    setWordCount(newWordCount);
    setIsSaved(false);
  }, []);

  const handleManualSave = () => {
    updateDocument({
      id: document.id,
      title: title,
      content: content,
      wordCount: wordCount,
    });
    setLastSavedAt(new Date());
    setIsSaved(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleManualSave();
    }
  };

  return (
    <div className="h-full flex bg-background" onKeyDown={handleKeyDown}>
      {/* Main editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-medium border-none bg-transparent p-0 h-auto focus-visible:ring-0"
              placeholder="Untitled Document"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {isSaved ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Save className="h-3 w-3" />
                <span>Saved</span>
              </div>
            ) : isUpdating ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                <span>Saving...</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleManualSave}
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <TiptapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Start typing..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              <span>{wordCount} words</span>
            </div>
            {lastSavedAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Last edited {formatDistanceToNow(lastSavedAt, { addSuffix: true })}</span>
              </div>
            )}
          </div>
          
          <div>
            Press Cmd/Ctrl + S to save
          </div>
        </div>
      </div>

      {/* AI Tools Sidebar */}
      <div className="w-80 border-l border-border bg-card/50 p-4 overflow-y-auto">
        <DocumentAISummary
          content={JSON.stringify(content)}
          title={title || 'Untitled Document'}
        />
      </div>
    </div>
  );
}