import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, FileText, Timer, CheckCircle, Flame } from 'lucide-react';

interface StatsStripProps {
  cardsDue: number;
  cardsCompleted: number;
  docsEdited: number;
  focusMinutes: number;
  tasksCompleted: number;
  streak: number;
}

export default function StatsStrip({
  cardsDue,
  cardsCompleted, 
  docsEdited,
  focusMinutes,
  tasksCompleted,
  streak
}: StatsStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-md mb-lg">
      <Card>
        <CardContent className="p-md text-center">
          <div className="flex items-center justify-center mb-xs">
            <Brain className="w-5 h-5 text-accent mr-xs" />
          </div>
          <div className="text-2xl font-semibold text-accent">{cardsDue}</div>
          <div className="text-sm text-muted-foreground">Cards Due</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-md text-center">
          <div className="flex items-center justify-center mb-xs">
            <Brain className="w-5 h-5 text-primary mr-xs" />
          </div>
          <div className="text-2xl font-semibold text-primary">{cardsCompleted}</div>
          <div className="text-sm text-muted-foreground">Reviewed</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-md text-center">
          <div className="flex items-center justify-center mb-xs">
            <FileText className="w-5 h-5 text-primary mr-xs" />
          </div>
          <div className="text-2xl font-semibold text-primary">{docsEdited}</div>
          <div className="text-sm text-muted-foreground">Docs Edited</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-md text-center">
          <div className="flex items-center justify-center mb-xs">
            <Timer className="w-5 h-5 text-secondary mr-xs" />
          </div>
          <div className="text-2xl font-semibold text-secondary">{focusMinutes}</div>
          <div className="text-sm text-muted-foreground">Focus Min</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-md text-center">
          <div className="flex items-center justify-center mb-xs">
            <CheckCircle className="w-5 h-5 text-primary mr-xs" />
          </div>
          <div className="text-2xl font-semibold text-primary">{tasksCompleted}</div>
          <div className="text-sm text-muted-foreground">Tasks Done</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-md text-center">
          <div className="flex items-center justify-center mb-xs">
            <Flame className="w-5 h-5 text-secondary mr-xs" />
          </div>
          <div className="text-2xl font-semibold text-secondary">{streak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </CardContent>
      </Card>
    </div>
  );
}