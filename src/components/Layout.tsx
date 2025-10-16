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
    <div className="min-h-screen bg-transparent">
      {/* Header */}
        <div className='absolute flex justify-center items-center z-10 mt-8 ml-4'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground m-6 "
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className='flex gap-2 justify-center items-center' onClick={() => window.location.href = '/home'}>
            <p className='font-sans font-medium text-sm'>CMRIT</p>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={3}
              showBorder={false}
              className="custom-class"
            >
              NEXT
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
