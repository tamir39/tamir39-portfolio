const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const sourcePath = path.join(__dirname, "../lib/cat-activities.ts");
const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const activitiesModule = { exports: {} };
vm.runInNewContext(compiled.outputText, {
  module: activitiesModule, exports: activitiesModule.exports, Math, Number, Object,
}, { filename: sourcePath });
const { CatActivityCycle, CAT_ACTIVITY_DURATIONS } = activitiesModule.exports;

class FakeClock {
  now = 0;
  advance(milliseconds) { this.now += milliseconds; return this.now; }
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

test("first action waits three to five seconds after allowed foreground readiness", () => {
  for (const [random, delay] of [[() => 0, 3000], [() => 0.5, 4000], [() => 0.999999, 5000]]) {
    const clock = new FakeClock();
    const cycle = new CatActivityCycle(random);
    assert.equal(cycle.advance(clock.now, false), null);
    assert.equal(cycle.advance(clock.advance(60_000), true), null, "time before readiness does not shorten the initial wait");
    assert.equal(cycle.advance(clock.advance(delay - 1), true), null);
    assert.ok(cycle.advance(clock.advance(1), true));
  }
});

test("each activity has a complete finite duration, followed by a four-second minimum gap", () => {
  const clock = new FakeClock();
  const cycle = new CatActivityCycle(() => 0);
  cycle.advance(clock.now, true);
  const action = cycle.advance(clock.advance(3000), true);
  const duration = CAT_ACTIVITY_DURATIONS[action];
  assert.ok(duration >= 3000 && duration <= 5000);
  assert.equal(cycle.advance(clock.advance(duration - 1), true), action);
  assert.equal(cycle.advance(clock.advance(1), true), null);
  assert.equal(cycle.advance(clock.advance(3999), true), null);
  const next = cycle.advance(clock.advance(1), true);
  assert.ok(next);
  assert.notEqual(next, action);
});

test("the randomized quiet gap can extend to seven seconds", () => {
  const clock = new FakeClock();
  const cycle = new CatActivityCycle(() => 0.999999);
  cycle.advance(clock.now, true);
  const action = cycle.advance(clock.advance(5000), true);
  assert.equal(cycle.advance(clock.advance(CAT_ACTIVITY_DURATIONS[action]), true), null);
  assert.equal(cycle.advance(clock.advance(6999), true), null);
  assert.ok(cycle.advance(clock.advance(1), true));
});

test("the shuffled bag plays every activity once and prevents repeats across bag boundaries", () => {
  const clock = new FakeClock();
  const cycle = new CatActivityCycle(seededRandom(39));
  const actions = [];
  const expected = Object.keys(CAT_ACTIVITY_DURATIONS).sort();
  cycle.advance(clock.now, true);
  for (let count = 0; count < expected.length * 5; count++) {
    const action = cycle.advance(clock.advance(12_000), true);
    assert.ok(action);
    if (actions.length) assert.notEqual(action, actions.at(-1));
    actions.push(action);
    assert.equal(cycle.advance(clock.advance(CAT_ACTIVITY_DURATIONS[action]), true), null);
  }
  for (let start = 0; start < actions.length; start += expected.length) {
    assert.deepEqual([...new Set(actions.slice(start, start + expected.length))].sort(), expected);
  }
});

test("blocking immediately cancels an activity and starts a fresh readiness wait", () => {
  const clock = new FakeClock();
  const cycle = new CatActivityCycle(() => 0);
  cycle.advance(clock.now, true);
  const action = cycle.advance(clock.advance(3000), true);
  assert.ok(action);
  assert.equal(cycle.advance(clock.advance(1000), false), null);
  assert.equal(cycle.advance(clock.advance(60_000), false), null);
  assert.equal(cycle.advance(clock.advance(1000), true), null, "an interrupted activity never resumes");
  assert.equal(cycle.advance(clock.advance(2999), true), null);
  const next = cycle.advance(clock.advance(1), true);
  assert.ok(next);
  assert.notEqual(next, action);
});

test("reset cancels waiting or active work and uses a fresh readiness wait", () => {
  const clock = new FakeClock();
  const cycle = new CatActivityCycle(() => 0);
  cycle.advance(clock.now, true);
  cycle.reset(clock.advance(5000));
  assert.equal(cycle.advance(clock.advance(5000), true), null);
  assert.equal(cycle.advance(clock.advance(2999), true), null);
  const first = cycle.advance(clock.advance(1), true);
  assert.ok(first);
  cycle.reset(clock.advance(1));
  assert.equal(cycle.advance(clock.now, true), null);
  const second = cycle.advance(clock.advance(3000), true);
  assert.ok(second);
  assert.notEqual(second, first, "reset does not erase the anti-repeat bag");
});

test("late ticks start one full action and never catch up missed actions in a burst", () => {
  const clock = new FakeClock();
  const cycle = new CatActivityCycle(() => 0);
  cycle.advance(clock.now, true);
  const action = cycle.advance(clock.advance(600_000), true);
  assert.ok(action);
  assert.equal(cycle.advance(clock.now, true), action, "repeated ticks at one timestamp keep the same action");
  assert.equal(cycle.advance(clock.advance(CAT_ACTIVITY_DURATIONS[action] - 1), true), action);
  assert.equal(cycle.advance(clock.advance(600_000), true), null, "a late expiry creates a fresh gap rather than another immediate action");
  assert.equal(cycle.advance(clock.now, true), null);
  assert.equal(cycle.advance(clock.advance(3999), true), null);
  assert.ok(cycle.advance(clock.advance(1), true));
});

test("the same injected random stream produces the same activity sequence", () => {
  function sequence(seed) {
    const clock = new FakeClock();
    const cycle = new CatActivityCycle(seededRandom(seed));
    const result = [];
    cycle.advance(clock.now, true);
    for (let count = 0; count < 15; count++) {
      const action = cycle.advance(clock.advance(12_000), true);
      result.push(action);
      cycle.advance(clock.advance(CAT_ACTIVITY_DURATIONS[action]), true);
    }
    return result;
  }
  assert.deepEqual(sequence(39), sequence(39));
  assert.notDeepEqual(sequence(39), sequence(500));
});

test("clock corrections cannot replay work and invalid timestamps cancel safely", () => {
  const cycle = new CatActivityCycle(() => 0);
  cycle.advance(1000, true);
  const action = cycle.advance(4000, true);
  assert.ok(action);
  assert.equal(cycle.advance(0, true), action);
  assert.equal(cycle.advance(NaN, true), null);
  assert.equal(cycle.advance(8000, true), null);
  assert.equal(cycle.advance(10_999, true), null);
  assert.ok(cycle.advance(11_000, true));
});

test("all metadata durations allow a visible three-to-five-second action", () => {
  assert.equal(Object.keys(CAT_ACTIVITY_DURATIONS).length, 8);
  for (const duration of Object.values(CAT_ACTIVITY_DURATIONS)) assert.ok(duration >= 3000 && duration <= 5000);
});

test("requested actions start immediately, finish once, and share the nonrepeating bag", () => {
  const cycle = new CatActivityCycle(seededRandom(39));
  const seen = [];
  let now = 0;
  for (const ignored of Object.keys(CAT_ACTIVITY_DURATIONS)) {
    const action = cycle.play(now);
    seen.push(action);
    assert.equal(cycle.advance(now + CAT_ACTIVITY_DURATIONS[action] - 1, true), action);
    now += CAT_ACTIVITY_DURATIONS[action];
    assert.equal(cycle.advance(now, true), null);
  }
  assert.equal(new Set(seen).size, Object.keys(CAT_ACTIVITY_DURATIONS).length);
  const action = cycle.play(now);
  assert.equal(cycle.advance(now + 100, false), null, "a pet or pause can still cancel a requested action");
  assert.equal(cycle.advance(now + CAT_ACTIVITY_DURATIONS[action], true), null);
});
