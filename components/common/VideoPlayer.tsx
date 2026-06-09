'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onPause?: () => void;
  className?: string;
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VideoPlayer({
  src,
  onTimeUpdate,
  onEnded,
  onPause,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hlsRef = useRef<Hls | null>(null);
  // Stable refs so event-listener closures always call the latest prop callbacks
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);
  const onPauseRef = useRef(onPause);
  useEffect(() => { onTimeUpdateRef.current = onTimeUpdate; }, [onTimeUpdate]);
  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);
  useEffect(() => { onPauseRef.current = onPause; }, [onPause]);

  // ── Attach all video events directly (MSE events don't bubble to React) ──
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      onTimeUpdateRef.current?.(v.currentTime);
      if (v.buffered.length > 0 && isFinite(v.duration) && v.duration > 0) {
        setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
      }
    };
    const onDurationChange = () => {
      if (isFinite(v.duration) && v.duration > 0) setDuration(v.duration);
    };
    const onCanPlay = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onPlay = () => setPlaying(true);
    const onPause = () => { setPlaying(false); onPauseRef.current?.(); };
    const onEnded = () => { setPlaying(false); setShowControls(true); onEndedRef.current?.(); };

    const onError = () => {
      const err = v.error;
      console.error('Video error:', err?.code, err?.message, v.src);
      setLoading(false);
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('durationchange', onDurationChange);
    v.addEventListener('loadedmetadata', onDurationChange);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    v.addEventListener('error', onError);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('durationchange', onDurationChange);
      v.removeEventListener('loadedmetadata', onDurationChange);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('error', onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── HLS / src setup ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);

    // Detect HLS by extension or content type hint in URL
    const isHls = /\.m3u8(\?|$)/i.test(src) || src.includes('index.m3u8');

    if (isHls && Hls.isSupported()) {
      // If the HLS manifest is served from our own backend (/stream/hls/...)
      // the token is already baked into the URL query string — no extra headers needed.
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false, startLevel: -1 });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (isFinite(video.duration) && video.duration > 0) setDuration(video.duration);
      });
      hls.on(Hls.Events.LEVEL_LOADED, (_e, data) => {
        const dur = data.details?.totalduration;
        if (dur && isFinite(dur) && dur > 0) setDuration(dur);
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) { setLoading(false); }
      });
    } else if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari — native HLS
      video.src = src;
    } else {
      // Direct MP4 / WebM
      video.src = src;
      video.load();
    }

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    };
  }, [src]);

  // ── Auto-hide controls ──────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, []);


  // ── Controls ───────────────────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      resetHideTimer();
    } else {
      v.pause();
      setPlaying(false);
      setShowControls(true);
      onPause?.();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const v = videoRef.current;
    if (!bar || !v || !isFinite(v.duration) || v.duration === 0) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    setMuted(next);
    v.muted = next;
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement) &&
          document.activeElement !== document.body) return;
      const v = videoRef.current;
      if (!v) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowRight') { v.currentTime = Math.min(v.duration, v.currentTime + 10); }
      if (e.code === 'ArrowLeft') { v.currentTime = Math.max(0, v.currentTime - 10); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playing]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-black rounded-2xl overflow-hidden group select-none', className)}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Video element — all events attached directly in useEffect (MSE-safe) */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        onKeyDown={(e) => { if (e.ctrlKey && e.key === 's') e.preventDefault(); }}
      />

      {/* Buffering spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}

      {/* Click-to-play overlay */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
        style={{ bottom: '64px' }}
      />

      {/* Big play button when paused */}
      {!playing && !loading && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ bottom: '64px' }}
        >
          <div className="bg-black/50 rounded-full p-5 backdrop-blur-sm">
            <Play className="h-10 w-10 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 transition-opacity duration-300',
          'bg-gradient-to-t from-black/80 to-transparent',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-1.5 bg-white/30 rounded-full mb-3 cursor-pointer relative group/bar"
          onClick={handleSeek}
        >
          {/* Buffered */}
          <div
            className="absolute inset-y-0 left-0 bg-white/20 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          {/* Played */}
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-primary transition-colors"
          >
            {playing
              ? <Pause className="h-5 w-5 fill-white" />
              : <Play className="h-5 w-5 fill-white" />}
          </button>

          {/* Volume */}
          <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
            {muted || volume === 0
              ? <VolumeX className="h-5 w-5" />
              : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="w-20 h-1 accent-primary cursor-pointer"
          />

          {/* Time */}
          <span className="text-white text-xs ml-1 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
            {isFullscreen
              ? <Minimize className="h-5 w-5" />
              : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
