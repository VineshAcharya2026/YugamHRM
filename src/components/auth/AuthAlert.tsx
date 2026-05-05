import type { AuthErrorDisplay } from '../../lib/authErrorMessage';
import { cn } from '../../lib/utils';

type Props = {
  error: AuthErrorDisplay;
};

const toneClass: Record<AuthErrorDisplay['tone'], string> = {
  setup: 'border-amber-500/40 bg-amber-500/10 text-amber-900',
  form: 'border-red-500/40 bg-red-500/10 text-red-900',
};

const summaryClass: Record<AuthErrorDisplay['tone'], string> = {
  setup: 'text-amber-800 hover:text-amber-950',
  form: 'text-red-800 hover:text-red-950',
};

export function AuthAlert({ error }: Props) {
  return (
    <div
      className={cn(
        'rounded-lg border p-3 text-xs shadow-sm',
        toneClass[error.tone],
        error.tone === 'form' && 'font-medium',
      )}
    >
      <p className="font-bold leading-snug">{error.title}</p>
      {error.detail ? (
        <p className={cn('mt-1.5 leading-relaxed', error.tone === 'setup' ? 'font-medium text-amber-800/95' : 'text-red-800/95')}>
          {error.detail}
        </p>
      ) : null}
      {error.primaryAction ? (
        <a
          href={error.primaryAction.href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            'mt-2 inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-bold text-brand-cta-text transition',
            error.tone === 'setup' ? 'bg-amber-500 hover:bg-amber-400' : 'bg-red-500 hover:bg-red-400',
          )}
        >
          {error.primaryAction.label} ↗
        </a>
      ) : null}
      {error.advancedLinks && error.advancedLinks.length > 0 ? (
        <details className={cn('mt-2 border-t pt-2', error.tone === 'setup' ? 'border-amber-500/30' : 'border-red-500/30')}>
          <summary className={cn('cursor-pointer text-[11px] font-bold', summaryClass[error.tone])}>
            More: APIs &amp; domain checklist
          </summary>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11px] font-medium text-brand-fg-muted">
            {error.advancedLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className="font-semibold text-brand-cyan hover:underline">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
