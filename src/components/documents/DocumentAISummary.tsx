import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, FileText } from 'lucide-react';
import { useAICompletion } from '@/hooks/useAICompletion';
import { AIResponseDialog } from './AIResponseDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentAISummaryProps {
  content: string;
  title: string;
  className?: string;
}

export function DocumentAISummary({ content, title, className }: DocumentAISummaryProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { complete, isLoading, result } = useAICompletion();

  const extractTextFromContent = (jsonContent: string): string => {
    try {
      const doc = JSON.parse(jsonContent);
      
      const extractText = (node: any): string => {
        if (node.type === 'text') {
          return node.text || '';
        }
        
        if (node.content && Array.isArray(node.content)) {
          return node.content.map(extractText).join(' ');
        }
        
        return '';
      };
      
      return extractText(doc).trim();
    } catch {
      return jsonContent;
    }
  };

  const handleSummarize = async () => {
    const textContent = extractTextFromContent(content);
    
    if (!textContent.trim()) {
      return;
    }

    setDialogOpen(true);
    
    try {
      await complete(
        'Please provide a comprehensive summary of this document.',
        'summarize',
        textContent
      );
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const textContent = extractTextFromContent(content);
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;

  if (wordCount < 50) {
    return null; // Don't show summary for very short documents
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Document Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              {wordCount} words • Ready for AI summarization
            </div>
            
            <Button
              onClick={handleSummarize}
              size="sm"
              className="w-full gap-2"
              disabled={isLoading}
            >
              <Sparkles className="h-3 w-3" />
              {isLoading ? 'Generating Summary...' : 'Generate AI Summary'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AIResponseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Summary: ${title}`}
        result={result}
        isLoading={isLoading}
      />
    </>
  );
}