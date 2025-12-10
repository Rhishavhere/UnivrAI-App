import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2, ArrowRight } from 'lucide-react';
import RotatingText from '@/components/RotatingText';
import Aurora from '@/components/Aurora';

const Login: React.FC = () => {
  const [usn, setUsn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, student } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(usn, password);

    if (success) {
      toast({
        title: 'Access Granted',
        description: `Welcome back, ${student?.name || 'Scholar'}`,
      });
      navigate('/home');
    } else {
      toast({
        title: 'Access Denied',
        description: 'Invalid credentials. Please verify your USN and password.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#264EE0", "#180F2E", "#7a26e0"]}
          blend={0.6}
          amplitude={0.8}
          speed={0.5}
        />
      </div>

      {/* Decorative Orbs/Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '-2s' }} />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-md p-8 glass rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 m-4 transition-all duration-500 hover:shadow-[0_0_40px_rgba(var(--primary),0.3)]">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/80 to-accent/80 mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform duration-300">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white text-glow">
            Voice Campus Pal
          </h1>
          
          <div className="h-12 flex items-center justify-center">
             <RotatingText
              texts={['Intelligent Assistance', 'Voice-First Interaction', 'Campus Navigation']}
              mainClassName="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-medium text-lg"
              staggerFrom={"last"}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              staggerDuration={0.05}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <Label htmlFor="usn" className="text-muted-foreground group-focus-within:text-primary transition-colors">
              University Serial Number (USN)
            </Label>
            <Input
              id="usn"
              type="text"
              placeholder="1CR..."
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              required
              className="bg-black/20 border-white/5 focus:border-primary/50 text-white placeholder:text-white/20 h-12"
            />
          </div>

          <div className="space-y-2 group">
            <Label htmlFor="password" className="text-muted-foreground group-focus-within:text-primary transition-colors">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-black/20 border-white/5 focus:border-primary/50 text-white placeholder:text-white/20 h-12"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-medium bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-voice-glow mt-4 group"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Enter Campus
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/60">
            Powered by Gemini AI • CMR Institute of Technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
