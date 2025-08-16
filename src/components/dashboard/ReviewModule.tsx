import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain } from 'lucide-react'

export function ReviewModule() {
  return (
    <div className="h-full p-6">
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <div className="bg-accent/10 p-6 rounded-full mx-auto mb-4 w-fit">
            <Brain className="w-12 h-12 text-accent" />
          </div>
          <CardTitle className="mb-2">Review System Coming Soon</CardTitle>
          <CardDescription>
            Spaced repetition flashcards and review features will be available in a future update.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}