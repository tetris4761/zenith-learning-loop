import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-semibold text-foreground">
            Zenith
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-smooth">
            How it Works
          </a>
        </div>

        <Button 
          onClick={() => navigate('/auth')}
          className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-md"
        >
          Sign In
        </Button>
      </div>
    </nav>
  );
};