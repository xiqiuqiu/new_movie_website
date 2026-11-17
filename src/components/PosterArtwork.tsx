import { useState } from 'react';
import { Film } from 'lucide-react';
import type { MediaItem } from '../types/media';

interface PosterArtworkProps {
  item: MediaItem;
  variant?: 'poster' | 'landscape';
  className?: string;
}

function MotifSvg({ motif, accent }: { motif: MediaItem['posterTheme']['motif']; accent: string }) {
  switch (motif) {
    case 'aperture':
      return (
        <svg viewBox="0 0 200 260" className="h-full w-full opacity-35" aria-hidden="true">
          <circle cx="100" cy="112" r="56" fill="none" stroke={accent} strokeWidth="1.2" />
          <circle cx="100" cy="112" r="34" fill="none" stroke={accent} strokeWidth="0.9" strokeDasharray="3 4" />
          <line x1="100" y1="24" x2="100" y2="200" stroke={accent} strokeWidth="0.6" opacity="0.5" />
          <line x1="24" y1="112" x2="176" y2="112" stroke={accent} strokeWidth="0.6" opacity="0.5" />
        </svg>
      );
    case 'monolith':
      return (
        <svg viewBox="0 0 200 260" className="h-full w-full opacity-35" aria-hidden="true">
          <rect x="74" y="42" width="52" height="148" fill="none" stroke={accent} strokeWidth="1.2" />
          <line x1="20" y1="190" x2="180" y2="190" stroke={accent} strokeWidth="1" />
          <circle cx="145" cy="56" r="14" fill={accent} fillOpacity="0.22" />
        </svg>
      );
    case 'waves':
      return (
        <svg viewBox="0 0 200 260" className="h-full w-full opacity-35" aria-hidden="true">
          <path d="M16 142 Q 60 112 100 142 T 184 142" fill="none" stroke={accent} strokeWidth="1.2" />
          <path d="M16 164 Q 60 134 100 164 T 184 164" fill="none" stroke={accent} strokeWidth="1" opacity="0.7" />
          <path d="M16 186 Q 60 156 100 186 T 184 186" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.45" />
          <circle cx="136" cy="76" r="24" fill="none" stroke={accent} strokeWidth="1" />
        </svg>
      );
    case 'split':
      return (
        <svg viewBox="0 0 200 260" className="h-full w-full opacity-35" aria-hidden="true">
          <line x1="152" y1="22" x2="48" y2="238" stroke={accent} strokeWidth="1.4" />
          <rect x="28" y="34" width="144" height="192" fill="none" stroke={accent} strokeWidth="0.75" opacity="0.55" />
        </svg>
      );
    case 'grid':
      return (
        <svg viewBox="0 0 200 260" className="h-full w-full opacity-30" aria-hidden="true">
          <rect x="30" y="36" width="140" height="188" fill="none" stroke={accent} strokeWidth="1" />
          <line x1="30" y1="98" x2="170" y2="98" stroke={accent} strokeWidth="0.7" />
          <line x1="30" y1="160" x2="170" y2="160" stroke={accent} strokeWidth="0.7" />
          <line x1="100" y1="36" x2="100" y2="224" stroke={accent} strokeWidth="0.7" />
        </svg>
      );
    case 'frame':
    default:
      return (
        <svg viewBox="0 0 200 260" className="h-full w-full opacity-35" aria-hidden="true">
          <rect x="24" y="28" width="152" height="204" fill="none" stroke={accent} strokeWidth="1.2" />
          <rect x="36" y="40" width="128" height="140" fill="none" stroke={accent} strokeWidth="0.7" opacity="0.65" />
        </svg>
      );
  }
}

export function PosterArtwork({ item, variant = 'poster', className = '' }: PosterArtworkProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const imageSrc = variant === 'landscape' ? item.backdropImage ?? item.posterImage : item.posterImage;
  const showImage = Boolean(imageSrc) && !imgFailed;

  if (showImage) {
    return (
      <div className={`relative overflow-hidden bg-[#14161D] ${className}`}>
        <img
          src={imageSrc}
          alt={item.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden p-4 select-none ${className}`}
      style={{
        background: `linear-gradient(155deg, ${item.posterTheme.bgFrom} 0%, ${item.posterTheme.bgTo} 100%)`,
      }}
    >
      <div className="cinema-grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <MotifSvg motif={item.posterTheme.motif} accent={item.posterTheme.accent} />
      </div>
      <div className="relative z-10 flex items-center justify-between text-[10px] tracking-[0.14em] uppercase text-white/65">
        <span className="truncate font-mono-tabular">{item.year}</span>
        <Film className="h-3.5 w-3.5 opacity-60 shrink-0" aria-hidden="true" />
      </div>
      <div className="relative z-10 mt-auto">
        <p className="font-mono-tabular text-[10px] tracking-[0.12em] uppercase text-amber-200/75 truncate">
          {item.posterTheme.subtitleEn}
        </p>
        <p className="font-display mt-1 text-lg sm:text-xl font-semibold leading-tight text-[#F4F2ED] line-clamp-2">
          {item.title}
        </p>
        <p className="mt-1.5 text-[11px] text-white/60 truncate">
          {item.directorOrHost}
        </p>
      </div>
    </div>
  );
}
