const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

const sourcePath = path.join(__dirname, "../lib/cat-behavior.ts");
const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const engineModule = { exports: {} };
vm.runInNewContext(compiled.outputText, {
  module: engineModule, exports: engineModule.exports, Date, setTimeout, clearTimeout,
}, { filename: sourcePath });
const { CatBehaviorController, CAT_REACTIONS } = engineModule.exports;

class FakeClock {
  time = 0;
  nextId = 0;
  tasks = new Map();
  now = () => this.time;
  setTimeout = (callback, delay) => {
    const id = ++this.nextId;
    this.tasks.set(id, { callback, at: this.time + delay });
    return id;
  };
  clearTimeout = id => this.tasks.delete(id);
  advance(milliseconds) {
    const target = this.time + milliseconds;
    for (;;) {
      const next = [...this.tasks.entries()].sort((a, b) => a[1].at - b[1].at)[0];
      if (!next || next[1].at > target) break;
      this.time = next[1].at;
      this.tasks.delete(next[0]);
      next[1].callback();
    }
    this.time = target;
  }
}

const context = { section: "playground", appearance: "light", theme: "blueprint" };
function harness(options = {}) {
  const clock = new FakeClock();
  const events = [];
  const controller = new CatBehaviorController(reaction => events.push(reaction), { clock, ...options });
  return { clock, events, controller, current: () => events.at(-1) };
}

test("a tour interruption gives one finite goodbye and direct feedback can replace it", () => {
  const h = harness();
  h.controller.signal("tour-stop", context);
  const first = h.current().text;
  assert.equal(h.current().action, undefined);
  h.clock.advance(3200);
  assert.equal(h.current(), null);
  h.controller.signal("tour-stop", context);
  assert.notEqual(h.current().text, first);
  h.controller.signal("pet", context);
  assert.equal(h.current().signal, "pet");
  assert.equal(h.clock.tasks.size, 1);
});

test("a higher priority event replaces one emotion and cancels its old timer", () => {
  const h = harness();
  h.controller.signal("welcome", context);
  h.clock.advance(1000);
  h.controller.signal("discovery", { ...context, count: 2 });
  assert.equal(h.current().emotion, "excited");
  assert.equal(h.clock.tasks.size, 1);
  h.clock.advance(CAT_REACTIONS.discovery.duration - 1000);
  assert.equal(h.current().signal, "discovery", "the interrupted welcome timer cannot clear the discovery");
  h.clock.advance(1000);
  assert.equal(h.current(), null);
  assert.deepEqual(h.events.filter(Boolean).map(event => event.signal), ["welcome", "discovery"]);
});

test("cooldowns prevent repeated reactions and copy rotates after the cooldown", () => {
  const h = harness({ cooldowns: { pet: 10_000 } });
  assert.equal(h.controller.signal("pet", context), true);
  const firstText = h.current().text;
  assert.equal(h.controller.signal("pet", context), false);
  h.clock.advance(CAT_REACTIONS.pet.duration);
  assert.equal(h.current(), null);
  assert.equal(h.controller.signal("pet", context), false);
  h.clock.advance(10_000 - CAT_REACTIONS.pet.duration);
  assert.equal(h.controller.signal("pet", context), true);
  assert.notEqual(h.current().text, firstText);
});

test("pending reactions are bounded at two and favor priority over stale chatter", () => {
  const h = harness({ maxPending: 99, pendingTtl: 60_000 });
  h.controller.signal("form-focus", context);
  h.controller.signal("hover", context);
  h.controller.signal("sleep", context);
  h.controller.signal("idle", context);
  h.controller.signal("section", context);
  h.clock.advance(40_000);
  assert.deepEqual(h.events.filter(Boolean).map(event => event.signal), ["form-focus", "section", "idle"]);
  assert.equal(h.clock.tasks.size, 0);
});

test("repeated pending signals coalesce to the latest context", () => {
  const h = harness({ pendingTtl: 60_000 });
  h.controller.signal("form-error", context);
  h.controller.signal("discovery", { ...context, count: 1 });
  h.controller.signal("discovery", { ...context, count: 4 });
  h.clock.advance(CAT_REACTIONS["form-error"].duration);
  assert.equal(h.current().context.count, 4);
  assert.match(h.current().text, /four|Every discovery/);
  assert.equal(h.events.filter(event => event?.signal === "discovery").length, 1);
});

test("old location events and expired pending reactions are dropped", () => {
  const h = harness({ pendingTtl: 1000 });
  h.controller.signal("form-focus", context);
  h.controller.signal("idle", context);
  h.clock.advance(CAT_REACTIONS["form-focus"].duration);
  assert.equal(h.current(), null);
  assert.deepEqual(h.events.filter(Boolean).map(event => event.signal), ["form-focus"]);

  const second = harness({ pendingTtl: 60_000 });
  second.controller.signal("form-focus", context);
  second.controller.signal("idle", context);
  second.controller.signal("section", { ...context, section: "work" });
  second.clock.advance(CAT_REACTIONS["form-focus"].duration);
  assert.equal(second.current().signal, "section");
  assert.equal(second.current().context.section, "work");
  second.clock.advance(CAT_REACTIONS.section.duration);
  assert.equal(second.current(), null);
  assert.equal(second.events.some(event => event?.signal === "idle"), false);
});

test("persistent prompts yield to important events without later resurfacing", () => {
  const h = harness();
  h.controller.signal("help", context);
  assert.equal(h.current().action, "explore");
  h.controller.signal("discovery", context);
  assert.equal(h.current().signal, "discovery");
  h.clock.advance(CAT_REACTIONS.discovery.duration);
  assert.equal(h.current(), null);
  assert.deepEqual(h.events.filter(Boolean).map(event => event.signal), ["help", "discovery"]);
});

test("suspension clears timers and events without replaying a welcome on resume", () => {
  const h = harness();
  h.controller.signal("welcome", context);
  h.controller.signal("idle", context);
  h.controller.suspend(true);
  assert.equal(h.current(), null);
  assert.equal(h.clock.tasks.size, 0);
  assert.equal(h.controller.signal("project", context), false);
  h.clock.advance(30_000);
  h.controller.suspend(false);
  assert.equal(h.current(), null);
  assert.equal(h.controller.signal("welcome", context), false);
  assert.equal(h.controller.signal("project", context), true);
});

test("destroy releases timers and prevents all future callbacks", () => {
  const h = harness();
  h.controller.signal("welcome", context);
  h.controller.destroy();
  const callbackCount = h.events.length;
  assert.equal(h.clock.tasks.size, 0);
  h.clock.advance(100_000);
  h.controller.dismiss();
  h.controller.suspend(false);
  assert.equal(h.controller.signal("discovery", context), false);
  assert.equal(h.events.length, callbackCount);
});

test("dismissal inside the callback does not leave a timer running", () => {
  const clock = new FakeClock();
  let controller;
  controller = new CatBehaviorController(reaction => { if (reaction) controller.dismiss(); }, { clock });
  controller.signal("welcome", context);
  assert.equal(clock.tasks.size, 0);
});

test("cursor cuddles wait for discoveries, expire once, and respect their cooldown", () => {
  const h = harness();
  h.controller.signal("discovery", context);
  h.controller.signal("cuddle", context);
  assert.equal(h.current().signal, "discovery", "cursor cuddles cannot interrupt a celebration");
  assert.equal(h.clock.tasks.size, 1);
  h.clock.advance(CAT_REACTIONS.discovery.duration);
  assert.equal(h.current().signal, "cuddle");
  assert.equal(h.current().emotion, "shy");
  h.clock.advance(CAT_REACTIONS.cuddle.duration);
  assert.equal(h.current(), null);
  assert.equal(h.controller.signal("cuddle", context), false);
  h.clock.advance(60_000 - CAT_REACTIONS.discovery.duration - CAT_REACTIONS.cuddle.duration);
  assert.equal(h.controller.signal("cuddle", context), true);
  assert.equal(h.events.filter(event => event?.signal === "cuddle").length, 2);
});

test("holding a bubble pauses its timer and resumes with exactly the remaining time", () => {
  const h = harness();
  h.controller.signal("pet", context);
  h.clock.advance(2000);
  h.controller.hold(true);
  assert.equal(h.clock.tasks.size, 0);
  h.clock.advance(20_000);
  h.controller.hold(true);
  assert.equal(h.current().signal, "pet");
  h.controller.hold(false);
  h.controller.hold(false);
  assert.equal(h.clock.tasks.size, 1, "repeated hover or focus events do not create extra timers");
  h.clock.advance(CAT_REACTIONS.pet.duration - 2001);
  assert.equal(h.current().signal, "pet");
  h.clock.advance(1);
  assert.equal(h.current(), null, "only the unconsumed 3.5 seconds run after reading ends");
});

test("preemption resets a held bubble so the new emotion expires normally", () => {
  const h = harness();
  h.controller.signal("welcome", context);
  h.clock.advance(1000);
  h.controller.hold(true);
  h.clock.advance(20_000);
  h.controller.signal("discovery", context);
  assert.equal(h.current().signal, "discovery");
  assert.equal(h.clock.tasks.size, 1, "a held welcome cannot hold its replacement");
  h.controller.hold(false);
  h.clock.advance(CAT_REACTIONS.discovery.duration);
  assert.equal(h.current(), null);
});

test("dismissal, suspension, and destruction clear a held reaction", () => {
  for (const exit of ["dismiss", "suspend", "destroy"]) {
    const h = harness();
    h.controller.signal("welcome", context);
    h.controller.hold(true);
    if (exit === "suspend") { h.controller.suspend(true); h.controller.suspend(false); }
    else h.controller[exit]();
    assert.equal(h.clock.tasks.size, 0);
    h.controller.hold(false);
    if (exit === "destroy") {
      assert.equal(h.controller.signal("project", context), false);
    } else {
      h.controller.signal("project", context);
      h.clock.advance(CAT_REACTIONS.project.duration);
      assert.equal(h.current(), null, `${exit} must not leave the next reaction held`);
    }
  }
});

test("holding an actionable prompt leaves it persistent without creating a timer", () => {
  const h = harness();
  h.controller.signal("help", context);
  h.controller.hold(true);
  h.clock.advance(60_000);
  h.controller.hold(false);
  assert.equal(h.current().signal, "help");
  assert.equal(h.clock.tasks.size, 0);
});

test("ordinary comments allow reading time, the brief goodbye expires, and help waits for dismissal", () => {
  for (const [signal, definition] of Object.entries(CAT_REACTIONS)) {
    if (signal === "tour-stop") { assert.equal(definition.duration, 3200); continue; }
    if (definition.action) assert.equal(definition.duration, 0);
    else assert.ok(definition.duration >= 5000 && definition.duration <= 7000);
  }
});

test("picking up the cat owns one rotating comment until it is put down", () => {
  const h = harness();
  h.controller.signal("discovery", { ...context, count: 4 });
  assert.equal(h.controller.signal("drag", context), true);
  const firstText = h.current().text;
  assert.equal(h.current().signal, "drag");
  assert.equal(h.clock.tasks.size, 1, "the pickup replaces the previous dismissal timer");
  h.controller.hold(true);
  h.clock.advance(30_000);
  assert.equal(h.current().signal, "drag", "a long carry keeps its pickup comment");
  assert.equal(h.clock.tasks.size, 0, "holding does not accumulate timers");
  h.controller.hold(false);
  h.clock.advance(CAT_REACTIONS.drag.duration - 1);
  assert.equal(h.current().signal, "drag");
  h.clock.advance(1);
  assert.equal(h.current(), null, "the comment closes after release");
  assert.equal(h.controller.signal("drag", context), true);
  assert.notEqual(h.current().text, firstText, "the next pickup has a different line without a cooldown");
});

test("section comments have independent cooldowns for each page area", () => {
  const h = harness();
  const visual = { ...context, location: "studio-visual" };
  const motion = { ...context, location: "studio-motion" };
  assert.equal(h.controller.signal("section", visual), true);
  assert.match(h.current().text, /moods|wardrobe/);
  h.clock.advance(CAT_REACTIONS.section.duration);
  assert.equal(h.controller.signal("section", motion), true, "the previous area does not silence this chapter");
  assert.match(h.current().text, /heart|response/);
  h.clock.advance(CAT_REACTIONS.section.duration);
  assert.equal(h.controller.signal("section", visual), false, "quickly returning to the same area stays quiet");
  h.clock.advance(35_000 - CAT_REACTIONS.section.duration * 2);
  assert.equal(h.controller.signal("section", visual), true);
});

test("pending comments from an earlier chapter do not follow the visitor to another chapter", () => {
  const h = harness();
  h.controller.signal("discovery", { ...context, location: "studio-visual" });
  h.controller.signal("section", { ...context, location: "studio-motion" });
  h.controller.signal("section", { ...context, location: "studio-ux" });
  h.clock.advance(CAT_REACTIONS.discovery.duration);
  assert.equal(h.current().context.location, "studio-ux");
  assert.match(h.current().text, /tablet/);
  h.clock.advance(CAT_REACTIONS.section.duration);
  assert.equal(h.current(), null);
  assert.equal(h.events.filter(event => event?.signal === "section").length, 1);
});

test("control comments describe the action, throttle repeated clicks, and yield to a discovery", () => {
  const h = harness();
  assert.equal(h.controller.signal("control-use", { ...context, interaction: "reference" }), true);
  assert.match(h.current().text, /Behind the scenes/);
  assert.equal(h.controller.signal("control-use", { ...context, interaction: "choice" }), false);
  h.controller.signal("discovery", { ...context, count: 1 });
  assert.equal(h.current().signal, "discovery");
  assert.equal(h.clock.tasks.size, 1);
  h.clock.advance(CAT_REACTIONS.discovery.duration);
  assert.equal(h.current(), null, "the earlier control comment does not replay after the success");
});
