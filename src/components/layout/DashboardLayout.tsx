import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  FileText, 
  Settings, 
  LogOut, 
  Users, 
  BarChart3, 
  Menu, 
  X,
  Plus,
  Shield,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  id: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Resume Builder', icon: FileText, id: 'resume', roles: ['candidate'] },
  { label: 'My Files', icon: Plus, id: 'documents', roles: ['candidate', 'alumnus'] },
  { label: 'Candidate Tracker', icon: ClipboardList, id: 'tracker', roles: ['admin'] },
  { label: 'Candidate List', icon: Users, id: 'search', roles: ['admin'] },
  { label: 'Reports', icon: BarChart3, id: 'reports', roles: ['admin'] },
  { label: 'Settings', icon: Settings, id: 'settings' },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode, activeTab: string, onTabChange: (id: string) => void }> = ({ children, activeTab, onTabChange }) => {
  const { profile, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(profile?.role || 'candidate')
  );

  return (
    <div className="flex h-screen bg-windows-bg overflow-hidden font-sans">
      {/* Sidebar - Mica styled */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="mica-bg flex flex-col z-40 fixed lg:relative h-full select-none shadow-xl lg:shadow-none"
          >
            <div className="p-6 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-windows-accent flex items-center justify-center text-white shadow-lg">
                  <LayoutDashboard size={18} />
                </div>
                <div className="font-semibold text-sm tracking-tight text-[#1f1f1f]">
                  YugamCloud <span className="font-normal opacity-50">HRM</span>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="lg:hidden p-1.5 rounded-md hover:bg-black/5 text-[#1f1f1f]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {filteredNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-all duration-150 relative group",
                    activeTab === item.id 
                      ? "bg-white shadow-sm border border-black/5 font-medium" 
                      : "text-black/70 hover:bg-black/5"
                  )}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 w-1 h-4 bg-windows-accent rounded-full -translate-x-0.5" />
                  )}
                  <item.icon size={18} className={cn(activeTab === item.id ? "text-windows-accent" : "opacity-70")} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 bg-black/[0.02]">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer mb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-windows-accent to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white">
                  {profile?.displayName?.[0] || profile?.email?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{profile?.displayName || 'User'}</p>
                  <p className="text-[10px] opacity-50 truncate font-medium uppercase tracking-wider">{profile?.role}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-xs font-medium text-black/60 rounded-md hover:bg-red-50 hover:text-red-600 transition-all font-sans"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 bg-windows-bg/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 rounded-md hover:bg-black/5 transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-sm font-semibold text-black/80">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
             <div className="text-[10px] font-semibold bg-white px-3 py-1 rounded-full border border-black/5 shadow-sm text-green-600 flex items-center">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
               System Online
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-black/10">
          <div className="p-8 md:p-12 max-w-7xl mx-auto pb-32">
            {children}
          </div>
        </main>

        {/* Windows-style Status Bar */}
        <footer className="h-6 bg-windows-accent text-white/90 flex items-center justify-between px-4 text-[9px] font-bold select-none">
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-1.5 cursor-default">
               <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
               <span>CONNECTED: Asia-Southeast1 (GCP)</span>
             </div>
             <div className="h-3 w-px bg-white/20" />
             <div className="opacity-70">SESSION: {profile?.uid?.slice(0, 16).toUpperCase()}</div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="opacity-70">YUGAMCLOUD_CORE_v2.4.0</div>
             <div className="h-3 w-px bg-white/20" />
             <div className="flex items-center space-x-1">
               <Shield size={10} />
               <span>Secure Connection</span>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
