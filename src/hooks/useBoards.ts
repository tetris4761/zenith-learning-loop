import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Board {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  name: string;
  position: number;
  board_id: string;
  created_at: string;
}

export function useBoards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: boards, isLoading, error } = useQuery({
    queryKey: ['boards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createBoard = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('boards')
        .insert({
          name,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default columns for the new board
      const defaultColumns = [
        { name: 'To Do', position: 0 },
        { name: 'In Progress', position: 1 },
        { name: 'Done', position: 2 },
      ];

      const { error: columnsError } = await supabase
        .from('columns')
        .insert(
          defaultColumns.map((col) => ({
            ...col,
            board_id: data.id,
          }))
        );

      if (columnsError) throw columnsError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: 'Board created',
        description: 'Your new board has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating board',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const updateBoard = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from('boards')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: 'Board updated',
        description: 'Board has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating board',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast({
        title: 'Board deleted',
        description: 'Board has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting board',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    boards,
    isLoading,
    error,
    createBoard: createBoard.mutate,
    updateBoard: updateBoard.mutate,
    deleteBoard: deleteBoard.mutate,
    isCreating: createBoard.isPending,
    isUpdating: updateBoard.isPending,
    isDeleting: deleteBoard.isPending,
  };
}

export function useBoardColumns(boardId?: string) {
  const { data: columns, isLoading } = useQuery({
    queryKey: ['columns', boardId],
    queryFn: async () => {
      if (!boardId) return [];
      
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!boardId,
  });

  return {
    columns,
    isLoading,
  };
}