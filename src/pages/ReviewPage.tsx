import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Flashcard from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Brain, Trophy, Target } from 'lucide-react';
import { ReviewQuality, calculateNextReview } from '@/utils/sm2';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CardReview {
  id: string;
  front: string;
  back: string;
  repetitions: number;
  interval: number;
  ease: number;
}

export default function ReviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cards, setCards] = useState<CardReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadDueCards();
  }, [user, navigate]);

  const loadDueCards = async () => {
    if (!user) return;
    
    try {
      // Get cards due for review today
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          card_id,
          repetitions,
          interval_days,
          ease_factor,
          cards (
            front,
            back
          )
        `)
        .eq('user_id', user.id)
        .lte('due_date', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      const dueCards = data?.map(review => ({
        id: review.card_id,
        front: review.cards?.front || '',
        back: review.cards?.back || '',
        repetitions: review.repetitions,
        interval: review.interval_days,
        ease: Number(review.ease_factor)
      })) || [];

      setCards(dueCards);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading due cards:', error);
      toast({
        title: "Error loading cards",
        description: "Could not load your review cards. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleCardRate = async (quality: ReviewQuality) => {
    if (!user || currentIndex >= cards.length) return;
    
    const card = cards[currentIndex];
    
    try {
      // Calculate next review using SM-2
      const nextReview = calculateNextReview(quality, {
        repetitions: card.repetitions,
        interval: card.interval,
        ease: card.ease
      });

      // Update review data in database
      await supabase
        .from('reviews')
        .update({
          repetitions: nextReview.repetitions,
          interval_days: nextReview.interval,
          ease_factor: nextReview.ease,
          due_date: nextReview.due.toISOString().split('T')[0],
          last_reviewed_at: new Date().toISOString(),
          last_quality: quality
        })
        .eq('card_id', card.id)
        .eq('user_id', user.id);

      // Update session stats
      const qualityLabels = {
        [ReviewQuality.Again]: 'again',
        [ReviewQuality.Hard]: 'hard',
        [ReviewQuality.Good]: 'good',
        [ReviewQuality.Easy]: 'easy'
      } as const;

      setSessionStats(prev => ({
        ...prev,
        [qualityLabels[quality]]: prev[qualityLabels[quality]] + 1
      }));

      setCompletedCount(prev => prev + 1);
      
      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Session complete
        toast({
          title: "Review session complete!",
          description: `You reviewed ${cards.length} cards. Great work!`,
        });
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error saving review",
        description: "Your review couldn't be saved. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="text-muted-foreground">Loading your review session...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-background p-lg">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-xs" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardHeader className="text-center">
              <div className="bg-gradient-accent p-lg rounded-full w-16 h-16 mx-auto mb-md">
                <Trophy className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="font-heading">All caught up!</CardTitle>
              <CardDescription>
                You have no cards due for review today. Come back tomorrow!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBackToDashboard} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isSessionComplete = currentIndex >= cards.length;
  const progress = (completedCount / cards.length) * 100;

  if (isSessionComplete) {
    return (
      <div className="min-h-screen bg-background p-lg">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="bg-gradient-primary p-lg rounded-full w-16 h-16 mx-auto mb-md">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="font-heading">Session Complete!</CardTitle>
              <CardDescription>
                You've reviewed all {cards.length} cards due today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md text-center">
                <div>
                  <div className="text-2xl font-semibold text-destructive">{sessionStats.again}</div>
                  <div className="text-sm text-muted-foreground">Again</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-muted-foreground">{sessionStats.hard}</div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-secondary">{sessionStats.good}</div>
                  <div className="text-sm text-muted-foreground">Good</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-primary">{sessionStats.easy}</div>
                  <div className="text-sm text-muted-foreground">Easy</div>
                </div>
              </div>
              <Button onClick={handleBackToDashboard} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-background p-lg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="w-4 h-4 mr-xs" />
            Exit Review
          </Button>
          
          <div className="flex items-center space-x-md">
            <Brain className="w-5 h-5 text-accent" />
            <span className="font-medium">
              {currentIndex + 1} of {cards.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-xl">
          <div className="flex justify-between text-sm text-muted-foreground mb-xs">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <Flashcard
          front={currentCard.front}
          back={currentCard.back}
          onRate={handleCardRate}
        />

        {/* Session Stats */}
        <Card className="mt-lg">
          <CardContent className="p-md">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-xs">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Session:</span>
              </div>
              <div className="flex space-x-md">
                <span className="text-destructive">{sessionStats.again} Again</span>
                <span className="text-muted-foreground">{sessionStats.hard} Hard</span>
                <span className="text-secondary">{sessionStats.good} Good</span>
                <span className="text-primary">{sessionStats.easy} Easy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}