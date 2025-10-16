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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CMRIT
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {student && (
              <div className="text-sm">
                <p className="font-medium text-sidebar-foreground">{student.name}</p>
                <p className="text-muted-foreground text-xs">{student.usn}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
