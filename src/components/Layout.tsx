import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './Sidebar';
import GradientText  from './GradientText';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background Elements - Optional but adds depth */}
      <div className="fixed top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
        <div className='absolute top-6 left-6 z-30 flex items-center gap-4'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="glass hover:bg-white/10 text-foreground h-12 w-12 rounded-full transition-all duration-300 hover:scale-105"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div 
            className='glass px-6 py-2 rounded-full flex gap-3 items-center cursor-pointer transition-all duration-300 hover:bg-white/5 active:scale-95' 
            onClick={() => window.location.href = '/home'}
          >
            <p className='font-outfit font-bold text-sm tracking-wider text-muted-foreground'>SMART</p>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <GradientText
              colors={["#a78bfa", "#2dd4bf", "#a78bfa", "#2dd4bf", "#a78bfa"]}
              animationSpeed={4}
              showBorder={false}
              className="font-bold tracking-tight"
            >
              CAMPUS AI
            </GradientText>
          </div>
        </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className=" min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
