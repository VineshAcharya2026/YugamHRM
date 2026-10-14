import React from 'react';

type Props = {
  className?: string;
  /** Preload more eagerly when the mark is above the fold. */
  priority?: boolean;
};

function mediaUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${file}`.replace(/\/{2,}/g, '/');
}

export const SiteBrandMark: React.FC<Props> = ({ className = 'h-10 w-auto max-w-[220px]', priority }) => {
  return (
    <img
      src={mediaUrl('softivox-logo.jpg')}
      alt="Softivox Tech — Your Vision, Our Innovation."
      width={640}
      height={140}
      className={`block shrink-0 object-contain object-left ${className}`}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
};
