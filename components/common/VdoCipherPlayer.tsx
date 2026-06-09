'use client';

import { useEffect, useRef } from 'react';

interface VdoCipherPlayerProps {
  otp: string;
  playbackInfo: string;
  className?: string;
  onEnded?: () => void;
}

declare global {
  interface Window {
    VdoPlayer: any;
  }
}

export default function VdoCipherPlayer({ otp, playbackInfo, className, onEnded }: VdoCipherPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef    = useRef<any>(null);

  useEffect(() => {
    if (!otp || !playbackInfo || !containerRef.current) return;

    const initPlayer = () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = ''; // clear previous instance

      playerRef.current = new window.VdoPlayer({
        otp,
        playbackInfo,
        container: containerRef.current,
        plugins: [{ name: 'keyboard' }],
        // Disable right-click save, picture-in-picture, casting
        configuration: {
          // These settings prevent most easy download attempts
          allowNativeControls: false,
        },
      });

      if (onEnded) {
        playerRef.current.addEventListener('ended', onEnded);
      }
    };

    // Load VdoCipher player script if not already loaded
    if (window.VdoPlayer) {
      initPlayer();
    } else {
      const existing = document.querySelector('script[data-vdo]');
      if (!existing) {
        const script  = document.createElement('script');
        script.src    = 'https://player.vdocipher.com/playerAssets/1.x.x/vdo.js';
        script.setAttribute('data-vdo', 'true');
        script.onload = initPlayer;
        document.head.appendChild(script);
      } else {
        // Script already loading — wait for it
        existing.addEventListener('load', initPlayer);
      }
    }

    return () => {
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy(); } catch { /* ignore */ }
      }
    };
  }, [otp, playbackInfo]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '1rem', overflow: 'hidden' }}
    />
  );
}
