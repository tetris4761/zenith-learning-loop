import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsStrip from '@/components/StatsStrip';
import PomodoroBar from '@/components/PomodoroBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Calendar, Settings, LogOut, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    cardsDue: 0,
    cardsCompleted: 0,
    docsEdited: 0,
    focusMinutes: 0,
    tasksCompleted: 0,
    streak: 0
  });

  // Mock stats for initial demo
  useEffect(() => {
    setStats({
      cardsDue: 5,
      cardsCompleted: 12,
      docsEdited: 3,
      focusMinutes: 75,
      tasksCompleted: 8,
      streak: 7
    });
  }, []);

  const handlePomodoroComplete = async (focusMinutes: number, breakMinutes: number) => {
    if (!user) return;
    
    // Save pomodoro session
    try {
      await supabase.from('pomodoro_sessions').insert({
        user_id: user.id,
        focus_minutes: focusMinutes,
        break_minutes: breakMinutes,
        completed_at: new Date().toISOString()
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        focusMinutes: prev.focusMinutes + focusMinutes
      }));
    } catch (error) {
      console.error('Error saving pomodoro session:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <PomodoroBar onSessionComplete={handlePomodoroComplete} />
      
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-lg py-md flex justify-between items-center">
          <div className="flex items-center space-x-md">
            <div className="bg-gradient-primary p-xs rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold font-heading">Zenith</h1>
          </div>
          
          <div className="flex items-center space-x-sm">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email?.split('@')[0]}
            </span>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-lg py-lg">
        <StatsStrip {...stats} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-smooth">
            <CardHeader className="pb-md">
              <div className="flex items-center space-x-md">
                <div className="bg-primary/10 p-sm rounded-lg">
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
                <Plus className="w-4 h-4 mr-xs" />
                New Document
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-smooth">
            <CardHeader className="pb-md">
              <div className="flex items-center space-x-md">
                <div className="bg-accent/10 p-sm rounded-lg">
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
                onClick={() => navigate('/review')}
              >
                {stats.cardsDue > 0 ? `Review ${stats.cardsDue} cards` : 'No cards due'}
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-smooth">
            <CardHeader className="pb-md">
              <div className="flex items-center space-x-md">
                <div className="bg-primary/10 p-sm rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Tasks</CardTitle>
                  <CardDescription>Manage your task board</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-xs" />
                Add Task
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow duration-smooth">
            <CardHeader className="pb-md">
              <div className="flex items-center space-x-md">
                <div className="bg-secondary/10 p-sm rounded-lg">
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
            <div className="space-y-md">
              <div className="flex items-center space-x-md p-md rounded-lg border border-border">
                <div className="bg-primary/10 p-xs rounded">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Welcome to Zenith</p>
                  <p className="text-sm text-muted-foreground">Document updated 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-md p-md rounded-lg border border-border">
                <div className="bg-accent/10 p-xs rounded">
                  <Brain className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Cognitive Biases deck</p>
                  <p className="text-sm text-muted-foreground">Reviewed 5 cards this morning</p>
                </div>
              </div>

              <div className="flex items-center space-x-md p-md rounded-lg border border-border">
                <div className="bg-secondary/10 p-xs rounded">
                  <Calendar className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Study Plan board</p>
                  <p className="text-sm text-muted-foreground">Completed 3 tasks yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}