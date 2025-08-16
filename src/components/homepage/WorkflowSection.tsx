import { ArrowRight, FileEdit, Brain, CheckCircle } from 'lucide-react';

export const WorkflowSection = () => {
  const steps = [
    {
      icon: FileEdit,
      title: "Create & Learn",
      description: "Take notes and highlight important concepts. Get AI explanations instantly to deepen your understanding.",
      color: "text-primary"
    },
    {
      icon: Brain,
      title: "Review & Remember", 
      description: "Convert highlights into flashcards. Our spaced repetition system schedules optimal review times.",
      color: "text-secondary"
    },
    {
      icon: CheckCircle,
      title: "Track & Achieve",
      description: "Manage study tasks and deadlines. Stay organized and never miss important assignments.",
      color: "text-accent"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">Zenith</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple 3-step workflow that transforms how you study and retain information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="flex items-center justify-center mb-6">
                  <div className={`p-6 bg-background rounded-2xl shadow-lg border border-border`}>
                    <step.icon className={`h-12 w-12 ${step.color}`} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-6 transform translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-4 bg-background rounded-2xl p-8 shadow-lg border border-border max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">40%</div>
              <div className="text-sm text-muted-foreground">Better Retention</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">60%</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">10x</div>
              <div className="text-sm text-muted-foreground">More Organized</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};