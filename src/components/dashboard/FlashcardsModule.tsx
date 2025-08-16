import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Plus, RotateCcw, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Flashcard from '@/components/Flashcard'

export function FlashcardsModule() {
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground">Review and memorize with spaced repetition</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Deck
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">Due Today</CardTitle>
                <CardDescription>15 cards</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <RotateCcw className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-sm">In Review</CardTitle>
                <CardDescription>8 cards</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-accent/10 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm">Mastered</CardTitle>
                <CardDescription>42 cards</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="h-[calc(100vh-300px)]">
        <CardHeader>
          <CardTitle>Study Session</CardTitle>
          <CardDescription>Review your flashcards with spaced repetition</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-secondary/10 p-8 rounded-full mx-auto mb-4 w-fit">
              <Brain className="w-12 h-12 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to Study</h3>
            <p className="text-muted-foreground mb-4">Start reviewing your flashcards</p>
            <Button>Start Study Session</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}