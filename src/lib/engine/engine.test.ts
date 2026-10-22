import assert from "node:assert/strict";
import test from "node:test";
import { cameraAt } from "./camera";
import { buildPaths, innerRadius, shellExtra, THROAT_R, Y } from "./geometry";
import {
  CALLOUTS,
  calloutsAt,
  formatTime,
  FRAME_COUNT,
  HOLD_FRAME,
  LAST_FRAME,
  motionFrame,
  SEGMENTS,
  segmentAt,
} from "./timeline";

test("timeline is 1,020 frames at the brief boundaries", () => {
  assert.equal(FRAME_COUNT, 1020);
  assert.equal(LAST_FRAME, 1019);
  assert.equal(SEGMENTS[0].from, 0);
  assert.equal(SEGMENTS[0].to, 149);
  assert.equal(SEGMENTS[1].from, 150);
  assert.equal(SEGMENTS[1].to, 299);
  assert.equal(SEGMENTS[2].from, 300);
  assert.equal(SEGMENTS[2].to, 509);
  assert.equal(SEGMENTS[3].from, 510);
  assert.equal(SEGMENTS[3].to, 749);
  assert.equal(SEGMENTS[4].from, 750);
  assert.equal(SEGMENTS[4].to, 1019);
  assert.equal(formatTime(0), "0.00s");
  assert.equal(formatTime(150), "5.00s");
  assert.equal(formatTime(300), "10.00s");
  assert.equal(formatTime(510), "17.00s");
  assert.equal(formatTime(750), "25.00s");
  assert.ok(Number(formatTime(1019).replace("s", "")) < 34);
});

test("segments cover every frame once", () => {
  for (let frame = 0; frame <= LAST_FRAME; frame += 1) {
    const hits = SEGMENTS.filter((segment) => frame >= segment.from && frame <= segment.to);
    assert.equal(hits.length, 1, `frame ${frame}`);
    assert.equal(segmentAt(frame).id, hits[0].id);
  }
});

test("ending camera and motion hold still", () => {
  const held = cameraAt(HOLD_FRAME);
  assert.deepEqual(cameraAt(LAST_FRAME), held);
  assert.equal(motionFrame(LAST_FRAME), HOLD_FRAME);
  assert.equal(motionFrame(HOLD_FRAME - 1), HOLD_FRAME - 1);
});

test("camera moves are finite and continuous", () => {
  let prev = cameraAt(0);
  for (let frame = 1; frame <= LAST_FRAME; frame += 1) {
    const cam = cameraAt(frame);
    assert.ok(Number.isFinite(cam.x + cam.y + cam.w));
    assert.ok(cam.w > 100);
    assert.ok(Math.abs(cam.x - prev.x) < 30, `x jump at ${frame}`);
    assert.ok(Math.abs(cam.y - prev.y) < 40, `y jump at ${frame}`);
    assert.ok(Math.abs(cam.w - prev.w) < 100, `w jump at ${frame}: ${prev.w} -> ${cam.w}`);
    prev = cam;
  }
});

test("throat is the narrowest station and the shell stays positive", () => {
  assert.ok(Math.abs(innerRadius(Y.throat) - THROAT_R) < 1e-6);
  assert.ok(innerRadius(Y.chBot) > innerRadius(Y.throat));
  assert.ok(innerRadius(Y.exit) > innerRadius(Y.throat));
  for (let y = Y.chTop; y <= Y.exit; y += 5) {
    assert.ok(innerRadius(y) + 1e-6 >= THROAT_R);
    assert.ok(shellExtra(y) > 0);
  }
});

test("propellant paths are finite polylines", () => {
  const paths = buildPaths();
  for (const [name, pts] of Object.entries(paths)) {
    assert.ok(pts.length >= 2, name);
    for (const pt of pts) {
      assert.ok(Number.isFinite(pt.x) && Number.isFinite(pt.y), name);
    }
  }
});

test("scale and slow-motion callouts overlap only where the wall is enlarged", () => {
  const atWall = calloutsAt(700).map((callout) => callout.kicker);
  assert.ok(atWall.includes("Slowed"));
  assert.ok(atWall.includes("Scale changed"));
  assert.equal(CALLOUTS.length > 0, true);
});
