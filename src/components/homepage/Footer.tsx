import { BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-heading font-semibold text-foreground">
              Zenith
            </span>
          </div>

          <div className="flex items-center space-x-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-smooth">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-smooth">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-smooth">
              Support
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Zenith. Transform your study workflow with intelligent learning.</p>
        </div>
      </div>
    </footer>
  );
};