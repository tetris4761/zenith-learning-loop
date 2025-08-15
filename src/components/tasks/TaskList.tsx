import React from 'react';
import { Clock, Tag, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type Task } from '@/hooks/useTasks';
import { cn } from '@/lib/utils';
import { format, isToday, isPast } from 'date-fns';

interface TaskListProps {
  boardId: string;
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ boardId, tasks, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="mb-2">No tasks in this board</p>
        <p className="text-xs">Create your first task to get started</p>
      </div>
    );
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const isTaskOverdue = (due_at?: string) => {
    if (!due_at) return false;
    return isPast(new Date(due_at)) && !isToday(new Date(due_at));
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={cn(
            "hover:shadow-sm transition-shadow cursor-pointer",
            isTaskOverdue(task.due_at) && "border-destructive/50"
          )}
        >
          <CardContent className="p-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm leading-relaxed flex-1">
                  {task.title}
                </h4>
                <Badge 
                  variant={getPriorityColor(task.priority)} 
                  className="ml-2 h-5 text-xs gap-1"
                >
                  {getPriorityIcon(task.priority)}
                  {task.priority}
                </Badge>
              </div>

              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <div className="flex gap-1">
                        {task.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="h-4 text-xs px-1">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="outline" className="h-4 text-xs px-1">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {task.due_at && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isTaskOverdue(task.due_at) ? "text-destructive" : "text-muted-foreground"
                  )}>
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.due_at), 'MMM dd')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}