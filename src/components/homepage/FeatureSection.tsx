import { FileText, Zap, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const FeatureSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Smart Document Editor",
      description: "Create rich notes with real-time AI assistance. Highlight any text to get instant explanations, generate flashcards, or create related tasks.",
      gradient: "bg-gradient-primary",
      benefits: ["AI-powered explanations", "Automatic flashcard generation", "Task creation from highlights"]
    },
    {
      icon: Zap,
      title: "Intelligent Review System", 
      description: "Master any subject with spaced repetition. Our algorithm schedules reviews at optimal intervals to maximize retention and minimize study time.",
      gradient: "bg-gradient-secondary",
      benefits: ["Spaced repetition algorithm", "Progress tracking", "Adaptive scheduling"]
    },
    {
      icon: Calendar,
      title: "Integrated Task Management",
      description: "Never miss a deadline again. Create tasks directly from your study materials and keep everything organized in one place.",
      gradient: "bg-gradient-accent", 
      benefits: ["Link tasks to notes", "Due date tracking", "Priority management"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Everything you need to <span className="bg-gradient-primary bg-clip-text text-transparent">excel</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete study workflow that connects note-taking, review, and task management in one seamless experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border shadow-md hover:shadow-lg transition-smooth bg-card">
              <CardContent className="p-8">
                <div className={`inline-flex p-4 rounded-xl ${feature.gradient} shadow-glow mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <ArrowRight className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg px-8 py-4 text-lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};