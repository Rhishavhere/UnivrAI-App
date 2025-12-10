import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px]" />

      <div className="text-center z-10 glass p-12 rounded-2xl border-white/5 shadow-2xl max-w-md w-full mx-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mb-2 text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Page not found</p>
        
        <Button asChild size="lg" className="rounded-full w-full">
            <a href="/" className="flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Return to Home
            </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
