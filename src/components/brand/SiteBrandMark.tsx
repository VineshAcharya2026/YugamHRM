import React from 'react';

type Props = {
  className?: string;
  /** Preload more eagerly when above the fold (e.g. auth header). */
  priority?: boolean;
};

function mediaUrl(file: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${file}`.replace(/\/{2,}/g, '/');
}

/**
 * Animated wordmark (`public/nknknknknk.mp4`).
 * Paths respect Vite `base` (e.g. `/hrm/`).
 */
export const SiteBrandMark: React.FC<Props> = ({ className = 'h-10 w-auto max-w-[200px]', priority }) => {
  return (
    <video
      className={`block shrink-0 object-contain object-left ${className}`}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={priority ? 'auto' : 'metadata'}
      poster={mediaUrl('yugamhrm.png')}
      aria-hidden
    >
      <source src={mediaUrl('nknknknknk.mp4')} type="video/mp4" />
    </video>
  );
};
