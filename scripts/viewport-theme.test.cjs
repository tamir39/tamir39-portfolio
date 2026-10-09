const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

function loadSource(file, imports, globals) {
  const filename = path.join(__dirname, "..", file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, require: name => imports[name], ...globals }, { filename });
  return module.exports;
}

function scopeHarness() {
  const slots = [], effects = [], observers = [], children = { saved: true };
  let cursor = 0;
  let current = { theme: "editorial", appearance: "light", resolvedAppearance: "light", reduced: false,
    motionPaused: false, setTheme() {}, setAppearance() {}, toggleMotion() {},
  };
  const react = {
    createContext: () => ({ Provider: "visibility" }),
    useState(initial) { const index = cursor++; if (!(index in slots)) slots[index] = initial; return [slots[index], value => { slots[index] = value; }]; },
    useRef(initial) { const index = cursor++; if (!(index in slots)) slots[index] = { current: initial }; return slots[index]; },
    useLayoutEffect(fn, deps) { const index = cursor++; if (!slots[index] || deps.some((value, i) => value !== slots[index][i])) { slots[index] = deps; effects.push(fn); } },
    useMemo(fn, deps) { const index = cursor++; if (!slots[index] || deps.some((value, i) => value !== slots[index].deps[i])) slots[index] = { deps, value: fn() }; return slots[index].value; },
  };
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
    enter(visible) { this.callback([{ isIntersecting: visible }]); }
  }
  const scope = loadSource("components/ViewportThemeScope.tsx", {
    react, "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
    "framer-motion": { MotionConfig: "motion" },
    "./providers/ThemeProvider": { PortfolioThemeScope: "theme", usePortfolioTheme: () => current },
    "@/lib/themes": { themeTransition: (theme, reduced) => ({ theme, reduced }) },
  }, {
    IntersectionObserver,
    window: { innerWidth: 390, innerHeight: 844 },
    document: { querySelector: () => ({ getBoundingClientRect: () => ({ x: 0, left: 0, right: 390, top: 1000, bottom: 1400 }) }) },
  });
  const render = () => { cursor = 0; return scope.ViewportThemeScope({ target: "#study", children }); };
  render();
  const cleanup = effects[0]();
  return { get current() { return current; }, update: next => { current = { ...current, ...next }; }, observers, render, cleanup, children };
}

test("offscreen artwork retains its theme and motion configuration until it enters view", () => {
  const run = scopeHarness();
  const initial = run.render();
  run.update({ theme: "swiss", appearance: "dark", resolvedAppearance: "dark" });
  const hidden = run.render();
  assert.equal(hidden.props.value, initial.props.value, "hidden theme context stays referentially stable");
  assert.equal(hidden.props.children.props.children.props.transition, initial.props.children.props.children.props.transition);
  run.update({ theme: "botanical" });
  run.observers[0].enter(true);
  const visible = run.render();
  assert.equal(visible.props.value.theme, "botanical", "entering view adopts the latest choice, skipping intermediate ones");
  assert.equal(visible.props.value.resolvedAppearance, "dark");
  assert.equal(visible.props.children.props.children.props.children, run.children, "saved interaction content remains mounted");
  run.cleanup(); assert.equal(run.observers[0].disconnected, true);
});

test("reduced-motion preferences remain live in a hidden artwork scope", () => {
  const run = scopeHarness(); run.render();
  run.update({ theme: "play", reduced: true, motionPaused: true });
  const hidden = run.render();
  assert.equal(hidden.props.value.theme, "editorial");
  assert.equal(hidden.props.value.reduced, true);
  assert.equal(hidden.props.value.motionPaused, true);
  assert.equal(hidden.props.children.props.children.props.reducedMotion, "always");
  assert.equal(hidden.props.value.setTheme, run.current.setTheme);
  run.cleanup();
});

test("scroll entrances use the latest theme without replaying, and DOM changes scan only additions", () => {
  const observers = [], effects = [], frames = new Map();
  let frameId = 0, documentScans = 0, mutations, cancelled = 0;
  class Element {
    constructor(tag = "h2") { this.tag = tag; this.isConnected = true; this.animations = []; this.queries = 0; }
    matches(selector) { return this.tag === "h2" && selector.includes("h2"); }
    querySelectorAll() { this.queries++; return []; }
    closest() { return null; }
    toggleAttribute() {}
    removeAttribute() {}
    animate(keyframes, options) { const animation = { keyframes, options, finished: new Promise(() => {}), cancel: () => cancelled++ }; this.animations.push(animation); return animation; }
  }
  const heading = new Element(), root = { dataset: { theme: "editorial", motion: "on", pageIntro: "complete" } };
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(element) { this.targets.add(element); }
    unobserve(element) { this.targets.delete(element); }
    disconnect() { this.targets.clear(); }
  }
  class MutationObserver {
    constructor(callback) { mutations = callback; }
    observe() {}
    disconnect() {}
  }
  const motion = loadSource("components/PageMotion.tsx", {
    react: { useEffect: (fn, deps) => effects.push({ fn, deps }) },
    "next/navigation": { usePathname: () => "/" },
    "./providers/ThemeProvider": { usePortfolioMotion: () => ({ reduced: false }) },
    "@/lib/themes": { isTheme: theme => ["editorial", "swiss", "blueprint", "play", "botanical"].includes(theme) },
  }, {
    Element, IntersectionObserver, MutationObserver,
    window: { matchMedia: () => ({ matches: false }) },
    document: { documentElement: root, querySelector: () => heading, querySelectorAll: selector => { documentScans++; return selector.includes("h2") ? [heading] : []; } },
    requestAnimationFrame: fn => { frames.set(++frameId, fn); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  motion.PageMotion(); const cleanup = effects[0].fn();
  assert.equal(JSON.stringify(effects[0].deps), JSON.stringify(["/", false]), "theme changes do not recreate observers");
  const reveal = observers[1];
  reveal.callback([{ target: heading, isIntersecting: true }]);
  root.dataset.theme = "swiss";
  reveal.callback([{ target: heading, isIntersecting: true }]);
  assert.equal(heading.animations.length, 1, "an already revealed heading does not replay");
  const scansBefore = documentScans, added = new Element();
  mutations([{ type: "childList", addedNodes: [{ nodeType: 3 }] }]);
  assert.equal(frames.size, 0, "typing does not schedule a page scan");
  mutations([{ type: "childList", addedNodes: [added] }]);
  mutations([{ type: "childList", addedNodes: [added] }]);
  assert.equal(frames.size, 1, "multiple DOM additions batch into one frame");
  for (const fn of frames.values()) fn(); frames.clear();
  assert.equal(documentScans, scansBefore, "the document is not rescanned for an added subtree");
  assert.ok(reveal.targets.has(added));
  reveal.callback([{ target: added, isIntersecting: true }]);
  assert.equal(added.animations[0].options.duration, 450);
  assert.equal(added.animations[0].keyframes[0].translate, "-32px 0", "a newly visible heading uses the active Swiss theme");
  cleanup(); assert.equal(cancelled, 2);
});
