const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

function load(relative, globals = {}) {
  const sourcePath = path.join(__dirname, relative);
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const result = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module: result, exports: result.exports, Math, Number, Object, ...globals }, { filename: sourcePath });
  return result.exports;
}
const { catThemeTourPlan, catThemePlayPlan, catThemePlayOverridden, CatThemePlayCycle, runCatThemeTour, runCatHeroTour, catHeroStop, catHeroArcPoint, CAT_HERO_ANTICIPATION_MS, CAT_HERO_TOUCH_MS, CAT_HERO_READ_MS, CAT_PICKER_GUIDE_MS } = load("../lib/cat-theme-tour.ts");
const { themeRevealCircle } = load("../lib/theme-reveal.ts");
const choices = ["editorial", "swiss", "blueprint", "play", "botanical"].map(id => ({ id, name: id }));

test("four headline touches show all five looks including the starting preference", () => {
  for (const choice of choices) {
    const plan = catThemeTourPlan(choices, choice.id);
    assert.equal(plan.length, 4);
    assert.equal(new Set([choice.id, ...plan.map(step => step.theme)]).size, 5);
    assert.ok(plan.every(step => step.theme !== choice.id));
    assert.notEqual(plan[0].theme, choice.id);
    plan.forEach((step, index) => {
      assert.equal(step.index, index);
      assert.equal(step.total, 4);
      assert.ok(step.text.length > 20);
    });
  }
});

test("four contacts progress left to right with every perch above the heading", () => {
  const lines = [{ x: 24, y: 190, width: 342, height: 54 }, { x: 24, y: 244, width: 290, height: 54 }];
  const stops = Array.from({ length: 4 }, (_, index) => catHeroStop(lines, index, 48, 61));
  for (const [index, stop] of stops.entries()) {
    const line = lines[0];
    assert.ok(stop.contact.x > line.x && stop.contact.x < line.x + line.width);
    assert.ok(stop.contact.y > line.y && stop.contact.y < line.y + line.height);
    assert.ok(stop.perch.y + 61 < lines[0].y);
    if (index) assert.ok(stop.perch.x > stops[index - 1].perch.x);
  }
  assert.ok(stops[0].perch.x < stops[1].perch.x);
  assert.ok(stops[2].perch.x < stops[3].perch.x);
  assert.equal(catHeroStop([], 0, 48, 61), null);
});

test("the upper half-circle stays above its baseline and moves continuously left to right", () => {
  const arc = { left: 24, right: 320, baseline: 180, rise: 40 };
  let previous = catHeroArcPoint(arc, 0);
  for (let frame = 1; frame <= 120; frame++) {
    const point = catHeroArcPoint(arc, frame / 120);
    assert.ok(point.x >= previous.x);
    assert.ok(point.y >= 140 - 1e-9 && point.y <= 180 + 1e-9);
    assert.ok(Math.hypot(point.x - previous.x, point.y - previous.y) < 5);
    previous = point;
  }
  assert.equal(catHeroArcPoint(arc, 0).x, 24);
  assert.equal(catHeroArcPoint(arc, .5).y, 140);
  assert.equal(catHeroArcPoint(arc, 1).x, 320);
});

test("every headline settles and gets reading time before the finite picker guide", async () => {
  const trace = [], abort = new AbortController();
  const plan = catThemeTourPlan(choices, "editorial");
  await runCatHeroTour(plan, {
    signal: abort.signal, wait: async ms => trace.push(`wait:${ms}`),
    visit: async step => trace.push(`arrive:${step.theme}`), tap: step => trace.push(`tap:${step.theme}`),
    reveal: async step => trace.push(`typed:${step.theme}`),
    speak: step => trace.push(`say:${step.theme}`),
    change: step => trace.push(`change:${step.theme}`),
    show: step => trace.push(`read:${step.theme}`),
    guide: async () => { trace.push("guide"); trace.push(`wait:${CAT_PICKER_GUIDE_MS}`); },
  });
  assert.equal(trace.filter(item => item.startsWith("tap:")).length, 4);
  for (const step of plan) {
    const tap = trace.indexOf(`tap:${step.theme}`);
    assert.equal(trace[tap - 3], `arrive:${step.theme}`);
    assert.equal(trace[tap - 2], `say:${step.theme}`);
    assert.equal(trace[tap - 1], `wait:${CAT_HERO_ANTICIPATION_MS}`);
    assert.equal(trace[tap + 1], `wait:${CAT_HERO_TOUCH_MS}`);
    assert.equal(trace[tap + 2], `change:${step.theme}`);
    assert.equal(trace[tap + 3], `typed:${step.theme}`);
    assert.equal(trace[tap + 4], `read:${step.theme}`);
    assert.equal(trace[tap + 5], `wait:${CAT_HERO_READ_MS}`);
  }
  assert.deepEqual(trace.slice(-2), ["guide", `wait:${CAT_PICKER_GUIDE_MS}`]);
});

test("cancelling the headline lap during movement or the last reading hold never opens the picker", async () => {
  for (const stage of ["move", "last-read"]) {
    const abort = new AbortController(), plan = catThemeTourPlan(choices, "editorial");
    let taps = 0, guides = 0;
    await assert.rejects(runCatHeroTour(plan, {
      signal: abort.signal,
      wait: async ms => { if (stage === "last-read" && taps === plan.length && ms === CAT_HERO_READ_MS) abort.abort(); },
      visit: async () => { if (stage === "move") abort.abort(); },
      tap: () => taps++, speak: () => {}, change: () => {}, reveal: async () => {}, show: () => {}, guide: async () => guides++,
    }));
    assert.equal(guides, 0);
    assert.equal(taps, stage === "move" ? 0 : 4);
  }
});

test("interruption while the cat is speaking prevents its tap", async () => {
  const abort = new AbortController();
  let taps = 0;
  await assert.rejects(runCatHeroTour(catThemeTourPlan(choices, "editorial"), {
    signal: abort.signal, visit: async () => {}, wait: async () => abort.abort(),
    tap: () => taps++, speak: () => {}, change: () => {}, reveal: async () => {}, show: () => {}, guide: async () => {},
  }));
  assert.equal(taps, 0);
});

test("interrupting the touch pop prevents a late theme change", async () => {
  const abort = new AbortController();
  let taps = 0, changes = 0, guides = 0;
  await assert.rejects(runCatHeroTour(catThemeTourPlan(choices, "editorial"), {
    signal: abort.signal, visit: async () => {},
    wait: async ms => { if (ms === CAT_HERO_TOUCH_MS) abort.abort(); },
    tap: () => taps++, speak: () => {}, change: () => changes++,
    reveal: async () => {}, show: () => {}, guide: async () => guides++,
  }));
  assert.equal(taps, 1);
  assert.equal(changes, 0);
  assert.equal(guides, 0);
});

test("the next paw waits for the actual heading reveal, and cancellation cannot queue it", async () => {
  const abort = new AbortController(), trace = [];
  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const run = runCatHeroTour(catThemeTourPlan(choices, "editorial"), {
    signal: abort.signal, visit: async step => trace.push(`visit:${step.theme}`), wait: async () => {},
    tap: step => trace.push(`tap:${step.theme}`), speak: () => {}, change: () => {}, reveal: () => pending,
    show: () => trace.push("read"), guide: async () => trace.push("guide"),
  });
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(trace, ["visit:swiss", "tap:swiss"]);
  abort.abort(); finish();
  await assert.rejects(run);
  assert.deepEqual(trace, ["visit:swiss", "tap:swiss"]);
});

test("play selects a different theme or the opposite resolved color mode", () => {
  for (const current of choices) {
    for (const draw of [0, .3, .64]) {
      const plan = catThemePlayPlan(choices, current.id, "light", () => draw);
      assert.equal(plan.length, 1);
      assert.notEqual(plan[0].theme, current.id);
      assert.equal(plan[0].mode, undefined);
    }
    for (const appearance of ["light", "dark"]) {
      const [step] = catThemePlayPlan(choices, current.id, appearance, () => .9);
      assert.equal(step.theme, current.id);
      assert.equal(step.mode, appearance === "light" ? "dark" : "light");
    }
  }
});

test("only a different visitor choice counts as overriding the cat", () => {
  const [themeStep] = catThemePlayPlan(choices, "editorial", "light", () => 0);
  assert.equal(catThemePlayOverridden(themeStep, { theme: themeStep.theme }), false);
  assert.equal(catThemePlayOverridden(themeStep, { theme: "editorial" }), true);
  assert.equal(catThemePlayOverridden(themeStep, { mode: "dark" }), true);
  const [modeStep] = catThemePlayPlan(choices, "editorial", "light", () => .9);
  assert.equal(catThemePlayOverridden(modeStep, { mode: "dark" }), false);
  assert.equal(catThemePlayOverridden(modeStep, { mode: "system" }), true);
  assert.equal(catThemePlayOverridden(modeStep, { theme: "play" }), true);
});

test("occasional play waits for engaged viewing and a clear moment, with no background catch-up", () => {
  const cycle = new CatThemePlayCycle(() => 0);
  assert.equal(cycle.advance(35_000, true, true), false);
  for (let tick = 0; tick < 40; tick++) assert.equal(cycle.advance(1000, false, true), false);
  for (let tick = 0; tick < 35; tick++) assert.equal(cycle.advance(1000, true, false), false);
  assert.equal(cycle.advance(1000, true, true), true);
  for (let tick = 0; tick < 89; tick++) assert.equal(cycle.advance(1000, true, true), false);
  assert.equal(cycle.advance(1000, true, true), true);
});

test("visitor takeover postpones another automatic experiment for at least two minutes", () => {
  const cycle = new CatThemePlayCycle(() => 0);
  cycle.defer();
  for (let tick = 0; tick < 119; tick++) assert.equal(cycle.advance(1000, true, true), false);
  assert.equal(cycle.advance(1000, true, true), true);
});

test("picker play arrives before tapping and shows its single comment", async () => {
  const trace = [];
  const abort = new AbortController();
  const [step] = catThemePlayPlan(choices, "editorial", "light", () => 0);
  await runCatThemeTour([step], {
    signal: abort.signal,
    wait: async ms => { trace.push(`wait:${ms}`); },
    visit: async step => { trace.push(`arrive:${step.theme}`); },
    tap: step => { trace.push(`tap:${step.theme}`); },
    show: step => { trace.push(`show:${step.theme}`); },
  });
  assert.equal(trace[0], "wait:900");
  assert.equal(trace.filter(item => item.startsWith("tap:")).length, 1);
  for (const choice of [{ id: step.theme }]) {
    const tap = trace.indexOf(`tap:${choice.id}`);
    assert.equal(trace[tap - 1], `arrive:${choice.id}`);
    assert.equal(trace[tap + 2], `show:${choice.id}`);
    assert.equal(trace[tap + 3], "wait:2400");
  }
});

test("taking over during travel never triggers a late tap or later comment", async () => {
  const abort = new AbortController();
  const taps = [], comments = [];
  await assert.rejects(runCatThemeTour(catThemeTourPlan(choices, "play"), {
    signal: abort.signal, wait: async () => {},
    visit: async () => { abort.abort(); },
    tap: step => taps.push(step.theme), show: step => comments.push(step.text),
  }));
  assert.deepEqual(taps, []);
  assert.deepEqual(comments, []);
});

test("taking over after one tap prevents every remaining theme switch", async () => {
  const abort = new AbortController();
  const taps = [], comments = [];
  await assert.rejects(runCatThemeTour(catThemeTourPlan(choices, "play"), {
    signal: abort.signal, wait: async () => {}, visit: async () => {},
    tap: step => { taps.push(step.theme); abort.abort(); },
    show: step => comments.push(step.text),
  }));
  assert.equal(taps.length, 1);
  assert.deepEqual(comments, []);
});

test("a cancelled tour never even opens its first step", async () => {
  const abort = new AbortController(); abort.abort();
  let work = 0;
  await assert.rejects(runCatThemeTour(catThemeTourPlan(choices, "play"), {
    signal: abort.signal, wait: async () => work++, visit: async () => work++, tap: () => work++, show: () => work++,
  }));
  assert.equal(work, 0);
});

test("cursor reveals cover every corner on narrow and wide viewports", () => {
  for (const [width, height] of [[320, 568], [390, 844], [1280, 800], [2560, 1440]]) {
    for (const origin of [undefined, { x: 0, y: 0 }, { x: width, y: height }, { x: width / 3, y: height / 4 }]) {
      const circle = themeRevealCircle(origin, width, height);
      for (const x of [0, width]) for (const y of [0, height]) assert.ok(circle.radius > Math.hypot(x - circle.x, y - circle.y));
      if (origin) { assert.equal(circle.x, origin.x); assert.equal(circle.y, origin.y); }
    }
  }
});

test("invalid or out-of-viewport reveal origins stay finite and inside the viewport", () => {
  const invalid = themeRevealCircle({ x: NaN, y: Infinity }, 390, 844);
  assert.equal(invalid.x, 195); assert.equal(invalid.y, 422);
  const outside = themeRevealCircle({ x: -50, y: 2000 }, 390, 844);
  assert.equal(outside.x, 0); assert.equal(outside.y, 844);
  assert.ok(Number.isFinite(outside.radius));
});

test("snapshot click recovery matches only an available palette button at the actual pointer", () => {
  const makeButton = (left, disabled = false, inert = false) => ({
    disabled, closest: () => inert ? {} : null,
    getBoundingClientRect: () => ({ left, right: left + 44, top: 100, bottom: 144 }),
  });
  const available = makeButton(50), disabled = makeButton(100, true), inert = makeButton(150, false, true);
  const { themeControlAtPoint } = load("../lib/theme-reveal.ts", {
    document: { querySelectorAll: selector => {
      assert.equal(selector, '.appearance-dock[data-open="true"] [data-theme-option],.appearance-dock[data-open="true"] [data-mode-option]');
      return [available, disabled, inert];
    } },
  });
  assert.equal(themeControlAtPoint({ x: 72, y: 122 }), available);
  assert.equal(themeControlAtPoint({ x: 122, y: 122 }), undefined);
  assert.equal(themeControlAtPoint({ x: 172, y: 122 }), undefined);
  assert.equal(themeControlAtPoint({ x: 72, y: 90 }), undefined);
  assert.equal(themeControlAtPoint({ x: 220, y: 122 }), undefined);
});
