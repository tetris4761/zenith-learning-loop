import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description?: string;
  board_id: string;
  column_id: string;
  position: number;
  user_id: string;
  priority?: 'low' | 'medium' | 'high';
  due_at?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface UseTasksOptions {
  boardId?: string;
  columnId?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { boardId, columnId } = options;

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', boardId, columnId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (boardId) {
        query = query.eq('board_id', boardId);
      }
      
      if (columnId) {
        query = query.eq('column_id', columnId);
      }

      const { data, error } = await query
        .order('position', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      boardId: string;
      columnId: string;
      priority?: 'low' | 'medium' | 'high';
      dueAt?: string;
      tags?: string[];
      highlightId?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Get the highest position in the column
      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('position')
        .eq('column_id', taskData.columnId)
        .order('position', { ascending: false })
        .limit(1);

      const position = existingTasks && existingTasks.length > 0 
        ? existingTasks[0].position + 1 
        : 0;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          board_id: taskData.boardId,
          column_id: taskData.columnId,
          user_id: user.id,
          position,
          priority: taskData.priority || 'medium',
          due_at: taskData.dueAt,
          tags: taskData.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      // If highlightId is provided, create a link
      if (taskData.highlightId) {
        await supabase
          .from('links')
          .insert({
            task_id: data.id,
            linked_type: 'highlight',
            linked_id: taskData.highlightId,
          });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating task',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: { 
      id: string;
      title?: string;
      description?: string;
      column_id?: string;
      position?: number;
      priority?: 'low' | 'medium' | 'high';
      due_at?: string;
      tags?: string[];
    }) => {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.column_id !== undefined) updateData.column_id = updates.column_id;
      if (updates.position !== undefined) updateData.position = updates.position;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.due_at !== undefined) updateData.due_at = updates.due_at;
      if (updates.tags !== undefined) updateData.tags = updates.tags;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: 'Error updating task',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Task deleted',
        description: 'Task has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting task',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
    isDeleting: deleteTask.isPending,
  };
}