import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UseAICompletionOptions {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export function useAICompletion(options: UseAICompletionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const complete = async (
    prompt: string,
    type: 'explain' | 'summarize' | 'improve' | 'generate',
    selectedText?: string
  ) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await supabase.functions.invoke('ai-completion', {
        body: {
          prompt,
          type,
          selectedText
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'AI completion failed');
      }

      const { result: aiResult } = response.data;
      setResult(aiResult);
      
      if (options.onSuccess) {
        options.onSuccess(aiResult);
      }

      return aiResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('AI completion error:', error);
      
      if (options.onError) {
        options.onError(errorMessage);
      } else {
        toast({
          title: 'AI Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    complete,
    isLoading,
    result,
    setResult
  };
}