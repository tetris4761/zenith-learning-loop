import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  title: string;
  content: any;
  folderId?: string;
  wordCount: number;
  updatedAt: string;
  createdAt: string;
  userId: string;
}

interface UseDocumentsOptions {
  folderId?: string | null;
  searchQuery?: string;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['documents', user?.id, options.folderId, options.searchQuery],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (options.folderId) {
        query = query.eq('folder_id', options.folderId);
      } else if (options.folderId === null) {
        query = query.is('folder_id', null);
      }

      if (options.searchQuery) {
        query = query.or(`title.ilike.%${options.searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        folderId: doc.folder_id,
        wordCount: doc.word_count,
        updatedAt: doc.updated_at,
        createdAt: doc.created_at,
        userId: doc.user_id,
      })) as Document[];
    },
    enabled: !!user,
  });

  const createDocument = useMutation({
    mutationFn: async (newDoc: { title?: string; folderId?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: newDoc.title || 'Untitled',
          content: {},
          folder_id: newDoc.folderId || null,
          user_id: user.id,
          word_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast({
        title: 'Document created',
        description: 'Your new document is ready to edit.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; content?: any; wordCount?: number }) => {
      if (!user) throw new Error('Not authenticated');

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.wordCount !== undefined) updateData.word_count = updates.wordCount;
      
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', user?.id] });
      toast({
        title: 'Document deleted',
        description: 'The document has been permanently deleted.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    documents: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createDocument: createDocument.mutate,
    updateDocument: updateDocument.mutate,
    deleteDocument: deleteDocument.mutate,
    isCreating: createDocument.isPending,
    isUpdating: updateDocument.isPending,
    isDeleting: deleteDocument.isPending,
  };
}