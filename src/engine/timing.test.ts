import assert from "node:assert/strict";
import { test } from "node:test";
import { innerHalf, THROAT_Y, BARREL_END, EXIT_Y } from "./scene.ts";
import {
  CAMERA_KEYS,
  CHAPTERS,
  FRAME_MAX,
  cameraAt,
  chapterAt,
  clampFrame,
  smoothstep,
  windowFade,
} from "./timing.ts";

test("timeline covers every frame once", () => {
  assert.equal(CHAPTERS[0].f0, 0);
  assert.equal(CHAPTERS[CHAPTERS.length - 1].f1, FRAME_MAX);
  for (let i = 1; i < CHAPTERS.length; i += 1) {
    assert.equal(CHAPTERS[i].f0, CHAPTERS[i - 1].f1 + 1);
  }
  for (let f = 0; f <= FRAME_MAX; f += 1) {
    const hits = CHAPTERS.filter((c) => f >= c.f0 && f <= c.f1);
    assert.equal(hits.length, 1, `frame ${f}`);
  }
});

test("smoothstep endpoints and camera hold", () => {
  assert.equal(smoothstep(0), 0);
  assert.equal(smoothstep(1), 1);
  const a = cameraAt(980);
  const b = cameraAt(1019);
  assert.deepEqual(a, b);
  assert.ok(cameraAt(0).zoom < cameraAt(149).zoom);
});

test("each brief window contains a camera move, then the ending holds", () => {
  const windows = [
    [0, 149],
    [150, 299],
    [300, 509],
    [510, 749],
    [750, 940],
  ] as const;
  for (const [a, b] of windows) {
    const ca = cameraAt(a);
    const cb = cameraAt(b);
    const moved = Math.abs(ca.cx - cb.cx) + Math.abs(ca.cy - cb.cy) + Math.abs(ca.zoom - cb.zoom);
    assert.ok(moved > 0.05, `camera should move between ${a} and ${b}`);
  }
  assert.deepEqual(cameraAt(990), cameraAt(1019));
});

test("camera keys are ordered and finite", () => {
  for (let i = 1; i < CAMERA_KEYS.length; i += 1) {
    assert.ok(CAMERA_KEYS[i].f >= CAMERA_KEYS[i - 1].f);
  }
  for (const f of [0, 149, 150, 299, 300, 509, 510, 749, 750, 1019]) {
    const c = cameraAt(f);
    assert.ok(Number.isFinite(c.cx + c.cy + c.zoom));
    assert.ok(c.zoom > 0.2 && c.zoom < 3);
    assert.equal(chapterAt(f).f0 <= f && f <= chapterAt(f).f1, true);
  }
});

test("teaching contour is narrowest at the throat", () => {
  const throat = innerHalf(THROAT_Y);
  assert.ok(throat < innerHalf(BARREL_END));
  assert.ok(throat < innerHalf(EXIT_Y));
  assert.ok(innerHalf(THROAT_Y - 40) > throat);
  assert.ok(innerHalf(THROAT_Y + 40) > throat);
});

test("frame clamp and fade hold through the last frame", () => {
  assert.equal(clampFrame(-4), 0);
  assert.equal(clampFrame(5000), 1019);
  assert.equal(clampFrame(Number.NaN), 0);
  assert.equal(windowFade(1019, 940, 1019), 1);
  assert.equal(windowFade(100, 0, 149) > 0, true);
  assert.equal(windowFade(200, 0, 149), 0);
});
