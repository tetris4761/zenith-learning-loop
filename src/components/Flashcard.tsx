import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckCircle, X, Frown, Meh } from 'lucide-react';
import { ReviewQuality } from '@/utils/sm2';

interface FlashcardProps {
  front: string;
  back: string;
  onRate: (quality: ReviewQuality) => void;
}

export default function Flashcard({ front, back, onRate }: FlashcardProps) {
  const [showBack, setShowBack] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setShowBack(!showBack);
      setIsFlipping(false);
    }, 150);
  };

  const handleRate = (quality: ReviewQuality) => {
    onRate(quality);
    // Reset for next card
    setShowBack(false);
    setIsFlipping(false);
  };

  const ratingButtons = [
    {
      quality: ReviewQuality.Again,
      label: 'Again',
      icon: X,
      variant: 'destructive' as const,
      description: 'Complete blackout'
    },
    {
      quality: ReviewQuality.Hard,
      label: 'Hard', 
      icon: Frown,
      variant: 'outline' as const,
      description: 'Incorrect, but remembered'
    },
    {
      quality: ReviewQuality.Good,
      label: 'Good',
      icon: Meh,
      variant: 'secondary' as const,
      description: 'Correct with hesitation'
    },
    {
      quality: ReviewQuality.Easy,
      label: 'Easy',
      icon: CheckCircle,
      variant: 'review' as const,
      description: 'Perfect response'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card 
        className={`min-h-[300px] cursor-pointer transition-all duration-smooth hover:shadow-lg ${
          isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
        onClick={!showBack ? handleFlip : undefined}
      >
        <CardContent className="p-xl flex flex-col justify-center items-center text-center min-h-[300px]">
          {!showBack ? (
            <div className="space-y-lg">
              <div className="text-xl font-medium font-body text-foreground">
                {front}
              </div>
              <div className="text-sm text-muted-foreground">
                Click to reveal answer
              </div>
            </div>
          ) : (
            <div className="space-y-lg">
              <div className="text-lg font-medium font-body text-foreground">
                {back}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-xs" />
                Show question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rating Buttons - Only show when answer is revealed */}
      {showBack && (
        <div className="mt-lg space-y-md">
          <div className="text-center text-sm text-muted-foreground">
            How well did you know this?
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
            {ratingButtons.map(({ quality, label, icon: Icon, variant, description }) => (
              <Button
                key={quality}
                variant={variant}
                size="lg"
                onClick={() => handleRate(quality)}
                className="flex-col h-auto py-md space-y-xs"
              >
                <Icon className="w-5 h-5" />
                <div className="font-medium">{label}</div>
                <div className="text-xs opacity-80">{description}</div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}