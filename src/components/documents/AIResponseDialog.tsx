import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface AIResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  result: string | null;
  isLoading: boolean;
  selectedText?: string;
}

export function AIResponseDialog({
  open,
  onOpenChange,
  title,
  result,
  isLoading,
  selectedText
}: AIResponseDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({
        title: 'Copied',
        description: 'AI response copied to clipboard',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto space-y-4">
          {selectedText && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Selected text:</h4>
              <p className="text-sm leading-relaxed">{selectedText}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">AI Response:</h4>
              {result && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2 gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : result ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-sm">
                  {result}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}