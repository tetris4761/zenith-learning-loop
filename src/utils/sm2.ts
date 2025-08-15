// SM-2 Algorithm for Spaced Repetition
// Based on the SuperMemo SM-2 algorithm

export interface ReviewData {
  repetitions: number;
  interval: number;
  ease: number;
}

export interface ReviewResult extends ReviewData {
  due: Date;
}

export enum ReviewQuality {
  Again = 1,    // Complete blackout
  Hard = 3,     // Incorrect response but remembered upon seeing answer
  Good = 4,     // Correct response with some hesitation  
  Easy = 5      // Perfect response
}

export function calculateNextReview(
  quality: ReviewQuality,
  previous: ReviewData = { repetitions: 0, interval: 1, ease: 2.5 }
): ReviewResult {
  const { repetitions, interval, ease } = previous;
  
  let newRepetitions = repetitions;
  let newInterval = interval;
  let newEase = ease;

  // If quality < 3 (Again or very poor), reset repetitions
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Successful response
    newRepetitions = repetitions + 1;
    
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * ease);
    }
  }

  // Update ease factor based on quality
  // ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Minimum ease factor is 1.3
  if (newEase < 1.3) {
    newEase = 1.3;
  }

  // Calculate due date
  const due = new Date();
  due.setDate(due.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    interval: newInterval,
    ease: Number(newEase.toFixed(2)),
    due
  };
}

export function getDueCards(reviews: Array<{ due_date: string }>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return reviews.filter(review => {
    const dueDate = new Date(review.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  });
}

export function formatDaysUntilDue(dueDate: string): string {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Due today';
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
  return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
}