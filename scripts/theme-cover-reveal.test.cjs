const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

function harness({ animationsAvailable = true } = {}) {
  const animations = [], frames = new Map(), elements = [];
  let nextFrame = 0, current = true, applies = 0, finishes = 0;
  function target() {
    const listeners = new Map();
    return {
      listeners,
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      dispatch(name) { [...(listeners.get(name) || [])].forEach(fn => fn()); },
    };
  }
  function element(tag) {
    const node = { tag, style: {}, attributes: {}, children: [], parent: null,
      setAttribute(name, value) { this.attributes[name] = value; },
      append(child) { this.children.push(child); child.parent = this; },
      remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); this.parent = null; },
    };
    if (animationsAvailable) node.animate = (keyframes, options) => {
      let resolve, reject;
      const animation = { node, keyframes, options, cancelled: 0,
        finished: new Promise((yes, no) => { resolve = yes; reject = no; }),
        finish: () => resolve(), fail: () => reject(new Error("Interrupted")),
        cancel() { this.cancelled++; reject(new Error("Cancelled")); },
      };
      animations.push(animation); return animation;
    };
    elements.push(node); return node;
  }
  const document = { ...target(), hidden: false, body: element("body"), createElement: element, createElementNS: (_, tag) => element(tag),
    startViewTransition() { throw new Error("Mobile must not capture the page"); },
  };
  const window = target();
  const sourcePath = path.join(__dirname, "../lib/theme-cover-reveal.ts");
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, document, window, Object, Math,
    requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame; }, cancelAnimationFrame: id => frames.delete(id),
  }, { filename: sourcePath });
  const handle = module.exports.startThemeCoverReveal({ circle: { x: 30, y: 700, radius: 800 }, paper: "#f3f7ff", accent: "#1644b8",
    apply: () => applies++, isCurrent: () => current, onFinish: () => finishes++,
  });
  return { handle, animations, document, window, elements, frames,
    supersede: () => { current = false; },
    paint: () => { const queued = [...frames.values()]; frames.clear(); queued.forEach(fn => fn()); },
    stats: () => ({ applies, finishes, layers: document.body.children.length, frames: frames.size,
      listeners: [...window.listeners.values(), ...document.listeners.values()].reduce((sum, set) => sum + set.size, 0) }),
  };
}

test("mobile starts one transform animation without capturing or changing the page", () => {
  const run = harness();
  assert.deepEqual(run.stats(), { applies: 0, finishes: 0, layers: 1, frames: 0, listeners: 2 });
  assert.deepEqual(Object.keys(run.animations[0].keyframes), ["transform"]);
  assert.equal(run.animations[0].options.duration, 240);
  const rim = run.elements.find(node => node.tag === "circle");
  assert.equal(rim.attributes.fill, "#f3f7ff");
  assert.equal(rim.attributes["vector-effect"], "non-scaling-stroke");
  run.handle.skipTransition();
});

test("the new page commits under full cover and fades after a paint", async () => {
  const run = harness();
  run.animations[0].finish(); await Promise.resolve();
  assert.equal(run.stats().applies, 1);
  assert.equal(run.animations.length, 1);
  assert.equal(run.stats().frames, 1);
  run.paint();
  assert.deepEqual(Object.keys(run.animations[1].keyframes), ["opacity"]);
  assert.equal(run.animations[1].options.duration, 90);
  run.animations[1].finish(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
  assert.ok(run.animations.every(animation => animation.cancelled === 1));
});

test("a superseded pending choice cannot overwrite the latest selection", async () => {
  const run = harness();
  run.supersede(); run.handle.skipTransition(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 0, finishes: 1, layers: 0, frames: 0, listeners: 0 });
  run.animations[0].finish(); await Promise.resolve();
  assert.equal(run.stats().applies, 0);
});

test("superseding after commit cancels the pending fade and releases its frame", async () => {
  const run = harness();
  run.animations[0].finish(); await Promise.resolve();
  run.supersede(); run.handle.skipTransition(); run.paint();
  assert.equal(run.animations.length, 1);
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});

test("skipping for reduced motion applies the current choice exactly once", async () => {
  const run = harness();
  run.handle.skipTransition(); run.handle.skipTransition(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});

test("viewport changes finish the reveal so its old circle cannot leave a gap", async () => {
  const run = harness();
  run.window.dispatch("resize"); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});

test("hiding the tab settles the preference without waiting on paused frames", async () => {
  const run = harness();
  run.document.hidden = true; run.document.dispatch("visibilitychange"); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});

test("browsers without Web Animations apply immediately and remove the cover", () => {
  const run = harness({ animationsAvailable: false });
  assert.equal(run.handle, null);
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});

test("animation failures apply the preference without stranding an overlay", async () => {
  const run = harness();
  run.animations[0].fail(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});

test("interrupting the fade never commits twice", async () => {
  const run = harness();
  run.animations[0].finish(); await Promise.resolve(); run.paint();
  run.animations[1].fail(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, layers: 0, frames: 0, listeners: 0 });
});
