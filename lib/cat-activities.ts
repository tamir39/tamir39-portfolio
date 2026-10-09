export type CatActivity = "groom" | "eat" | "scratch" | "cloth" | "stretch" | "yawn" | "sniff" | "wave";

/** Each animation gets a complete, finite moment before the next quiet interval. */
export const CAT_ACTIVITY_DURATIONS: Readonly<Record<CatActivity, number>> = Object.freeze({
  groom: 4200,
  eat: 4800,
  scratch: 3600,
  cloth: 4800,
  stretch: 3400,
  yawn: 3800,
  sniff: 3600,
  wave: 3840,
});

const activities: readonly CatActivity[] = ["groom", "eat", "scratch", "cloth", "stretch", "yawn", "sniff", "wave"];

/**
 * A clock-free activity cycle: the caller supplies foreground readiness and time.
 * Blocking cancels rather than pauses; late ticks never replay missed actions.
 */
export class CatActivityCycle {
  private bag: CatActivity[] = [];
  private previous: CatActivity | null = null;
  private phase: "blocked" | "waiting" | "active" = "blocked";
  private activity: CatActivity | null = null;
  private deadline = 0;
  private lastNow: number | null = null;

  constructor(private readonly random: () => number = Math.random) {}

  /** An explicit visitor request uses the same bag, duration, and cancellation rules. */
  play(now: number): CatActivity {
    this.reset(now);
    const time = Number.isFinite(now) ? now : 0;
    this.activity = this.nextActivity();
    this.phase = "active";
    this.deadline = time + CAT_ACTIVITY_DURATIONS[this.activity];
    return this.activity;
  }

  advance(now: number, allowed: boolean): CatActivity | null {
    if (!Number.isFinite(now)) {
      this.cancel();
      return null;
    }
    // A clock correction must not make an animation run backward or replay it.
    const time = Math.max(now, this.lastNow ?? now);
    this.lastNow = time;
    if (!allowed) {
      this.cancel();
      return null;
    }

    if (this.phase === "blocked") {
      this.phase = "waiting";
      this.deadline = time + this.delay(3000, 5000);
      return null;
    }

    if (this.phase === "active") {
      if (time < this.deadline) return this.activity;
      this.activity = null;
      this.phase = "waiting";
      this.deadline = time + this.delay(4000, 7000);
      return null;
    }

    if (time < this.deadline) return null;
    this.activity = this.nextActivity();
    this.phase = "active";
    this.deadline = time + CAT_ACTIVITY_DURATIONS[this.activity];
    return this.activity;
  }

  /** Restart readiness without forgetting which activities have already played. */
  reset(now: number): void {
    this.cancel();
    this.lastNow = Number.isFinite(now) ? now : null;
  }

  private cancel(): void {
    this.activity = null;
    this.phase = "blocked";
    this.deadline = 0;
  }

  private delay(minimum: number, maximum: number): number {
    return Math.round(minimum + (maximum - minimum) * this.draw());
  }

  private draw(): number {
    const value = this.random();
    return Number.isFinite(value) ? Math.min(0.999999999, Math.max(0, value)) : 0;
  }

  private nextActivity(): CatActivity {
    if (this.bag.length === 0) {
      this.bag = [...activities];
      for (let index = this.bag.length - 1; index > 0; index--) {
        const other = Math.floor(this.draw() * (index + 1));
        [this.bag[index], this.bag[other]] = [this.bag[other], this.bag[index]];
      }
      if (this.bag[0] === this.previous) {
        const other = 1 + Math.floor(this.draw() * (this.bag.length - 1));
        [this.bag[0], this.bag[other]] = [this.bag[other], this.bag[0]];
      }
    }
    const next = this.bag.shift()!;
    this.previous = next;
    return next;
  }
}
