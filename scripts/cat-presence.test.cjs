const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const sourcePath = path.join(__dirname, "../lib/cat-presence.ts");
const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const presenceModule = { exports: {} };
vm.runInNewContext(compiled.outputText, {
  module: presenceModule, exports: presenceModule.exports, Math,
}, { filename: sourcePath });
const { chooseCatPageArea, chooseCatPerch, chooseCatNuzzle, chooseCatDrop, chooseCatRestFacing } = presenceModule.exports;

test("a resting mobile cat faces inward at either screen edge", () => {
  for (const width of [320, 390, 430, 599]) {
    assert.equal(chooseCatRestFacing(width - 48 - 18, width, 48, "right"), "left");
    assert.equal(chooseCatRestFacing(18, width, 48, "left"), "right");
  }
});

test("a cat away from the screen edges keeps its chosen direction", () => {
  assert.equal(chooseCatRestFacing(171, 390, 48, "right"), "right");
  assert.equal(chooseCatRestFacing(171, 390, 48, "left"), "left");
});

test("mobile roaming explores the opposite clear margin instead of only moving up and down", () => {
  const width = 390, height = 844, catWidth = 48, catHeight = 111;
  const right = width - catWidth - 18;
  const fromRight = chooseCatPerch(width, height, catWidth, catHeight, [], "right", 1, () => .5, { x: right, y: 420 });
  assert.equal(fromRight.x, 18);
  const fromLeft = chooseCatPerch(width, height, catWidth, catHeight, [], "right", 2, () => .5, fromRight);
  assert.equal(fromLeft.x, right);
});

test("mobile roaming stays on the safe side when the opposite margin is covered", () => {
  const point = chooseCatPerch(390, 844, 48, 111, [{ x: 0, y: 0, width: 100, height: 844 }], "right", 1, () => .5, { x: 324, y: 420 });
  assert.equal(point.x, 324);
  assert.ok(Math.abs(point.y - 420) >= 64);
});

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function intersects(point, catWidth, catHeight, obstacle, padding = 0) {
  return point.x + catWidth + padding > obstacle.x && point.x - padding < obstacle.x + obstacle.width
    && point.y + catHeight + padding > obstacle.y && point.y - padding < obstacle.y + obstacle.height;
}

function assertWithinViewport(point, width, height, catWidth, catHeight) {
  assert.ok(point.x >= 0 && point.y >= 0, `cat starts inside the ${width} × ${height} viewport`);
  assert.ok(point.x + catWidth <= width && point.y + catHeight <= height, `the entire cat fits inside the ${width} × ${height} viewport`);
}

test("the chapter at the reading line wins over a visible sliver of the previous chapter", () => {
  assert.equal(chooseCatPageArea([
    { id: "studio-motion", top: -535, bottom: 96 },
    { id: "studio-ux", top: 96, bottom: 727 },
  ], 720), "studio-ux");
});

test("section tracking follows both scrolling directions and ignores areas outside the viewport", () => {
  const areas = [
    { id: "work", top: -1500, bottom: -200 },
    { id: "games", top: -200, bottom: 500 },
    { id: "independent", top: 500, bottom: 1800 },
  ];
  assert.equal(chooseCatPageArea(areas, 844), "games");
  assert.equal(chooseCatPageArea(areas.map(area => ({ ...area, top: area.top - 400, bottom: area.bottom - 400 })), 844), "independent");
  assert.equal(chooseCatPageArea(areas.map(area => ({ ...area, top: area.top + 400, bottom: area.bottom + 400 })), 844), "games");
  assert.equal(chooseCatPageArea([{ id: "later", top: 900, bottom: 2000 }], 844), null);
});

test("perches keep the complete cat inside common phone, tablet, and desktop viewports", () => {
  for (const [width, height, catWidth, catHeight] of [[320, 390, 84, 100], [390, 844, 84, 100], [800, 650, 110, 140], [1440, 900, 110, 140]]) {
    for (const side of ["left", "right"]) {
      for (let variation = 0; variation < 12; variation++) {
        const point = chooseCatPerch(width, height, catWidth, catHeight, [], side, variation, seededRandom(variation + 1));
        assertWithinViewport(point, width, height, catWidth, catHeight);
      }
    }
  }
});

test("a perch chooses clear space over a preferred side containing controls", () => {
  const obstacles = [
    { x: 740, y: 100, width: 160, height: 700 },
    { x: 0, y: 600, width: 200, height: 200 },
  ];
  const point = chooseCatPerch(900, 800, 110, 140, obstacles, "right", 0, () => 0);
  assert.ok(point.x < 450, "the blocked preferred right margin gives way to the clear left margin");
  for (const obstacle of obstacles) assert.equal(intersects(point, 110, 140, obstacle, 10), false, "the whole cat and clearance avoid the controls");
});

test("roaming chooses a different clear perch instead of staying in its current spot", () => {
  const from = { x: 886, y: 120 };
  const point = chooseCatPerch(1000, 800, 96, 158, [], "right", 0, () => 0, from);
  assert.ok(Math.hypot(point.x - from.x, point.y - from.y) >= 96);
  assertWithinViewport(point, 1000, 800, 96, 158);
});

test("a new roaming destination still gives content clearance priority over movement", () => {
  const from = { x: 886, y: 120 };
  const obstacles = [
    { x: 0, y: 0, width: 866, height: 800 },
    { x: 866, y: 300, width: 134, height: 500 },
  ];
  const point = chooseCatPerch(1000, 800, 96, 158, obstacles, "right", 0, () => 0, from);
  assert.equal(intersects(point, 96, 158, obstacles[0], 10), false);
  assert.equal(intersects(point, 96, 158, obstacles[1], 10), false);
  assert.ok(Math.hypot(point.x - from.x, point.y - from.y) < 96, "keep the clear pocket when other destinations cover content");
});

test("injected random sources give repeatable perches and varied valid nuzzle choices", () => {
  const perch = random => chooseCatPerch(1200, 800, 100, 120, [], "left", 2, random);
  assert.equal(JSON.stringify(perch(seededRandom(39))), JSON.stringify(perch(seededRandom(39))));
  const nuzzle = random => chooseCatNuzzle({ x: 600, y: 400 }, 1200, 800, 100, 120, [], random);
  assert.equal(JSON.stringify(nuzzle(seededRandom(39))), JSON.stringify(nuzzle(seededRandom(39))));
  assert.notEqual(JSON.stringify(nuzzle(() => 0)), JSON.stringify(nuzzle(() => 0.999)), "different draws can choose different clear spaces");
});

test("a nuzzle stops beside a resting cursor and leaves its target uncovered", () => {
  const cursor = { x: 600, y: 400 };
  for (const random of [() => 0, () => 0.999]) {
    const point = chooseCatNuzzle(cursor, 1200, 800, 100, 120, [], random);
    assert.ok(point);
    assertWithinViewport(point, 1200, 800, 100, 120);
    const horizontalGap = point.x > cursor.x ? point.x - cursor.x : cursor.x - point.x - 100;
    assert.ok(horizontalGap >= 52, "the cat stops beside the pointer rather than on it");
    assert.equal(intersects(point, 100, 120, { x: cursor.x - 24, y: cursor.y - 24, width: 48, height: 48 }), false);
  }
});

test("nuzzles reject an edge collision even when the center of the cat is clear", () => {
  const obstacle = { x: 490, y: 275, width: 20, height: 230 };
  const point = chooseCatNuzzle({ x: 600, y: 400 }, 1200, 800, 100, 120, [obstacle], () => 0);
  assert.ok(point);
  assert.ok(point.x > 600, "the left candidate's outer edge is blocked, so choose the clear right side");
  assert.equal(intersects(point, 100, 120, obstacle, 10), false);
});

test("nuzzles leave a clearance gap around controls, not only physical separation", () => {
  const obstacle = { x: 505, y: 275, width: 20, height: 230 };
  const point = chooseCatNuzzle({ x: 600, y: 400 }, 1200, 800, 100, 120, [obstacle], () => 0);
  assert.ok(point);
  assert.ok(point.x > 600, "a control just beyond the cat's edge still blocks the left candidate's clearance zone");
  assert.equal(intersects(point, 100, 120, obstacle, 10), false);
});

test("blocked locations, cramped viewports, and corner cursors skip the nuzzle", () => {
  const cursor = { x: 600, y: 400 };
  assert.equal(chooseCatNuzzle(cursor, 1200, 800, 100, 120, [{ x: 0, y: 0, width: 1200, height: 800 }], () => 0), null);
  assert.equal(chooseCatNuzzle({ x: 50, y: 90 }, 100, 180, 100, 120, [], () => 0), null);
  assert.equal(chooseCatNuzzle({ x: 5, y: 5 }, 1200, 800, 100, 120, [], () => 0), null);
});

test("a clear cat drop keeps the visitor's exact placement", () => {
  const requested = { x: 237.5, y: 319.25 };
  const result = chooseCatDrop(requested, 1200, 800, 100, 120, [{ x: 800, y: 200, width: 200, height: 200 }]);
  assert.equal(result.x, requested.x);
  assert.equal(result.y, requested.y);
});

test("cat drops clamp the whole cat into twelve-pixel viewport margins", () => {
  const leftBottom = chooseCatDrop({ x: -60, y: 950 }, 800, 600, 100, 120, []);
  assert.equal(leftBottom.x, 12);
  assert.equal(leftBottom.y, 468);
  const rightTop = chooseCatDrop({ x: 1000, y: -300 }, 800, 600, 100, 120, []);
  assert.equal(rightTop.x, 688);
  assert.equal(rightTop.y, 12);
  assertWithinViewport(leftBottom, 800, 600, 100, 120);
  assertWithinViewport(rightTop, 800, 600, 100, 120);
});

test("an overlapping drop settles at the nearest clear control edge", () => {
  const requested = { x: 420, y: 320 };
  const obstacle = { x: 400, y: 300, width: 100, height: 100 };
  const result = chooseCatDrop(requested, 1000, 800, 100, 100, [obstacle]);
  assert.equal(intersects(result, 100, 100, obstacle, 10), false);
  assert.equal(Math.hypot(result.x - requested.x, result.y - requested.y), 90, "settle at a nearby safe edge instead of jumping to a viewport corner");
  assertWithinViewport(result, 1000, 800, 100, 100);
});

test("a narrow safe gap can be found between surrounding text blocks", () => {
  const obstacles = [
    { x: 0, y: 0, width: 400, height: 600 },
    { x: 520, y: 0, width: 380, height: 600 },
  ];
  const result = chooseCatDrop({ x: 350, y: 230 }, 900, 600, 100, 100, obstacles);
  assert.equal(result.x, 410);
  assert.equal(result.y, 230);
  for (const obstacle of obstacles) assert.equal(intersects(result, 100, 100, obstacle, 10), false);
});

test("a fully blocked viewport gives a deterministic least-overlap drop", () => {
  const requested = { x: 150, y: 200 };
  const obstacles = [{ x: 0, y: 0, width: 1000, height: 800 }];
  const first = chooseCatDrop(requested, 1000, 800, 100, 120, obstacles);
  const second = chooseCatDrop(requested, 1000, 800, 100, 120, obstacles);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(first.x, requested.x, "equally blocked locations prefer the original drop");
  assert.equal(first.y, requested.y);
  assertWithinViewport(first, 1000, 800, 100, 120);
});

test("when no fully clear gap exists, a drop minimizes overlap before movement distance", () => {
  const obstacles = [
    { x: 0, y: 0, width: 300, height: 200 },
    { x: 80, y: 60, width: 20, height: 20 },
  ];
  const result = chooseCatDrop({ x: 50, y: 40 }, 300, 200, 100, 100, obstacles);
  assert.equal(result.x, 110, "move past the extra obstruction even though every point overlaps the full background");
  assert.equal(result.y, 40, "among equally obstructed fallbacks, keep the closest vertical placement");
  assert.equal(intersects(result, 100, 100, obstacles[1], 10), false);
});

test("tiny viewports relax impossible margins without producing negative positions", () => {
  const closeFit = chooseCatDrop({ x: 30, y: 30 }, 110, 130, 100, 120, []);
  assert.equal(closeFit.x, 5);
  assert.equal(closeFit.y, 5);
  assertWithinViewport(closeFit, 110, 130, 100, 120);
  const smallerThanCat = chooseCatDrop({ x: -30, y: 500 }, 80, 90, 100, 120, []);
  assert.equal(smallerThanCat.x, 0);
  assert.equal(smallerThanCat.y, 0);
});
