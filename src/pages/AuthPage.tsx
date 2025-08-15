import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Brain, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signUp(email, password);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Check your email",
        description: "We sent you a confirmation link to get started."
      });
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Sign in failed", 
        description: error.message,
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-lg bg-gradient-subtle">
      <div className="w-full max-w-md space-y-lg">
        {/* Hero Section */}
        <div className="text-center space-y-md">
          <div className="flex justify-center">
            <div className="bg-gradient-primary p-md rounded-lg shadow-glow">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold font-heading text-foreground">
            Welcome to Zenith
          </h1>
          <p className="text-muted-foreground">
            Your study workflow companion for notes, tasks, and spaced repetition
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-sm text-center">
          <div className="space-y-xs">
            <div className="bg-primary/10 p-sm rounded-lg">
              <BookOpen className="w-5 h-5 text-primary mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">Rich Notes</p>
          </div>
          <div className="space-y-xs">
            <div className="bg-secondary/10 p-sm rounded-lg">
              <Target className="w-5 h-5 text-secondary mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">Task Focus</p>
          </div>
          <div className="space-y-xs">
            <div className="bg-accent/10 p-sm rounded-lg">
              <Brain className="w-5 h-5 text-accent mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">Smart Review</p>
          </div>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-heading">Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-md">
                <form onSubmit={handleSignIn} className="space-y-md">
                  <div className="space-y-xs">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-xs">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-md">
                <form onSubmit={handleSignUp} className="space-y-md">
                  <div className="space-y-xs">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-xs">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Ready to transform your study workflow?</p>
        </div>
      </div>
    </div>
  );
}