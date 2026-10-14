import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Preload more eagerly when the mark is above the fold. */
  priority?: boolean;
  /** Kept so existing callers compile. The logo is a fixed artwork. */
  tone?: 'ink' | 'paper';
};

export function SiteBrandMark({ className = '', priority }: Props) {
  return (
    <img
      src="/softivox-logo.jpg"
      alt="Softivox Tech — Your Vision, Our Innovation."
      width={640}
      height={140}
      className={cn('h-14 w-auto max-w-full object-contain object-left', className)}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}
