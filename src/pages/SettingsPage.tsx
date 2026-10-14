import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { User, Shield, Monitor, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsPage: React.FC = () => {
  const { user, profile, logout, isMaster } = useAuth();

  const ep = profile?.employeeProfile;
  const employeeItems = ep
    ? [
        ...(ep.fullName ? [{ label: 'Full name', value: ep.fullName }] : []),
        ...(ep.contactNo ? [{ label: 'Contact no.', value: ep.contactNo }] : []),
        ...(ep.designation ? [{ label: 'Designation', value: ep.designation }] : []),
        ...(ep.bloodGroup ? [{ label: 'Blood group', value: ep.bloodGroup }] : []),
        ...(ep.address ? [{ label: 'Address', value: ep.address, multiline: true as const }] : []),
      ]
    : [];

  const settingsSections = [
    {
      id: 'account',
      title: 'Global Account',
      subtitle: 'Manage your primary identification and contact details',
      icon: User,
      color: 'text-brand-cyan bg-brand-info-bg',
      items: [
        { label: 'Display Name', value: profile?.displayName || 'Not Set' },
        { label: 'Email Address', value: profile?.email || 'N/A' },
        { label: 'Unique Identifier', value: profile?.uid?.slice(0, 12).toUpperCase() + '...', isMono: true },
        ...employeeItems,
      ],
    },
    {
      id: 'privacy',
      title: 'Security & Integrity',
      subtitle: 'Authentication protocols and data safety measures',
      icon: Shield,
      color: 'text-emerald-700 bg-emerald-500/15',
      items: [
        { label: 'Cloud Sync', value: 'Active' },
        { label: 'Verification Status', value: user?.emailVerified ? 'Verified' : 'Pending' },
        {
          label: 'Access Level',
          value: isMaster ? 'MASTER ADMIN (full control)' : (profile?.role ?? 'candidate').toUpperCase(),
        },
      ],
    },
    {
      id: 'system',
      title: 'Interface Customization',
      subtitle: 'Adjust the visual aesthetic of your workspace',
      icon: Monitor,
      color: 'text-brand-violet bg-brand-secondary-bg',
      items: [
        { label: 'Design system', value: 'YugamCloud.ai light' },
        { label: 'Regional Locality', value: 'Asia-Southeast1' },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-10 font-sans">
      <div className="flex items-end justify-between border-b border-windows-border pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-fg">Configuration</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Personal Workspace Preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-1 md:col-span-1">
          {['Account', 'Security', 'Notifications', 'System', 'Privacy'].map((item) => (
            <button
              key={item}
              className={cn(
                'w-full rounded-lg px-4 py-2.5 text-left text-sm font-bold transition-all',
                item === 'Account'
                  ? 'bg-brand-cyan font-bold text-brand-cta-text shadow-md'
                  : 'text-brand-fg-muted hover:bg-brand-surface-hover',
              )}
            >
              {item}
            </button>
          ))}
          <div className="pt-8">
            <button
              onClick={logout}
              className="group flex w-full items-center justify-between rounded-xl bg-red-500/10 px-4 py-3 text-red-400 transition-all hover:bg-red-500/15"
            >
              <div className="flex items-center space-x-3">
                <LogOut size={18} />
                <span className="text-sm font-bold uppercase tracking-tighter">Sign Out</span>
              </div>
              <ChevronRight size={14} className="opacity-40 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="space-y-8 md:col-span-3">
          {settingsSections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="windows-card p-8"
            >
              <div className="mb-8 flex items-start space-x-4">
                <div className={cn('rounded-2xl p-3 shadow-sm', section.color)}>
                  <section.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-fg">{section.title}</h3>
                  <p className="mt-0.5 text-xs font-medium text-brand-fg-muted">{section.subtitle}</p>
                </div>
              </div>

              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      '-mx-2 flex justify-between border-b border-windows-border px-2 py-4 transition-colors last:border-0 hover:bg-brand-surface-hover rounded-lg',
                      'multiline' in item && item.multiline ? 'items-start gap-4' : 'items-center',
                    )}
                  >
                    <span className="shrink-0 text-xs font-bold uppercase tracking-tighter text-brand-fg-muted">{item.label}</span>
                    <span
                      className={cn(
                        'text-sm font-semibold text-brand-fg',
                        'isMono' in item && item.isMono ? 'font-mono text-[11px]' : '',
                        'multiline' in item && item.multiline ? 'max-w-[70%] whitespace-pre-wrap text-right' : '',
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="rounded-2xl border-2 border-dashed border-windows-border p-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-fg-disabled">
              YugamCloud End-to-End Encryption Enabled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
