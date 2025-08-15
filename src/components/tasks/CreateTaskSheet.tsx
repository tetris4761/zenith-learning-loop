import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useBoardColumns } from '@/hooks/useBoards';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateTaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  onTaskCreated?: (taskId: string) => void;
  highlightId?: string;
  selectedText?: string;
}

export function CreateTaskSheet({ 
  open, 
  onOpenChange, 
  boardId, 
  onTaskCreated,
  highlightId,
  selectedText 
}: CreateTaskSheetProps) {
  const [title, setTitle] = useState(selectedText || '');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState('');

  const { createTask, isCreating } = useTasks();
  const { columns } = useBoardColumns(boardId);

  // Auto-select first column when available
  React.useEffect(() => {
    if (columns && columns.length > 0 && !columnId) {
      setColumnId(columns[0].id);
    }
  }, [columns, columnId]);

  // Update title when selectedText changes
  React.useEffect(() => {
    if (selectedText) {
      setTitle(selectedText);
    }
  }, [selectedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !columnId) return;

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      boardId,
      columnId,
      priority,
      dueAt: dueDate?.toISOString(),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      highlightId,
    };

    createTask(taskData, {
      onSuccess: (task) => {
        // Reset form
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate(undefined);
        setTags('');
        
        onTaskCreated?.(task.id);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isCreating) {
      // Reset form when closing
      setTitle(selectedText || '');
      setDescription('');
      setPriority('medium');
      setDueDate(undefined);
      setTags('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Create New Task</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-auto py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add task description (optional)"
                className="min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="column">Column *</Label>
                <Select value={columnId} onValueChange={setColumnId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns?.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>
          </form>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isCreating || !title.trim() || !columnId}
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Task
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}