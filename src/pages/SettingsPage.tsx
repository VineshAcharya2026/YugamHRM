import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Shield, Bell, Monitor, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsPage: React.FC = () => {
  const { profile, logout } = useAuth();

  const settingsSections = [
    {
      id: 'account',
      title: 'Global Account',
      subtitle: 'Manage your primary identification and contact details',
      icon: User,
      color: 'text-windows-accent bg-windows-accent/10',
      items: [
        { label: 'Display Name', value: profile?.displayName || 'Not Set' },
        { label: 'Email Address', value: profile?.email || 'N/A' },
        { label: 'Unique Identifier', value: profile?.uid?.slice(0, 12).toUpperCase() + '...', isMono: true },
      ]
    },
    {
      id: 'privacy',
      title: 'Security & Integrity',
      subtitle: 'Authentication protocols and data safety measures',
      icon: Shield,
      color: 'text-green-600 bg-green-500/10',
      items: [
        { label: 'Cloud Sync', value: 'Active' },
        { label: 'Verification Status', value: profile?.emailVerified ? 'Verified' : 'Pending' },
        { label: 'Access Level', value: profile?.role?.toUpperCase() || 'STANDARD' },
      ]
    },
    {
      id: 'system',
      title: 'Interface Customization',
      subtitle: 'Adjust the visual aesthetic of your workspace',
      icon: Monitor,
      color: 'text-orange-600 bg-orange-500/10',
      items: [
        { label: 'Fluent Design System', value: 'Enabled (Mica)' },
        { label: 'Regional Locality', value: 'Asia-Southeast1' },
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 font-sans">
      <div className="flex justify-between items-end border-b border-black/5 pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">Configuration</h2>
          <p className="text-xs font-semibold text-windows-accent uppercase tracking-[0.2em] mt-1">Personal Workspace Preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar (Mini) */}
        <div className="md:col-span-1 space-y-1">
          {['Account', 'Security', 'Notifications', 'System', 'Privacy'].map((item) => (
            <button 
              key={item}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                item === 'Account' ? 'bg-windows-accent text-white shadow-md' : 'text-black/40 hover:bg-black/5'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-8">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <LogOut size={18} />
                <span className="text-sm font-bold uppercase tracking-tighter">Sign Out</span>
              </div>
              <ChevronRight size={14} className="opacity-40 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          {settingsSections.map((section, idx) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="windows-card p-8"
            >
              <div className="flex items-start space-x-4 mb-8">
                <div className={`p-3 rounded-2xl ${section.color} shadow-sm`}>
                  <section.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1f1f1f]">{section.title}</h3>
                  <p className="text-xs font-medium text-black/40 mt-0.5">{section.subtitle}</p>
                </div>
              </div>

              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-black/[0.03] last:border-0 hover:bg-black/[0.01] px-2 -mx-2 rounded-lg transition-colors">
                    <span className="text-xs font-bold text-black/60 uppercase tracking-tighter">{item.label}</span>
                    <span className={`text-sm font-semibold ${item.isMono ? 'font-mono text-[11px]' : ''} text-[#1f1f1f]`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          <div className="p-10 border-2 border-dashed border-black/5 rounded-2xl text-center">
            <p className="text-[10px] font-bold text-black/20 uppercase tracking-[0.3em]">YugamCloud End-to-End Encryption Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};
