"use client";

import { useEffect, useRef } from "react";
import { renderPlate } from "@/engine/draw";

export default function PosterPage() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderPlate(ctx, 1600, 900, 1000, "poster");
    document.documentElement.dataset.posterReady = "true";
  }, []);

  return (
    <main>
      <canvas ref={ref} width={1600} height={900} style={{ width: "100%", height: "auto", display: "block" }} />
    </main>
  );
}
