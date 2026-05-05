'use client';

type Props = {
  className?: string;
  /** When true, video preloads sooner (header / above-the-fold). */
  priority?: boolean;
};

/**
 * Animated wordmark from `public/nknknknknk.mp4`.
 * Sizing comes from `className` (e.g. `h-12 w-auto max-w-[...]` in the navbar).
 */
export function SiteBrandMark({ className = 'h-10 w-auto max-w-[240px]', priority }: Props) {
  return (
    <video
      className={`block shrink-0 object-contain object-left ${className}`}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={priority ? 'auto' : 'metadata'}
      poster="/yugamhrm.png"
      aria-hidden
    >
      <source src="/nknknknknk.mp4" type="video/mp4" />
    </video>
  );
}
