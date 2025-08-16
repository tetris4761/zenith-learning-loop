import { BookOpen, Brain, CheckSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-20 pb-16 bg-gradient-subtle min-h-screen flex items-center">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground leading-tight">
            Your Study Workflow 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Companion</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your learning with smart notes, spaced repetition, and integrated task management. 
            Study smarter, not harder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg px-8 py-4 text-lg"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-gradient-primary rounded-xl shadow-glow">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Smart Documents</h3>
              <p className="text-muted-foreground text-center">AI-powered note-taking with instant explanations</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-gradient-secondary rounded-xl shadow-md">
                <Brain className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Spaced Repetition</h3>
              <p className="text-muted-foreground text-center">Scientifically-backed review system</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="p-4 bg-gradient-accent rounded-xl shadow-md">
                <CheckSquare className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Task Management</h3>
              <p className="text-muted-foreground text-center">Connect tasks to your study materials</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};