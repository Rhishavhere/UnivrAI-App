import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, Map, User, LogOut, X , MessageSquare} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { student, logout } = useAuth();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/info', icon: Info, label: 'Info' },
    { path: '/tour', icon: Map, label: 'Tour' },
    { path: '/you', icon: User, label: 'You' },
  ];


  

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
    
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Flexible Glass Panel */}
      <aside
        className={`fixed top-4 bottom-4 left-4 w-72 glass rounded-2xl z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tighter">
                CMRIT
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-foreground/80 hover:bg-white/10 hover:text-foreground rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {student && (
              <div className="glass p-4 rounded-xl">
                <p className="font-semibold text-foreground text-lg">{student.name}</p>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mt-1">{student.usn}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium tracking-wide">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-xl py-6"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
