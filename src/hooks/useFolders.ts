import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useFolders() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['folders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data.map(folder => ({
        id: folder.id,
        name: folder.name,
        parentId: folder.parent_id,
        userId: folder.user_id,
        createdAt: folder.created_at,
        updatedAt: folder.updated_at,
      })) as Folder[];
    },
    enabled: !!user,
  });

  const createFolder = useMutation({
    mutationFn: async (newFolder: { name: string; parentId?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: newFolder.name,
          parent_id: newFolder.parentId || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] });
      toast({
        title: 'Folder created',
        description: 'New folder has been created successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create folder. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const updateFolder = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('folders')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to rename folder. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteFolder = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders', user?.id] });
      toast({
        title: 'Folder deleted',
        description: 'The folder has been deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete folder. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    folders: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createFolder: createFolder.mutate,
    updateFolder: updateFolder.mutate,
    deleteFolder: deleteFolder.mutate,
    isCreating: createFolder.isPending,
    isUpdating: updateFolder.isPending,
    isDeleting: deleteFolder.isPending,
  };
}