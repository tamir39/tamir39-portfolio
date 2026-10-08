/** One scheduler owns the cat's reactions; page components only publish signals. */
export type CatEmotion =
  | "welcome" | "happy" | "curious" | "confused" | "helpful" | "excited"
  | "sleepy" | "suspicious" | "shy" | "thinking" | "oops";

export type CatSignal =
  | "welcome" | "section" | "project" | "discovery" | "pet" | "drag" | "cuddle" | "hover"
  | "idle" | "sleep" | "return" | "scroll-fast" | "theme-change"
  | "appearance-change" | "appearance-suggest" | "theme-suggest" | "help" | "form-focus"
  | "form-success" | "form-error" | "control-hover" | "control-use";

export type CatInteraction = "navigate" | "appearance" | "play" | "choice" | "reference" | "media" | "button" | "link";

export interface CatContext {
  section: string;
  /** Local page area; only the broad section enum is sent to optional AI. */
  location?: string;
  interaction?: CatInteraction;
  appearance: "light" | "dark";
  theme: string;
  count?: number;
}

export interface CatReaction {
  id: string;
  signal: CatSignal;
  emotion: CatEmotion;
  text: string;
  priority: number;
  /** Milliseconds; zero means this actionable prompt waits for dismissal. */
  duration: number;
  action?: "switch-appearance" | "switch-theme" | "explore";
  context: CatContext;
}

export interface CatClock {
  now(): number;
  setTimeout(callback: () => void, delay: number): unknown;
  clearTimeout(timer: unknown): void;
}

export interface CatBehaviorOptions {
  clock?: CatClock;
  cooldowns?: Partial<Record<CatSignal, number>>;
  /** Zero to disable pending reactions. Values above two are capped at two. */
  maxPending?: number;
  pendingTtl?: number;
}

type Relevance = "global" | "section" | "appearance" | "theme";
interface ReactionDefinition {
  emotion: CatEmotion;
  priority: number;
  duration: number;
  cooldown: number;
  relevance: Relevance;
  action?: CatReaction["action"];
  lines: readonly string[] | ((context: CatContext) => readonly string[]);
}

const sectionLines: Record<string, readonly string[]> = {
  intro: ["Hello. I’m the small, unpaid supervisor.", "Design, code, and one very curious cat. Welcome."],
  playground: ["Try a little interaction. I’m here for moral support.", "This is the playground. Curiosity is the only entry requirement."],
  work: ["Real projects. I take credit for the good bits.", "Something catch your eye? Open a project and have a look."],
  about: ["The human behind the work. I trained him myself.", "A little about Tamir. My biography is mostly naps."],
  contact: ["Got an idea? Tamir would love to hear it.", "This is where a good conversation can start."],
  "studio-visual": ["Five moods, one studio. Which one feels like you?", "A wardrobe change for the whole page. Very dramatic."],
  "studio-motion": ["Try the little heart. I approve of anything that purrs back.", "A small action deserves a little response."],
  "studio-ux": ["Give the tablet a turn. Even ideas need room to stretch.", "Same idea, a little more room. Try the tablet."],
  "studio-components": ["That little note can move. I checked with my paw.", "Small pieces, working together. Like a very organized litter."],
  "studio-workflow": ["An idea, a plan, then something real. I supervise the pauses.", "Keep scrolling. You can follow this idea into the browser."],
  "studio-practice": ["Learn the rules. Add a little you. That’s the interesting bit.", "Good guidance, your own decisions. Leave a little pawprint."],
  games: ["Unity and Godot. Different worlds, same curious human.", "Games! Finally, a professional excuse to play."],
  independent: ["A few ideas Tamir couldn’t leave as ideas.", "Small experiments can grow into useful things."],
  academic: ["From class to something you can actually use. Homework with ambition.", "A little theory, a lot of building."],
  focus: ["Design and code share a desk here. I have claimed the keyboard.", "The details matter. So does the whole journey."],
  approach: ["Understand, explore, bring it to life. Nap breaks are implied.", "Curiosity first. Thoughtful decisions all the way through."],
};

const controlHoverLines: Record<CatInteraction, readonly string[]> = {
  navigate: ["Thinking of heading that way? I’m coming too."],
  appearance: ["Picking a new mood? I’m ready for my makeover."],
  play: ["Go on, give it a try. I’ll supervise the experiment."],
  choice: ["Considering the options? A very serious little investigation."],
  reference: ["Curious about the thinking behind it? Take a peek."],
  media: ["Movie time? I’ll bring the imaginary snacks."],
  button: ["That button has your attention. Mine too, apparently."],
  link: ["Something interesting over there? I’m all ears."],
};
const controlUseLines: Record<CatInteraction, readonly string[]> = {
  navigate: ["Lead the way. Tiny paws, ready."],
  appearance: ["A change of scenery. Very good for the whiskers."],
  play: ["A little experiment! That’s what this corner is for."],
  choice: ["Trying another option? That’s how good ideas happen."],
  reference: ["Behind the scenes! My favourite place to take credit."],
  media: ["Showtime. I’ll try not to sit in front of the screen."],
  button: ["You found a button. I found a reason to supervise."],
  link: ["A closer look? Leave room for one small cat."],
};

/** Copy, priorities, timing, and cooldowns live together instead of in listeners. */
export const CAT_REACTIONS: Readonly<Record<CatSignal, ReactionDefinition>> = {
  welcome: { emotion: "welcome", priority: 20, duration: 8500, cooldown: 3_600_000, relevance: "global", lines: ["Oh. A human. Welcome!", "Welcome to Tamir’s little studio. I’ll show you around."] },
  section: { emotion: "curious", priority: 25, duration: 8500, cooldown: 35_000, relevance: "section", lines: context => sectionLines[context.location ?? ""] ?? sectionLines[context.section] ?? ["A new corner to explore. I’ll come with you.", "Take a look around. I’m keeping you company."] },
  project: { emotion: "happy", priority: 45, duration: 8000, cooldown: 18_000, relevance: "section", lines: ["Excellent taste. I supervised.", "A closer look? Now you’re speaking my language.", "That one has a story. Go on, have a look."] },
  discovery: { emotion: "excited", priority: 80, duration: 8500, cooldown: 3000, relevance: "global", lines: context => context.count !== undefined && context.count >= 4 ? ["All four discoveries! You’ve earned my most enthusiastic purr.", "Every discovery unlocked. I knew you had it in you!"] : ["You did it! We did it. Mostly you.", "A new discovery. Cue the tiny victory dance.", "Curiosity rewarded. Nicely done!"] },
  pet: { emotion: "shy", priority: 55, duration: 7500, cooldown: 4500, relevance: "global", lines: ["Professional assistant. Amateur loaf.", "Oh. Attention. My one weakness.", "Purr received. Productivity temporarily suspended."] },
  drag: { emotion: "oops", priority: 110, duration: 7500, cooldown: 0, relevance: "global", lines: ["Airborne! I did not file a flight plan.", "Oh, we’re travelling first class. Carry on.", "Precious cargo. Please mind the whiskers.", "A surprise relocation? My assistant will hear about this."] },
  cuddle: { emotion: "shy", priority: 35, duration: 7000, cooldown: 60_000, relevance: "section", lines: ["Just checking whether this cursor gives good head scratches.", "A little cursor cuddle. Strictly professional.", "This cursor looked like it could use some company."] },
  hover: { emotion: "suspicious", priority: 10, duration: 7500, cooldown: 60_000, relevance: "section", lines: ["That cursor looks suspiciously pettable.", "I see you over there. Very interesting."] },
  idle: { emotion: "curious", priority: 12, duration: 8500, cooldown: 120_000, relevance: "section", lines: ["Reading? Take your time. I’ll keep you company.", "A thoughtful pause. I respect the technique.", "Still here if you need a little direction."] },
  sleep: { emotion: "sleepy", priority: 5, duration: 8500, cooldown: 180_000, relevance: "section", lines: ["I’ll guard the page. Horizontally.", "Take your time. I’m testing the nap feature."] },
  return: { emotion: "welcome", priority: 30, duration: 7500, cooldown: 120_000, relevance: "global", lines: ["You’re back! I definitely wasn’t sleeping.", "Welcome back. Your spot is still here."] },
  "scroll-fast": { emotion: "oops", priority: 15, duration: 7500, cooldown: 90_000, relevance: "section", lines: ["Tiny legs. Big scroll energy.", "Keeping up. Barely. Don’t mind me."] },
  "theme-change": { emotion: "happy", priority: 35, duration: 8000, cooldown: 35_000, relevance: "theme", lines: ["New mood, same excellent assistant.", "A little change of scenery. I approve.", "The whole studio got dressed up."] },
  "appearance-change": { emotion: "happy", priority: 40, duration: 8000, cooldown: 45_000, relevance: "appearance", lines: context => context.appearance === "dark" ? ["Night shift. My whiskers are ready.", "A cozy little evening in the studio."] : ["Hello, sunshine. Well, screen-shine.", "A fresh little change of light."] },
  "appearance-suggest": { emotion: "curious", priority: 40, duration: 0, cooldown: 900_000, relevance: "appearance", action: "switch-appearance", lines: context => context.appearance === "dark" ? ["We’ve been in dark mode a while. Fancy a little light?", "Want a change of scenery? Try the light side of the studio."] : ["We’ve been in light mode a while. Fancy a cozier view?", "Want a change of scenery? Try the dark side of the studio."] },
  "theme-suggest": { emotion: "curious", priority: 30, duration: 0, cooldown: 0, relevance: "theme", action: "switch-theme", lines: ["Fancy a wardrobe change? The whole page has a few.", "Same work, a different mood. Want to try another look?", "I’m ready for a tiny makeover. Shall we try a new theme?"] },
  help: { emotion: "helpful", priority: 65, duration: 0, cooldown: 15_000, relevance: "section", action: "explore", lines: ["Try the playground. I’ll point you toward something to explore.", "Need a place to start? There are little discoveries in the playground."] },
  "form-focus": { emotion: "thinking", priority: 60, duration: 8000, cooldown: 180_000, relevance: "section", lines: ["An idea in progress. I’ll keep my paws off the keyboard.", "You write. I’ll handle the moral support.", "Take your time. Good ideas deserve a little room."] },
  "form-success": { emotion: "happy", priority: 95, duration: 8500, cooldown: 8000, relevance: "global", lines: ["Message sent. I’ll leave the reply to Tamir.", "Your message is on its way. Thanks for reaching out."] },
  "form-error": { emotion: "helpful", priority: 100, duration: 9000, cooldown: 8000, relevance: "section", lines: ["Your message wasn’t sent. Check the form feedback before trying again.", "Review the form feedback, then try sending your message again."] },
  "control-hover": { emotion: "curious", priority: 18, duration: 7500, cooldown: 22_000, relevance: "section", lines: context => controlHoverLines[context.interaction ?? "button"] },
  "control-use": { emotion: "happy", priority: 42, duration: 7500, cooldown: 12_000, relevance: "section", lines: context => controlUseLines[context.interaction ?? "button"] },
};

interface PendingReaction {
  signal: CatSignal;
  context: CatContext;
  queuedAt: number;
  expiresAt: number;
  order: number;
}

const browserClock: CatClock = {
  now: () => Date.now(),
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: timer => clearTimeout(timer as ReturnType<typeof setTimeout>),
};

/**
 * Higher priority reactions interrupt; the interrupted reaction never returns.
 * At most two relevant events wait, and dismissal clears them for a quiet exit.
 */
export class CatBehaviorController {
  private readonly clock: CatClock;
  private readonly cooldowns: Partial<Record<CatSignal, number>>;
  private readonly maxPending: number;
  private readonly pendingTtl: number;
  private active: CatReaction | null = null;
  private pending: PendingReaction[] = [];
  private latestContext: CatContext | null = null;
  private lastAccepted = new Map<string, number>();
  private shown = new Map<CatSignal, number>();
  private timer: unknown;
  private expiresAt: number | null = null;
  private remaining = 0;
  private held = false;
  private sequence = 0;
  private queuedSequence = 0;
  private suspended = false;
  private destroyed = false;

  constructor(
    private readonly onReaction: (reaction: CatReaction | null) => void,
    options: CatBehaviorOptions = {},
  ) {
    this.clock = options.clock ?? browserClock;
    this.cooldowns = options.cooldowns ?? {};
    this.maxPending = Math.min(2, Math.max(0, Math.floor(options.maxPending ?? 2)));
    this.pendingTtl = Math.max(0, options.pendingTtl ?? 14_000);
  }

  signal(signal: CatSignal, context: CatContext): boolean {
    if (this.destroyed || this.suspended) return false;
    const now = this.clock.now();
    this.latestContext = { ...context };
    this.prunePending(now);

    // A changed appearance or location invalidates an old actionable prompt.
    if (this.active?.action && !this.isRelevant(this.active.signal, this.active.context)) {
      this.clearActive();
      if (this.destroyed || this.suspended) return false;
    }

    const definition = CAT_REACTIONS[signal];
    const cooldownKey = signal === "appearance-suggest" ? `${signal}:${context.appearance}` : signal === "section" ? `${signal}:${context.location ?? context.section}` : signal;
    const last = this.lastAccepted.get(cooldownKey);
    const cooldown = Math.max(0, this.cooldowns[signal] ?? definition.cooldown);
    const queued = this.pending.find(item => item.signal === signal);
    if (queued) {
      // Keep only the latest context, without extending the event's lifetime.
      queued.context = { ...context };
      if (!this.active) this.showNext();
      return true;
    }
    if (last !== undefined && now - last < cooldown) {
      if (!this.active) this.showNext();
      return false;
    }

    if (!this.active || definition.priority > this.active.priority) {
      this.lastAccepted.set(cooldownKey, now);
      this.show(signal, context);
      return true;
    }

    if (this.maxPending === 0 || this.pendingTtl === 0) return false;
    const candidate: PendingReaction = {
      signal, context: { ...context }, queuedAt: now,
      expiresAt: now + this.pendingTtl, order: ++this.queuedSequence,
    };
    const next = [...this.pending, candidate]
      .sort((a, b) => CAT_REACTIONS[b.signal].priority - CAT_REACTIONS[a.signal].priority || b.order - a.order)
      .slice(0, this.maxPending);
    if (!next.includes(candidate)) return false;
    this.pending = next;
    this.lastAccepted.set(cooldownKey, now);
    return true;
  }

  /** Reading or focusing a bubble preserves the ordinary reaction's remaining time. */
  hold(held: boolean): void {
    if (this.destroyed || this.suspended || !this.active || this.active.action || this.active.duration <= 0 || this.held === held) return;
    this.held = held;
    if (held) {
      this.remaining = Math.min(this.active.duration, Math.max(0, this.expiresAt === null ? this.remaining : this.expiresAt - this.clock.now()));
      this.cancelTimer();
    } else {
      this.scheduleExpiry(this.active, this.remaining);
    }
  }

  /** Explicit dismissal also discards waiting chatter. */
  dismiss(): void {
    if (this.destroyed) return;
    this.pending = [];
    this.clearActive();
  }

  /** Hidden tabs, menus, and explicit pause clear the entire scheduler. */
  suspend(suspended: boolean): void {
    if (this.destroyed || this.suspended === suspended) return;
    this.suspended = suspended;
    if (suspended) {
      this.pending = [];
      this.clearActive();
    }
  }

  /** Detaches silently so component cleanup cannot trigger another render. */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.cancelTimer();
    this.held = false;
    this.remaining = 0;
    this.active = null;
    this.pending = [];
    this.lastAccepted.clear();
    this.shown.clear();
    this.latestContext = null;
  }

  private show(signal: CatSignal, context: CatContext): void {
    this.cancelTimer();
    this.held = false;
    const definition = CAT_REACTIONS[signal];
    this.remaining = definition.duration;
    const lines = typeof definition.lines === "function" ? definition.lines(context) : definition.lines;
    const count = this.shown.get(signal) ?? 0;
    this.shown.set(signal, count + 1);
    const reaction: CatReaction = {
      id: `cat-${++this.sequence}`, signal,
      emotion: definition.emotion, text: lines[count % lines.length],
      priority: definition.priority, duration: definition.duration,
      ...(definition.action ? { action: definition.action } : {}),
      context: { ...context },
    };
    this.active = reaction;
    this.onReaction(reaction);
    // The callback may dismiss, suspend, or destroy the controller immediately.
    if (this.destroyed || this.suspended || this.active !== reaction) return;
    if (reaction.duration > 0 && !this.held && this.timer === undefined) this.scheduleExpiry(reaction, this.remaining);
  }

  private scheduleExpiry(reaction: CatReaction, milliseconds: number): void {
    this.cancelTimer();
    this.remaining = Math.max(0, milliseconds);
    this.expiresAt = this.clock.now() + this.remaining;
    this.timer = this.clock.setTimeout(() => {
      if (this.destroyed || this.suspended || this.active?.id !== reaction.id) return;
      this.timer = undefined;
      this.expiresAt = null;
      this.remaining = 0;
      this.clearActive();
      this.showNext();
    }, this.remaining);
  }

  private clearActive(): void {
    this.cancelTimer();
    this.held = false;
    this.remaining = 0;
    if (!this.active) return;
    this.active = null;
    this.onReaction(null);
  }

  private cancelTimer(): void {
    if (this.timer !== undefined) this.clock.clearTimeout(this.timer);
    this.timer = undefined;
    this.expiresAt = null;
  }

  private showNext(): void {
    if (this.destroyed || this.suspended || this.active) return;
    this.prunePending(this.clock.now());
    const next = this.pending.shift();
    if (next) this.show(next.signal, next.context);
  }

  private prunePending(now: number): void {
    this.pending = this.pending.filter(item => item.expiresAt > now && this.isRelevant(item.signal, item.context));
  }

  private isRelevant(signal: CatSignal, context: CatContext): boolean {
    if (!this.latestContext) return true;
    switch (CAT_REACTIONS[signal].relevance) {
      case "section": return context.section === this.latestContext.section && (!context.location || !this.latestContext.location || context.location === this.latestContext.location);
      case "appearance": return context.appearance === this.latestContext.appearance;
      case "theme": return context.theme === this.latestContext.theme;
      default: return true;
    }
  }
}
