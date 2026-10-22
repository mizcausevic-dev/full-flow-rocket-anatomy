"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play, RotateCcw } from "lucide-react";
import { drawScene } from "@/lib/draw";
import {
  CHAPTERS,
  FPS,
  LAST_FRAME,
  chapterAt,
  durationLabel,
  stateAt,
  timecode,
  type ChapterId,
} from "@/lib/timeline";
import { Button } from "@/components/ui/button";

export function Player() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const playingRef = useRef(false);
  const anchorRef = useRef({ wall: 0, frame: 0 });
  const reducedRef = useRef(false);
  const controlRef = useRef<{ seek: (next: number, keepPlaying: boolean) => void; toggle: () => void } | null>(
    null,
  );
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
    };
    apply();
    media.addEventListener("change", apply);
    const fonts = getComputedStyle(document.body);
    const fontFamily = fonts.fontFamily || "sans-serif";
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--mono-stack").trim() || "monospace";

    const paint = (next: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawScene(canvas, stateAt(next), {
        reducedMotion: reducedRef.current,
        fontFamily,
        monoFamily: mono,
      });
    };

    const seek = (next: number, keepPlaying: boolean) => {
      const clamped = Math.max(0, Math.min(LAST_FRAME, next));
      frameRef.current = clamped;
      anchorRef.current = { wall: performance.now(), frame: clamped };
      playingRef.current = keepPlaying;
      setFrame(clamped);
      setPlaying(keepPlaying);
      paint(clamped);
    };

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.code === "Space") {
        event.preventDefault();
        toggle();
      } else if (event.code === "ArrowRight") {
        seek(frameRef.current + (event.shiftKey ? FPS : 1), false);
      } else if (event.code === "ArrowLeft") {
        seek(frameRef.current - (event.shiftKey ? FPS : 1), false);
      } else if (event.code === "Home") {
        seek(0, false);
      } else if (event.code === "End") {
        seek(LAST_FRAME, false);
      }
    };

    const toggle = () => {
      if (playingRef.current) {
        playingRef.current = false;
        setPlaying(false);
        return;
      }
      if (frameRef.current >= LAST_FRAME) seek(0, true);
      playingRef.current = true;
      anchorRef.current = { wall: performance.now(), frame: frameRef.current };
      setPlaying(true);
    };

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const observer = new ResizeObserver(() => paint(frameRef.current));
    if (parent) observer.observe(parent);
    if (canvas) observer.observe(canvas);

    let raf = 0;
    const loop = (now: number) => {
      const current = canvasRef.current;
      if (current) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = Math.floor(current.clientWidth * dpr);
        const targetH = Math.floor(current.clientHeight * dpr);
        if (targetW > 2 && (current.width !== targetW || current.height !== targetH)) {
          paint(frameRef.current);
        }
      }
      if (playingRef.current) {
        const elapsed = now - anchorRef.current.wall;
        const next = anchorRef.current.frame + Math.floor((elapsed * FPS) / 1000);
        if (next >= LAST_FRAME) {
          frameRef.current = LAST_FRAME;
          playingRef.current = false;
          setPlaying(false);
          setFrame(LAST_FRAME);
          paint(LAST_FRAME);
        } else if (next !== frameRef.current) {
          frameRef.current = next;
          setFrame(next);
          paint(next);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    paint(0);
    if (!media.matches) {
      playingRef.current = true;
      anchorRef.current = { wall: performance.now(), frame: 0 };
      requestAnimationFrame(() => setPlaying(true));
    }
    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(loop);

    controlRef.current = { seek, toggle };

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", apply);
    };
  }, []);

  const state = stateAt(frame);
  const chapterId: ChapterId = state.chapter.id;

  return (
    <div className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto] bg-[#0B1019] text-[#E8EEF6] md:h-dvh md:overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-[#93A0B5]">AEROSPACE · METHALOX · FULL-FLOW</p>
          <h1 className="font-display text-lg leading-tight md:text-xl">Full-flow anatomy</h1>
          <p className="max-w-xl text-xs text-[#93A0B5]">
            Aligned longitudinal section. 1,020 frames, 30 fps. Diagram scale, not a measured engine.
          </p>
        </div>
        <nav className="flex items-center gap-4 text-xs">
          <Link className="text-[#00E5FF] underline-offset-4 hover:underline" href="/article">
            Read the essay
          </Link>
          <span className="font-mono text-[#93A0B5]">
            {timecode(frame)} / {durationLabel()}
          </span>
        </nav>
      </header>

      <div className="grid min-h-0 md:grid-cols-[220px_minmax(0,1fr)]">
        <ol className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2 md:flex-col md:gap-1 md:overflow-visible md:border-r md:border-b-0 md:px-3 md:py-4">
          {CHAPTERS.map((chapter) => {
            const active = chapter.id === chapterId;
            return (
              <li key={chapter.id} className="shrink-0 md:shrink">
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => controlRef.current?.seek(chapter.start, playingRef.current)}
                  className={`w-max rounded-md border px-2 py-1.5 text-left md:w-full md:py-2 ${
                    active ? "border-[#00E5FF]/50 bg-white/5" : "border-transparent hover:bg-white/5"
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#00E5FF]">{chapter.index}</span>
                  <span className="mt-0.5 block text-xs whitespace-nowrap md:whitespace-normal md:text-sm">
                    {chapter.title}
                  </span>
                  <span className="hidden font-mono text-[10px] text-[#93A0B5] md:block">
                    {timecode(chapter.start)}–{timecode(chapter.end)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="relative min-h-[220px] md:min-h-0">
          <div className="absolute inset-0 p-2 [container-type:size] md:p-3">
            <canvas
              ref={canvasRef}
              className="mx-auto block aspect-video h-auto max-h-full w-[min(100cqw,calc(100cqh*16/9))]"
              role="img"
              aria-label="Animated aligned section of a full-flow staged combustion engine"
            />
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 px-4 py-3 md:px-6">
        <p className="line-clamp-2 text-sm leading-snug text-[#E8EEF6]" aria-live="polite">
          {state.caption}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono tracking-wide">
          {state.chips.scale && <Chip color="#E8EEF6">Scale change</Chip>}
          {state.chips.slow && <Chip color="#FFD166">Slow motion, conceptual</Chip>}
          {state.chips.compress && <Chip color="#9D4EDD">Time compression</Chip>}
          {reduced && !playing && <Chip color="#93A0B5">Motion paused. Play runs the film.</Chip>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button
            size="icon"
            variant="default"
            aria-label={playing ? "Pause" : "Play"}
            aria-pressed={playing}
            onClick={() => controlRef.current?.toggle()}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Replay from the first frame"
            onClick={() => controlRef.current?.seek(0, true)}
          >
            <RotateCcw aria-hidden />
          </Button>
          <label className="sr-only" htmlFor="frame-slider">
            Frame
          </label>
          <input
            id="frame-slider"
            className="frame-slider h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
            type="range"
            min={0}
            max={LAST_FRAME}
            value={frame}
            aria-valuemin={0}
            aria-valuemax={LAST_FRAME}
            aria-valuenow={frame}
            aria-valuetext={`${timecode(frame)}, ${chapterAt(frame).title}`}
            onChange={(event) => controlRef.current?.seek(Number(event.target.value), false)}
          />
          <span className="w-24 text-right font-mono text-xs text-[#93A0B5]">f {String(frame).padStart(4, "0")}</span>
        </div>
        <Legend />
        <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-[#93A0B5] md:line-clamp-none">
          Raptor-inspired conceptual model. The two turbopumps are rotated into one plane so both fit this section.
          That is an aligned section, not a clocking diagram and not a coaxial pump. Pressures, shaft speed, and gimbal
          angle are omitted. Not a certified engineering reference.
        </p>
      </footer>
    </div>
  );
}

function Chip({ children, color }: { children: string; color: string }) {
  return (
    <span className="rounded-full border px-2 py-1" style={{ borderColor: color, color }}>
      {children}
    </span>
  );
}

function Legend() {
  const items = [
    ["#344257", "Hardware"],
    ["#7E97A8", "Oxidizer body"],
    ["#A39880", "Fuel body"],
    ["#00E5FF", "Pathway"],
    ["#FFD166", "Work or heat"],
    ["#9D4EDD", "State or sensing"],
  ];
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#93A0B5]">
      {items.map(([color, label]) => (
        <li key={label} className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm" style={{ background: color }} />
          {label}
        </li>
      ))}
      <li>Boxed cards are mathematical diagrams.</li>
    </ul>
  );
}
