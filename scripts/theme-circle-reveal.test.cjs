const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function harness({ native = true, failStart = false, failAnimation = false } = {}) {
  const animations = [], elements = [], ready = deferred(), finished = deferred();
  let current = true, applies = 0, finishes = 0, callback, skips = 0;
  function target() {
    const listeners = new Map();
    return { listeners,
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
      dispatch(name) { [...(listeners.get(name) || [])].forEach(fn => fn()); },
    };
  }
  function element(tag) {
    const node = { tag, style: { setProperty(name, value) { this[name] = value; } }, attributes: {}, children: [], parent: null,
      setAttribute(name, value) { this.attributes[name] = value; },
      append(child) { this.children.push(child); child.parent = this; },
      remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); this.parent = null; },
      animate(keyframes, options) { if (failAnimation) throw new Error("Animations unavailable"); const animation = { keyframes, options, cancelled: 0, cancel() { this.cancelled++; } }; animations.push(animation); return animation; },
    };
    elements.push(node); return node;
  }
  const document = { ...target(), hidden: false, body: element("body"), documentElement: element("html"), createElement: element };
  if (native) document.startViewTransition = update => {
    if (failStart) throw new Error("Capture unavailable");
    callback = update;
    return { ready: ready.promise, finished: finished.promise, skipTransition: () => { skips++; } };
  };
  const window = target();
  const sourcePath = path.join(__dirname, "../lib/theme-reveal.ts");
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, document, window, Object, Math }, { filename: sourcePath });
  const handle = module.exports.startThemeCircleReveal({ circle: { x: 30, y: 700, radius: 800 }, accent: "#1644b8",
    apply: () => applies++, isCurrent: () => current, onFinish: () => finishes++,
  });
  return { handle, animations, document, window, elements, ready, finished,
    capture: () => callback?.(), supersede: () => { current = false; },
    stats: () => ({ applies, finishes, skips, layers: document.body.children.length,
      listeners: [...window.listeners.values(), ...document.listeners.values()].reduce((sum, set) => sum + set.size, 0) }),
  };
}

test("the incoming viewport grows inside the original 560ms circle with a matching accent rim", async () => {
  const run = harness();
  assert.equal(run.stats().applies, 0, "the native capture controls when the new viewport commits");
  run.capture(); run.ready.resolve(); await Promise.resolve();
  const [page, rim] = run.animations;
  assert.equal(page.options.pseudoElement, "::view-transition-new(root)");
  assert.equal(JSON.stringify(page.keyframes.clipPath), JSON.stringify(["circle(0px at 30px 700px)", "circle(800px at 30px 700px)"]));
  assert.equal(page.options.duration, 560);
  assert.equal(rim.options.pseudoElement, "::view-transition-group(theme-reveal-rim)");
  assert.equal(rim.options.duration, page.options.duration);
  assert.equal(rim.options.easing, page.options.easing);
  assert.equal(rim.keyframes[1].width, "1600px");
  assert.equal(rim.keyframes[1].transform, "translate(-770px, -100px)");
  assert.equal(run.document.documentElement.style["--theme-reveal-color"], "#1644b8");
  assert.equal(run.document.body.children[0].className, "theme-reveal-ring");
  assert.equal(run.elements.some(node => node.className === "theme-reveal-cover"), false);
  run.finished.resolve(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, skips: 0, layers: 0, listeners: 0 });
  assert.ok(run.animations.every(animation => animation.cancelled === 1));
});

test("a superseded capture cannot apply its old preference or start late animations", async () => {
  const run = harness();
  run.supersede(); run.handle.skipTransition(); run.capture(); run.ready.resolve(); run.finished.resolve();
  await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 0, finishes: 1, skips: 1, layers: 0, listeners: 0 });
  assert.equal(run.animations.length, 0);
});

test("skipping before capture applies the latest choice once and prevents delayed animation", async () => {
  const run = harness();
  run.handle.skipTransition(); run.handle.skipTransition(); run.capture(); run.ready.resolve(); run.finished.resolve();
  await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, skips: 1, layers: 0, listeners: 0 });
  assert.equal(run.animations.length, 0);
});

test("interrupting an active circle releases both animations without applying twice", async () => {
  const run = harness(); run.capture(); run.ready.resolve(); await Promise.resolve();
  run.handle.skipTransition(); run.finished.resolve(); await Promise.resolve();
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, skips: 1, layers: 0, listeners: 0 });
  assert.ok(run.animations.every(animation => animation.cancelled === 1));
});

test("a resize or hidden tab settles the current choice and releases its rim and listeners", async () => {
  for (const event of ["resize", "visibilitychange"]) {
    const run = harness();
    if (event === "resize") run.window.dispatch(event);
    else { run.document.hidden = true; run.document.dispatch(event); }
    run.capture(); run.ready.resolve(); await Promise.resolve();
    assert.deepEqual(run.stats(), { applies: 1, finishes: 1, skips: 1, layers: 0, listeners: 0 });
  }
});

test("a visible-tab notification leaves the reveal running", () => {
  const run = harness(); run.document.dispatch("visibilitychange");
  assert.equal(run.stats().finishes, 0);
  run.handle.skipTransition();
});

test("browsers without native view transitions apply immediately", () => {
  const run = harness({ native: false });
  assert.equal(run.handle, null);
  assert.deepEqual(run.stats(), { applies: 1, finishes: 1, skips: 0, layers: 0, listeners: 0 });
});

test("capture and animation failures preserve the choice without leaving an overlay", async () => {
  const failedStart = harness({ failStart: true });
  assert.equal(failedStart.handle, null);
  assert.deepEqual(failedStart.stats(), { applies: 1, finishes: 1, skips: 0, layers: 0, listeners: 0 });
  for (const failure of ["capture", "animation", "finished"]) {
    const run = harness({ failAnimation: failure === "animation" });
    if (failure === "capture") run.ready.reject(new Error("Capture failed"));
    else if (failure === "animation") { run.capture(); run.ready.resolve(); }
    else run.finished.reject(new Error("Interrupted"));
    await Promise.resolve();
    assert.deepEqual(run.stats(), { applies: 1, finishes: 1, skips: 1, layers: 0, listeners: 0 });
  }
});
