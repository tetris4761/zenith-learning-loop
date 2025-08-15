import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface PomodoroBarProps {
  onSessionComplete?: (focusMinutes: number, breakMinutes: number) => void;
}

interface PomodoroPreset {
  name: string;
  focus: number;
  break: number;
}

const presets: PomodoroPreset[] = [
  { name: '25/5', focus: 25, break: 5 },
  { name: '50/10', focus: 50, break: 10 }
];

export default function PomodoroBar({ onSessionComplete }: PomodoroBarProps) {
  const [currentPreset, setCurrentPreset] = useState(presets[0]);
  const [timeLeft, setTimeLeft] = useState(currentPreset.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session completed
      setIsRunning(false);
      
      if (sessionStartTime && onSessionComplete) {
        const minutes = isBreak ? currentPreset.break : currentPreset.focus;
        onSessionComplete(
          isBreak ? 0 : minutes,
          isBreak ? minutes : 0
        );
      }
      
      // Auto-switch to break or focus
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(currentPreset.break * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(currentPreset.focus * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, currentPreset, sessionStartTime, onSessionComplete]);

  const toggleTimer = () => {
    if (!isRunning) {
      setSessionStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(currentPreset.focus * 60);
    setSessionStartTime(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? currentPreset.break * 60 : currentPreset.focus * 60);
    setSessionStartTime(null);
  };

  const switchPreset = (preset: PomodoroPreset) => {
    setCurrentPreset(preset);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(preset.focus * 60);
    setSessionStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = () => {
    const totalTime = isBreak ? currentPreset.break * 60 : currentPreset.focus * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="fixed top-md left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gradient-secondary text-secondary-foreground rounded-full shadow-lg px-lg py-md flex items-center space-x-md">
        {/* Preset Selector */}
        <div className="flex space-x-xs">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant={currentPreset.name === preset.name ? "default" : "ghost"}
              size="sm"
              onClick={() => switchPreset(preset)}
              className="text-xs rounded-full"
              disabled={isRunning}
            >
              {preset.name}
            </Button>
          ))}
        </div>

        {/* Progress Bar Background */}
        <div className="relative flex-1 bg-secondary-light rounded-full h-2 min-w-[120px]">
          <div 
            className="absolute left-0 top-0 h-full bg-secondary-foreground rounded-full transition-all duration-smooth"
            style={{ width: `${progressPercentage()}%` }}
          />
        </div>

        {/* Time Display */}
        <div className="font-mono font-semibold text-lg min-w-[60px] text-center">
          {formatTime(timeLeft)}
        </div>

        {/* Status */}
        <div className="text-sm font-medium min-w-[50px] text-center">
          {isBreak ? 'Break' : 'Focus'}
        </div>

        {/* Controls */}
        <div className="flex space-x-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTimer}
            className="rounded-full p-2"
          >
            {isRunning ? 
              <Pause className="w-4 h-4" /> : 
              <Play className="w-4 h-4" />
            }
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTimer}
            className="rounded-full p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={stopTimer}
            className="rounded-full p-2"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}