import { motion } from 'motion/react';
import { TEMPLATES } from './constants';
import type { TemplateId } from './types';
import { cn } from '../../../lib/utils';
import { Check, Layout as LayoutIcon } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (id: TemplateId) => void;
  current: TemplateId;
}

export default function TemplateSelector({ onSelect, current }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {TEMPLATES.map((t, index) => {
        const isSidebar = ['creative', 'ux-designer', 'cloud-architect', 'cyber-sec'].includes(t.id);
        const isExecutive = ['professional', 'product-exec', 'engineering-mgr', 'tech-writer'].includes(t.id);

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className={cn(
              'fluent-card group relative flex h-[320px] cursor-pointer flex-col overflow-hidden bg-brand-surface',
              current === t.id && 'ring-2 ring-brand-cyan ring-offset-2 ring-offset-brand-page',
            )}
            onClick={() => onSelect(t.id)}
          >
            <div className="relative h-48 border-b border-fluent-border bg-brand-panel p-4">
              <div className="flex h-full w-full overflow-hidden rounded-sm bg-brand-page shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                {isSidebar ? (
                  <>
                    <div className="flex w-1/3 flex-col gap-2 bg-brand-panel p-2">
                      <div className="h-2 w-full rounded-full bg-brand-cyan/30" />
                      <div className="h-1 w-2/3 rounded-full bg-windows-border" />
                      <div className="mt-4 space-y-1">
                        <div className="h-1 w-full rounded-full bg-windows-border" />
                        <div className="h-1 w-full rounded-full bg-windows-border" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 p-3">
                      <div className="h-2 w-1/3 rounded-full bg-brand-surface-hover" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded-full bg-brand-surface-hover" />
                        <div className="h-1 w-full rounded-full bg-brand-surface-hover" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 space-y-4 p-3">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="h-3 w-1/2 rounded-full bg-brand-surface-hover" />
                      <div className="h-1 w-1/4 rounded-full bg-windows-border" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-1/4 rounded-full bg-brand-surface-hover" />
                      <div className="space-y-1">
                        <div className="h-1 w-full rounded-full bg-brand-surface-hover" />
                        <div className="h-1 w-2/3 rounded-full bg-brand-surface-hover" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-brand-cyan/10 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="translate-y-4 transform rounded-full bg-brand-surface p-2 shadow-lg transition-transform group-hover:translate-y-0">
                  <LayoutIcon className="h-5 w-5 text-brand-cyan" />
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h3 className="mb-1 text-sm font-bold tracking-tight text-brand-fg">{t.name}</h3>
                <p className="text-[10px] font-medium uppercase tracking-wider text-brand-fg-muted">
                  {isExecutive ? 'Executive Layout' : isSidebar ? 'Modern Sidebar' : 'Clean Minimalist'}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-brand-info-bg px-2 py-0.5 text-[10px] font-bold text-brand-cyan">Tech Series</span>
                {current === t.id && <Check className="h-4 w-4 text-brand-cyan" />}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
