import { motion } from 'motion/react';
import { TEMPLATES } from '../constants';
import { TemplateId } from '../types';
import { cn } from '../lib/utils';
import { Check, Layout as LayoutIcon } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (id: TemplateId) => void;
  current: TemplateId;
}

export default function TemplateSelector({ onSelect, current }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
      {TEMPLATES.map((t, index) => {
        // Generate a simple abstract layout representation based on ID
        const isSidebar = ['creative', 'ux-designer', 'cloud-architect', 'cyber-sec'].includes(t.id);
        const isExecutive = ['professional', 'product-exec', 'engineering-mgr', 'tech-writer'].includes(t.id);
        const accentColor = t.id.includes('dev') ? '#6366f1' : t.id.includes('cloud') ? '#0ea5e9' : t.id.includes('ai') ? '#8b5cf6' : '#0067b8';

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className={cn(
              "fluent-card group relative cursor-pointer overflow-hidden flex flex-col h-[320px] bg-white",
              current === t.id && "ring-2 ring-fluent-active ring-offset-2"
            )}
            onClick={() => onSelect(t.id)}
          >
            {/* Abstract Preview Area */}
            <div className="h-48 relative bg-slate-50 p-4 border-b border-fluent-border">
              <div className="w-full h-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden flex">
                {isSidebar ? (
                  <>
                    <div className="w-1/3 bg-slate-900 flex flex-col gap-2 p-2">
                      <div className="w-full h-2 bg-white/20 rounded-full" />
                      <div className="w-2/3 h-1 bg-white/10 rounded-full" />
                      <div className="mt-4 space-y-1">
                        <div className="w-full h-1 bg-white/10 rounded-full" />
                        <div className="w-full h-1 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 p-3 space-y-2">
                        <div className="w-1/3 h-2 bg-slate-100 rounded-full" />
                        <div className="space-y-1">
                            <div className="w-full h-1 bg-slate-50 rounded-full" />
                            <div className="w-full h-1 bg-slate-50 rounded-full" />
                        </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 p-3 space-y-4">
                    <div className="space-y-1 items-center flex flex-col">
                        <div className="w-1/2 h-3 bg-slate-100 rounded-full" />
                        <div className="w-1/4 h-1 bg-slate-50 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <div className="w-1/4 h-2 bg-slate-100 rounded-full" />
                        <div className="space-y-1">
                            <div className="w-full h-1 bg-slate-50 rounded-full" />
                            <div className="w-2/3 h-1 bg-slate-50 rounded-full" />
                        </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-fluent-active/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <LayoutIcon className="w-5 h-5 text-fluent-active" />
                  </div>
              </div>
            </div>

            {/* Label Area */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm tracking-tight text-slate-800 mb-1">{t.name}</h3>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    {isExecutive ? 'Executive Layout' : isSidebar ? 'Modern Sidebar' : 'Clean Minimalist'}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-fluent-active px-2 py-0.5 bg-blue-50 rounded">Tech Series</span>
                {current === t.id && <Check className="w-4 h-4 text-fluent-active" />}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
