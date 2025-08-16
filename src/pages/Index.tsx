import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/homepage/Navigation';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeatureSection } from '@/components/homepage/FeatureSection';
import { WorkflowSection } from '@/components/homepage/WorkflowSection';
import { Footer } from '@/components/homepage/Footer';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Zenith...</p>
        </div>
      </div>
    );
  }

  // Show homepage for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <HeroSection />
        <FeatureSection />
        <WorkflowSection />
        <Footer />
      </div>
    );
  }

  // Show loading state while redirecting authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
