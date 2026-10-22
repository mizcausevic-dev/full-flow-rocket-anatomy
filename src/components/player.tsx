"use client";

import { useEffect, useRef, useState } from "react";
import { renderPlate } from "@/engine/draw";
import { CHAPTERS, FRAME_MAX, chapterAt, clampFrame, formatClock } from "@/engine/timing";

function fitCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w < 2 || h < 2) return null;
  const bw = Math.round(w * dpr);
  const bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function Player() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const playingRef = useRef(false);
  const visibleRef = useRef(true);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const id = requestAnimationFrame(() => {
      setReduceMotion(mq.matches);
      if (!mq.matches) setPlaying(true);
    });
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (visibleRef.current && document.visibilityState === "visible") {
        acc += dt;
        const step = 1000 / 30;
        let next = frameRef.current;
        let advanced = false;
        while (acc >= step) {
          acc -= step;
          if (next >= FRAME_MAX) {
            setPlaying(false);
            acc = 0;
            break;
          }
          next += 1;
          advanced = true;
        }
        if (advanced) {
          frameRef.current = next;
          setFrame(next);
        }
      }
      if (playingRef.current) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const ctx = fitCanvas(canvas);
      if (!ctx) return;
      renderPlate(ctx, canvas.clientWidth, canvas.clientHeight, frameRef.current, "player");
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [frame]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === " ") {
        event.preventDefault();
        setPlaying((value) => {
          if (!value && frameRef.current >= FRAME_MAX) {
            frameRef.current = 0;
            setFrame(0);
          }
          return !value;
        });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setPlaying(false);
        setFrame((value) => clampFrame(value + (event.shiftKey ? 15 : 1)));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPlaying(false);
        setFrame((value) => clampFrame(value - (event.shiftKey ? 15 : 1)));
      } else if (event.key >= "1" && event.key <= "5") {
        const chapter = CHAPTERS[Number(event.key) - 1];
        setPlaying(false);
        setFrame(chapter.f0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const chapter = chapterAt(frame);
  const atEnd = frame >= FRAME_MAX && !playing;

  return (
    <div ref={wrapRef} className="plate-layout">
      <div className="plate-frame">
        <canvas
          ref={canvasRef}
          aria-label="Sectional model of a full-flow staged combustion engine. The text beside the figure states each stage and the limits."
        />
        <div className="legend" aria-hidden="true">
          <span className="swatch path">Cyan pathway</span>
          <span className="swatch energy">Gold energy</span>
          <span className="swatch sense">Violet state</span>
          <span className="swatch">Hardware stays metal</span>
        </div>
      </div>
      <aside className="stage-card" aria-labelledby="stage-title">
        <p className="kicker">
          Stage {chapter.id} of 5 · frames {chapter.f0}-{chapter.f1}
        </p>
        <h2 id="stage-title">{chapter.title}</h2>
        <p className="stage-body">{chapter.body}</p>
        {chapter.id === 2 ? (
          <div className="ratios" aria-label="Qualitative preburner feeds. Bar width is not a mixture ratio.">
            <p>Schematic. Width means most or a little. Not a mixture ratio.</p>
            <div>
              <strong>Fuel-rich preburner</strong>
              <div className="bar">
                <span>CH4</span>
                <i style={{ width: "86%" }} />
              </div>
              <div className="bar minor">
                <span>O2</span>
                <i style={{ width: "18%" }} />
              </div>
            </div>
            <div>
              <strong>Oxidizer-rich preburner</strong>
              <div className="bar">
                <span>O2</span>
                <i style={{ width: "86%" }} />
              </div>
              <div className="bar minor">
                <span>CH4</span>
                <i style={{ width: "18%" }} />
              </div>
            </div>
          </div>
        ) : null}
        <ul className="badges">
          {chapter.badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          Stage {chapter.id}. {chapter.title}
        </p>
        <div className="transport">
          <button
            type="button"
            className="play"
            aria-pressed={playing}
            onClick={() => {
              if (!playing && frame >= FRAME_MAX) setFrame(0);
              setPlaying((value) => !value);
            }}
          >
            {playing ? "Pause" : atEnd ? "Replay" : "Play"}
          </button>
          <label className="scrub-label">
            <span className="sr-only">Frame</span>
            <input
              type="range"
              min={0}
              max={FRAME_MAX}
              value={frame}
              aria-valuemin={0}
              aria-valuemax={FRAME_MAX}
              aria-valuenow={frame}
              aria-valuetext={`${formatClock(frame)}, frame ${frame}, ${chapter.title}`}
              onChange={(event) => {
                setPlaying(false);
                setFrame(clampFrame(Number(event.target.value)));
              }}
            />
          </label>
          <span className="readout">
            {formatClock(frame)} · {frame}
          </span>
        </div>
        <ol className="stages">
          {CHAPTERS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.id === chapter.id ? "step" : undefined}
                onClick={() => {
                  setPlaying(false);
                  setFrame(item.f0);
                }}
              >
                <span>
                  {item.id}. {item.title}
                </span>
                <small>
                  {item.clock} · {item.f0}-{item.f1}
                </small>
              </button>
            </li>
          ))}
        </ol>
        <p className="hint">
          Space plays or pauses. Arrow keys step one frame. Shift plus an arrow jumps 15 frames. Keys 1 through 5 jump
          stages. The timeline stops on the full engine instead of looping.
          {reduceMotion ? " Reduced motion is on, so playback did not start by itself." : ""}
        </p>
      </aside>
    </div>
  );
}
