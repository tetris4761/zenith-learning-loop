import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatsStrip from '@/components/StatsStrip'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, Calendar, Plus, CheckSquare } from 'lucide-react'

export function DashboardHome() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    cardsDue: 0,
    cardsCompleted: 0,
    docsEdited: 0,
    focusMinutes: 0,
    tasksCompleted: 0,
    streak: 0
  })

  // Mock stats for initial demo
  useEffect(() => {
    setStats({
      cardsDue: 5,
      cardsCompleted: 12,
      docsEdited: 3,
      focusMinutes: 75,
      tasksCompleted: 8,
      streak: 7
    })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <StatsStrip {...stats} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate('/dashboard/documents')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Documents</CardTitle>
                <CardDescription>Write and organize notes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate('/dashboard/review')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base">Review</CardTitle>
                <CardDescription>Study flashcards due today</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              size="sm" 
              className="w-full" 
              variant={stats.cardsDue > 0 ? "default" : "secondary"}
            >
              {stats.cardsDue > 0 ? `Review ${stats.cardsDue} cards` : 'No cards due'}
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate('/dashboard/tasks')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CheckSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Tasks</CardTitle>
                <CardDescription>Manage your task board</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate('/dashboard/calendar')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-base">Calendar</CardTitle>
                <CardDescription>View upcoming tasks</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button size="sm" className="w-full" variant="secondary">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Recent Activity</CardTitle>
          <CardDescription>Your latest study progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
              <div className="bg-primary/10 p-2 rounded">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Welcome to Zenith</p>
                <p className="text-sm text-muted-foreground">Document updated 2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
              <div className="bg-accent/10 p-2 rounded">
                <Brain className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Cognitive Biases deck</p>
                <p className="text-sm text-muted-foreground">Reviewed 5 cards this morning</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
              <div className="bg-secondary/10 p-2 rounded">
                <CheckSquare className="w-4 h-4 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Study Plan board</p>
                <p className="text-sm text-muted-foreground">Completed 3 tasks yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}