"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { renderFrame } from "@/lib/engine/render";
import {
  calloutsAt,
  FPS,
  formatTime,
  LAST_FRAME,
  SEGMENTS,
  segmentAt,
} from "@/lib/engine/timeline";

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type EnginePlayerProps = {
  displayFamily: string;
  monoFamily: string;
};

export function EnginePlayer({ displayFamily, monoFamily }: EnginePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const playingRef = useRef(false);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [canvasError, setCanvasError] = useState(false);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCanvasError(true);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const bufferW = Math.round(width * dpr);
    const bufferH = Math.round(height * dpr);
    if (canvas.width !== bufferW || canvas.height !== bufferH) {
      canvas.width = bufferW;
      canvas.height = bufferH;
    }
    renderFrame(ctx, frameRef.current, width, height, dpr);
  }, []);

  useEffect(() => {
    frameRef.current = frame;
    paint();
  }, [frame, paint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => paint());
    observer.observe(canvas);
    const fontsReady = document.fonts?.ready.then(() => paint());
    return () => {
      observer.disconnect();
      void fontsReady;
    };
  }, [paint]);

  useEffect(() => {
    let accumulator = 0;
    let last = performance.now();
    let raf = 0;
    let autoplayDecided = false;
    const loop = (now: number) => {
      if (!autoplayDecided) {
        const requested = Number(new URLSearchParams(window.location.search).get("frame"));
        if (Number.isFinite(requested)) {
          const next = Math.min(LAST_FRAME, Math.max(0, Math.round(requested)));
          autoplayDecided = true;
          playingRef.current = false;
          frameRef.current = next;
          setFrame(next);
          raf = requestAnimationFrame(loop);
          return;
        }
      }
      if (!playingRef.current && !autoplayDecided && !getReducedMotion()) {
        autoplayDecided = true;
        playingRef.current = true;
        setPlaying(true);
      } else if (!autoplayDecided) {
        autoplayDecided = true;
      }
      const delta = Math.min(64, now - last);
      last = now;
      if (playingRef.current) {
        accumulator += delta;
        const stepMs = 1000 / FPS;
        const steps = Math.floor(accumulator / stepMs);
        if (steps > 0) {
          accumulator -= steps * stepMs;
          const next = Math.min(LAST_FRAME, frameRef.current + steps);
          if (next !== frameRef.current) {
            frameRef.current = next;
            setFrame(next);
          }
          if (next >= LAST_FRAME) {
            playingRef.current = false;
            setPlaying(false);
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seek = (next: number) => {
    const clamped = Math.min(LAST_FRAME, Math.max(0, Math.round(next)));
    frameRef.current = clamped;
    setFrame(clamped);
  };

  const pause = () => {
    playingRef.current = false;
    setPlaying(false);
  };

  const play = () => {
    if (frameRef.current >= LAST_FRAME) seek(0);
    playingRef.current = true;
    setPlaying(true);
  };

  const toggle = () => {
    if (playingRef.current) pause();
    else play();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, [data-slot=slider]")) return;
    if (event.key === " " || event.key === "k") {
      event.preventDefault();
      toggle();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      pause();
      seek(frameRef.current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      pause();
      seek(frameRef.current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      pause();
      seek(0);
    } else if (event.key === "End") {
      event.preventDefault();
      pause();
      seek(LAST_FRAME);
    }
  };

  const segment = segmentAt(frame);
  const callouts = calloutsAt(frame);
  const atEnd = frame >= LAST_FRAME && !playing;

  return (
    <section
      tabIndex={0}
      className="stage-shell rounded-xl outline-none focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#00E5FF]"
      onKeyDown={onKeyDown}
      aria-label="Full-flow engine player. Click the film, then use space to play and the arrow keys to step."
    >
      <p className="sr-only" aria-live="polite">
        {segmentAt(frame).title}
      </p>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#344257] bg-[#0B1019]">
        <canvas
          ref={canvasRef}
          data-display={displayFamily}
          data-mono={monoFamily}
          className="h-full w-full"
          role="img"
          aria-label={`${segment.title}, ${formatTime(frame)}. ${segment.caption}`}
        />
        {canvasError ? (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-[#E7EEF6]">
            This browser did not provide a canvas. The shot-by-shot transcript below still describes the model.
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {SEGMENTS.map((item) => {
            const active = item.id === segment.id;
            return (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={active ? "default" : "outline"}
                aria-pressed={active}
                onClick={() => seek(item.from)}
              >
                {item.clock} {item.title.split(",")[0]}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={toggle}>
            {playing ? "Pause" : atEnd ? "Replay" : "Play"}
          </Button>
          <Button type="button" variant="outline" onClick={() => { pause(); seek(frame - 1); }}>
            Back one frame
          </Button>
          <Button type="button" variant="outline" onClick={() => { pause(); seek(frame + 1); }}>
            Forward one frame
          </Button>
          <Button type="button" variant="outline" onClick={() => { pause(); seek(0); }}>
            Restart
          </Button>
          <p className="ml-auto font-mono text-xs text-[#9AA8BA]">
            {formatTime(frame)} · frame {frame} / {LAST_FRAME}
            {reduced ? " · motion reduced, paused until you play" : ""}
          </p>
        </div>

        <Slider
          aria-label="Frame"
          min={0}
          max={LAST_FRAME}
          step={1}
          value={[frame]}
          onValueChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value;
            pause();
            if (typeof next === "number") seek(next);
          }}
        />

        <p className="text-sm leading-6 text-[#C5D0DE]">{segment.caption}</p>
        <ul className="flex flex-col gap-1">
          {callouts.map((callout) => (
            <li key={callout.kicker} className="text-sm leading-6 text-[#E7EEF6]">
              <span className="font-mono text-[11px] tracking-wide text-[#FFD166] uppercase">
                {callout.kicker}.
              </span>{" "}
              {callout.text}
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-2 gap-2 text-xs text-[#9AA8BA] sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#344257]" />
            Hardware
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />
            Primary pathway
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FFD166]" />
            Actuation or energy
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#9D4EDD]" />
            State change
          </div>
        </dl>
        <p className="text-xs leading-5 text-[#9AA8BA]">
          Space or K plays and pauses. Arrow keys step one frame. The accent colors are explanatory overlays, not emission from the hardware.
        </p>
      </div>
    </section>
  );
}
