import React, { useState } from 'react';
import { Plus, Settings, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBoards } from '@/hooks/useBoards';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from './TaskList';
import { CreateTaskDialog } from './CreateTaskDialog';

interface TaskSidebarProps {
  onTaskCreate?: (taskId: string) => void;
}

export function TaskSidebar({ onTaskCreate }: TaskSidebarProps) {
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const { boards, isLoading: boardsLoading } = useBoards();
  const { tasks, isLoading: tasksLoading } = useTasks({ boardId: selectedBoardId });

  const selectedBoard = boards?.find(board => board.id === selectedBoardId);

  // Auto-select first board if none selected
  React.useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const handleTaskCreated = (taskId: string) => {
    setCreateTaskOpen(false);
    onTaskCreate?.(taskId);
  };

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
          <Button 
            size="sm" 
            onClick={() => setCreateTaskOpen(true)}
            disabled={!selectedBoardId}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Board Selector */}
        <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a board" />
          </SelectTrigger>
          <SelectContent>
            {boards?.map((board) => (
              <SelectItem key={board.id} value={board.id}>
                {board.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 overflow-auto p-4">
        {selectedBoardId ? (
          <TaskList 
            boardId={selectedBoardId} 
            tasks={tasks || []}
            isLoading={tasksLoading}
          />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a board to view tasks</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {selectedBoard && tasks && (
        <div className="p-4 border-t border-border">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Tasks</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <CreateTaskDialog
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        boardId={selectedBoardId}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}