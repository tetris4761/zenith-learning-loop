import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PomodoroBar from '@/components/PomodoroBar'

export function PomodoroModule() {
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Focus Timer</h1>
        <p className="text-muted-foreground">Stay focused with the Pomodoro Technique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Today's Sessions</CardTitle>
                <CardDescription>Completed</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Goal: 6 sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Timer className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-sm">Focus Time</CardTitle>
                <CardDescription>This week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5h</div>
            <p className="text-xs text-muted-foreground">+1.2h from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Coffee className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">Breaks Taken</CardTitle>
                <CardDescription>Today</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Short breaks</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Session</CardTitle>
          <CardDescription>Focus on your most important task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-primary mb-4">25:00</div>
              <div className="flex items-center gap-2 justify-center mb-4">
                <Button size="sm" variant="outline">
                  <Play className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Pause className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Work Session</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>Your recent focus sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '14:30', duration: '25 min', type: 'Focus', task: 'Study React patterns' },
              { time: '13:45', duration: '5 min', type: 'Break', task: 'Short break' },
              { time: '13:00', duration: '25 min', type: 'Focus', task: 'Write documentation' },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${session.type === 'Focus' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                    {session.type === 'Focus' ? (
                      <Clock className="w-3 h-3 text-primary" />
                    ) : (
                      <Coffee className="w-3 h-3 text-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{session.task}</p>
                    <p className="text-xs text-muted-foreground">{session.time}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{session.duration}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}