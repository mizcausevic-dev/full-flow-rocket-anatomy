import assert from "node:assert/strict";
import { test } from "node:test";
import { CHAPTERS, FRAME_COUNT, LAST_FRAME, anchorsOutside, cameraAt, stateAt } from "./timeline";

test("frame contract is 1,020 frames indexed 0 through 1019", () => {
  assert.equal(FRAME_COUNT, 1020);
  assert.equal(LAST_FRAME, 1019);
  assert.equal(CHAPTERS[0].start, 0);
  assert.equal(CHAPTERS[CHAPTERS.length - 1].end, 1019);
});

test("chapters tile the timeline without gaps or overlap", () => {
  let cursor = 0;
  for (const chapter of CHAPTERS) {
    assert.equal(chapter.start, cursor);
    assert.ok(chapter.end >= chapter.start);
    cursor = chapter.end + 1;
  }
  assert.equal(cursor, FRAME_COUNT);
});

test("every frame has a finite camera and a bounded step from the previous frame", () => {
  let previous = cameraAt(0);
  for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
    const camera = cameraAt(frame);
    for (const value of [camera.cx, camera.cy, camera.viewW, camera.viewH]) {
      assert.ok(Number.isFinite(value));
    }
    assert.ok(camera.viewW > 0);
    assert.ok(camera.viewH > 0);
    if (frame > 0) {
      assert.ok(Math.abs(camera.cx - previous.cx) < 36, `cx jump at ${frame}`);
      assert.ok(Math.abs(camera.cy - previous.cy) < 20, `cy jump at ${frame}`);
      assert.ok(Math.abs(camera.viewW - previous.viewW) < 48, `viewW jump at ${frame}`);
    }
    previous = camera;
  }
});

test("the hold at the end does not move the camera", () => {
  const a = cameraAt(1000);
  const b = cameraAt(1019);
  assert.deepEqual(a, b);
});

test("causal anchors from the previous stage stay inside the frame", () => {
  const misses = new Set<string>();
  for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
    for (const name of anchorsOutside(frame)) misses.add(`${frame}:${name}`);
  }
  assert.deepEqual([...misses], []);
});

test("reveals stay inside 0..1 and the final frame is settled", () => {
  for (const frame of [0, 149, 150, 299, 300, 509, 510, 749, 750, 1019]) {
    const state = stateAt(frame);
    for (const value of Object.values(state.reveal)) {
      assert.ok(value >= 0 && value <= 1);
    }
  }
  assert.equal(stateAt(1019).reveal.settled, 1);
  assert.equal(stateAt(1019).chips.scale, false);
  assert.equal(stateAt(600).chips.slow, true);
  assert.equal(stateAt(200).chips.compress, true);
  assert.equal(stateAt(80).chips.slow, false);
});
