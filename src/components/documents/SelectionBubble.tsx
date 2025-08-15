import React, { useState, useEffect, useRef } from 'react';
import { type Editor } from '@tiptap/react';
import { CreditCard, Plus, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHighlights } from '@/hooks/useHighlights';
import { useAICompletion } from '@/hooks/useAICompletion';
import { useBoards } from '@/hooks/useBoards';
import { AIResponseDialog } from './AIResponseDialog';
import { CreateTaskDialog } from '../tasks/CreateTaskDialog';
import { cn } from '@/lib/utils';

interface SelectionBubbleProps {
  editor: Editor;
  documentId?: string;
}

interface SelectionState {
  from: number;
  to: number;
  text: string;
  isEmpty: boolean;
}

export function SelectionBubble({ editor, documentId }: SelectionBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selection, setSelection] = useState<SelectionState | null>(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [defaultBoardId, setDefaultBoardId] = useState<string>('');
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { createHighlight } = useHighlights();
  const { complete, isLoading, result } = useAICompletion();
  const { boards } = useBoards();

  // Auto-select first board when available
  useEffect(() => {
    if (boards && boards.length > 0 && !defaultBoardId) {
      setDefaultBoardId(boards[0].id);
    }
  }, [boards, defaultBoardId]);

  useEffect(() => {
    const updateBubble = () => {
      const { state } = editor;
      const { from, to, empty } = state.selection;
      
      if (empty) {
        setIsVisible(false);
        setSelection(null);
        return;
      }

      const selectedText = state.doc.textBetween(from, to, ' ');
      if (selectedText.trim().length === 0) {
        setIsVisible(false);
        setSelection(null);
        return;
      }

      setSelection({
        from,
        to,
        text: selectedText,
        isEmpty: empty,
      });

      // Calculate bubble position
      const view = editor.view;
      const { left, right, bottom } = view.coordsAtPos(from);
      
      setPosition({
        top: bottom + 10,
        left: Math.max(0, (left + right) / 2 - 125), // Center the bubble (250px wide / 2)
      });
      
      setIsVisible(true);
    };

    const handleSelectionUpdate = () => {
      // Small delay to ensure DOM is updated
      setTimeout(updateBubble, 10);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('focus', handleSelectionUpdate);
    editor.on('blur', () => {
      // Keep visible briefly to allow clicking bubble
      setTimeout(() => {
        if (!bubbleRef.current?.contains(document.activeElement)) {
          setIsVisible(false);
        }
      }, 150);
    });

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('focus', handleSelectionUpdate);
      editor.off('blur');
    };
  }, [editor]);

  const handleCreateFlashcard = () => {
    if (!selection) return;
    
    // TODO: Implement flashcard creation
    console.log('Create flashcard:', selection.text);
    setIsVisible(false);
    editor.chain().focus().run();
  };

  const handleAddToTask = () => {
    if (!selection || !documentId) return;
    
    // Create highlight first, then open task dialog
    createHighlight({
      documentId,
      anchorStart: selection.from,
      anchorEnd: selection.to,
      textContent: selection.text,
    }, {
      onSuccess: (highlight) => {
        setIsVisible(false);
        setTaskDialogOpen(true);
      }
    });
  };

  const handleAIExplain = async () => {
    if (!selection) return;
    
    setIsVisible(false);
    setAiDialogOpen(true);
    
    try {
      await complete(
        'Please explain this text clearly and provide helpful context.',
        'explain',
        selection.text
      );
    } catch (error) {
      // Error handling is done in the hook
    }
    
    editor.chain().focus().run();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
      editor.chain().focus().run();
    }
  };

  if (!isVisible || !selection) return null;

  return (
    <>
      <Card
        ref={bubbleRef}
        className={cn(
          "fixed z-50 p-2 shadow-lg border bg-card",
          "animate-in fade-in-0 zoom-in-95 duration-150"
        )}
        style={{
          top: position.top,
          left: position.left,
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCreateFlashcard}
            className="h-8 px-2 text-xs gap-1"
            title="Create Flashcard"
          >
            <CreditCard className="h-3 w-3" />
            <span className="hidden sm:inline">Flashcard</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddToTask}
            className="h-8 px-2 text-xs gap-1"
            title="Add to Task"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Task</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleAIExplain}
            className="h-8 px-2 text-xs gap-1"
            title="AI Explain"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? 'Thinking...' : 'Explain'}
            </span>
          </Button>
        </div>
      </Card>

      <AIResponseDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        title="AI Explanation"
        result={result}
        isLoading={isLoading}
        selectedText={selection?.text}
      />

      <CreateTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        boardId={defaultBoardId}
        selectedText={selection?.text}
        onTaskCreated={() => {
          setTaskDialogOpen(false);
          editor.chain().focus().run();
        }}
      />
    </>
  );
}
