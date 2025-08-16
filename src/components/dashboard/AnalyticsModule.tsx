import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, TrendingUp, Clock, Target, BookOpen, CheckSquare } from 'lucide-react'
import StatsStrip from '@/components/StatsStrip'

export function AnalyticsModule() {
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your progress and productivity</p>
      </div>

      <div className="mb-6">
        <StatsStrip 
          cardsDue={15}
          cardsCompleted={42}
          docsEdited={8}
          focusMinutes={510}
          tasksCompleted={24}
          streak={7}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Study Time</CardTitle>
                <CardDescription>This week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5h</div>
            <p className="text-xs text-muted-foreground">+2.3h from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <BookOpen className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-sm">Documents</CardTitle>
                <CardDescription>Created</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-accent/10 p-2 rounded-lg">
                <CheckSquare className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">Tasks Completed</CardTitle>
                <CardDescription>This week</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">89% completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Weekly Progress
            </CardTitle>
            <CardDescription>Your activity over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Chart placeholder - Weekly activity data
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Trends
            </CardTitle>
            <CardDescription>Track your learning efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              Chart placeholder - Performance trends
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}