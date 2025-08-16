import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export function CalendarModule() {
  return (
    <div className="h-full p-6">
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <div className="bg-secondary/10 p-6 rounded-full mx-auto mb-4 w-fit">
            <Calendar className="w-12 h-12 text-secondary" />
          </div>
          <CardTitle className="mb-2">Calendar Coming Soon</CardTitle>
          <CardDescription>
            Calendar and scheduling features will be available in a future update.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}