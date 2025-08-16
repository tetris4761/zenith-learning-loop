import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Highlight {
  id: string;
  documentId: string;
  userId: string;
  anchorData: any;
  textContent: string;
  createdAt: string;
}

export function useHighlights(documentId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['highlights', user?.id, documentId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('highlights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (documentId) {
        query = query.eq('document_id', documentId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data.map(highlight => ({
        id: highlight.id,
        documentId: highlight.document_id,
        userId: highlight.user_id,
        anchorData: highlight.anchor_data,
        textContent: highlight.text_content,
        createdAt: highlight.created_at,
      })) as Highlight[];
    },
    enabled: !!user,
  });

  const createHighlight = useMutation({
    mutationFn: async (newHighlight: { 
      documentId: string; 
      anchorStart: number; 
      anchorEnd: number; 
      textContent: string; 
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('highlights')
        .insert({
          document_id: newHighlight.documentId,
          user_id: user.id,
          anchor_data: {
            start: newHighlight.anchorStart,
            end: newHighlight.anchorEnd,
          },
          text_content: newHighlight.textContent,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights', user?.id] });
      toast({
        title: 'Highlight created',
        description: 'Text has been highlighted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create highlight. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteHighlight = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights', user?.id] });
      toast({
        title: 'Highlight deleted',
        description: 'The highlight has been removed.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete highlight. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    highlights: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createHighlight: createHighlight.mutate,
    createHighlightAsync: createHighlight.mutateAsync,
    deleteHighlight: deleteHighlight.mutate,
    isCreating: createHighlight.isPending,
    isDeleting: deleteHighlight.isPending,
  };
}