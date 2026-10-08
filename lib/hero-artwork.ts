import type { ThemeId } from "./themes";

type Point = { x: number; y: number };
type Vec3 = [number, number, number];
type Mesh = Vec3[][];
type Pulse = Point & { time: number };
type Sphere = Point & { vx: number; vy: number; radius: number; homeX: number; homeY: number; color: string };
export type HeroScene = { activate: (point?: Point) => string; dispose: () => void };

const TAU = Math.PI * 2;
const forms = ["Cube", "Sphere", "Cylinders"];
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));

function cubeMesh(): Mesh {
  const mesh: Mesh = [];
  for (let axis = 0; axis < 3; axis++) {
    const a = (axis + 1) % 3, b = (axis + 2) % 3;
    for (const face of [-1, 1]) for (let step = -3; step <= 3; step++) {
      for (const direction of [a, b]) {
        const start: Vec3 = [0, 0, 0], end: Vec3 = [0, 0, 0];
        start[axis] = end[axis] = face;
        start[direction] = -1; end[direction] = 1;
        start[direction === a ? b : a] = end[direction === a ? b : a] = step / 3;
        mesh.push([start, end]);
      }
    }
  }
  return mesh;
}

function sphereMesh(): Mesh {
  const mesh: Mesh = [];
  for (let latitude = 1; latitude < 12; latitude++) {
    const phi = latitude / 12 * Math.PI;
    mesh.push(Array.from({ length: 65 }, (_, i) => {
      const theta = i / 64 * TAU;
      return [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)] as Vec3;
    }));
  }
  for (let longitude = 0; longitude < 18; longitude++) {
    const theta = longitude / 18 * TAU;
    mesh.push(Array.from({ length: 65 }, (_, i) => {
      const phi = i / 64 * TAU;
      return [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)] as Vec3;
    }));
  }
  return mesh;
}

function cylinderMesh(): Mesh {
  const mesh: Mesh = [];
  for (let cylinder = 0; cylinder < 3; cylinder++) {
    const offset = (cylinder - 1) * .76;
    const top = -.85 + cylinder * .12, bottom = .85 - cylinder * .12;
    for (let ring = 0; ring < 5; ring++) mesh.push(Array.from({ length: 49 }, (_, i) => {
      const angle = i / 48 * TAU;
      return [offset + Math.cos(angle) * .3, top + (bottom - top) * ring / 4, Math.sin(angle) * .3] as Vec3;
    }));
    for (let side = 0; side < 12; side++) {
      const angle = side / 12 * TAU;
      mesh.push([[offset + Math.cos(angle) * .3, top, Math.sin(angle) * .3], [offset + Math.cos(angle) * .3, bottom, Math.sin(angle) * .3]]);
    }
  }
  return mesh;
}

const meshes = [cubeMesh(), sphereMesh(), cylinderMesh()];

function mix(a: string, b: string, amount: number) {
  const channels = (hex: string) => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
  const start = channels(a), end = channels(b);
  return `rgb(${start.map((value, i) => Math.round(value + (end[i] - value) * amount)).join(",")})`;
}

/** Original Canvas 2D treatments, sharing one lifecycle and no per-frame React state. */
export function createHeroScene(canvas: HTMLCanvasElement, theme: ThemeId, reduced: boolean): HeroScene {
  const context = canvas.getContext("2d");
  const parent = canvas.closest<HTMLElement>(".hero-layout");
  if (!context || !parent) return { activate: () => forms[0], dispose: () => {} };
  const ctx = context;
  const styles = getComputedStyle(document.documentElement);
  const color = (name: string) => styles.getPropertyValue(name).trim();
  const palette = { accent: color("--color-accent"), line: color("--theme-line"), ink: color("--color-ink"), paper: color("--color-paper") };
  const dark = document.documentElement.dataset.appearance === "dark";
  const mask = document.createElement("canvas");
  const maskCtx = mask.getContext("2d")!;
  let width = 1, height = 1, rect = canvas.getBoundingClientRect();
  let frame = 0, elapsed = 0, lastTime = 0, visible = false, disposed = false;
  let shape = 0, previousShape = 0, shapeTime = -10, interactions = 0;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 };
  const pulses: Pulse[] = [];
  let spheres: Sphere[] = [];

  function makeSpheres() {
    const homes = [[.27, .17, 23], [.50, .15, 42], [.80, .09, 21], [.95, .10, 32], [.57, .84, 28], [.90, .88, 19], [.10, .86, 26]];
    const colors = dark ? ["#b896ef", "#f1d57c", "#f3e6cb"] : ["#6331a7", "#edc751", "#f1e6ce"];
    const scale = Math.min(width / 1137, height / 490, 1.15);
    spheres = homes.map(([x, y, radius], i) => ({ x: x * width, y: y * height, homeX: x * width, homeY: y * height, radius: radius * scale, vx: 0, vy: 0, color: colors[i % colors.length] }));
  }

  function resize() {
    rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const changed = Math.abs(width - rect.width) > 1 || Math.abs(height - rect.height) > 1;
    width = rect.width; height = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    mask.width = Math.ceil(width); mask.height = Math.ceil(height);
    // Fade only the canvas edges; artwork stays continuous beneath the content.
    const edge = maskCtx.createLinearGradient(0, 0, 0, height);
    edge.addColorStop(0, "black"); edge.addColorStop(.055, "transparent"); edge.addColorStop(.92, "transparent"); edge.addColorStop(1, "black");
    maskCtx.fillStyle = edge; maskCtx.fillRect(0, 0, width, height);
    if (changed) {
      makeSpheres();
      pointer.x = pointer.targetX = width * .54;
      pointer.y = pointer.targetY = height * .18;
    }
    paint();
  }

  function deform(x: number, y: number, amount = 1): Point {
    const dx = x - pointer.x, dy = y - pointer.y;
    const distance = Math.hypot(dx, dy) || 1;
    const pull = Math.exp(-distance * distance / 33000) * pointer.strength * .2 * amount;
    let wave = 0;
    for (const pulse of pulses) {
      const age = elapsed - pulse.time;
      const delta = Math.hypot(x - pulse.x, y - pulse.y) - age * 330;
      wave += Math.sin(delta * .045) * Math.exp(-delta * delta / 5600) * (1 - age / 2.5) * 24;
    }
    return { x: x - dx * pull + dx / distance * wave * amount, y: y - dy * pull + dy / distance * wave * amount };
  }

  function paths() {
    ctx.lineWidth = .85;
    ctx.strokeStyle = palette.accent;
    for (let line = 0; line < 34; line++) {
      ctx.beginPath();
      const lower = line > 23;
      for (let step = 0; step <= 84; step++) {
        const u = step / 84, x = u * (width + 100) - 50;
        const y = lower
          ? height * .96 + (line - 28) * 9 - Math.sin(u * Math.PI * 1.2 + .4) * height * .16 + Math.sin(u * 7 + elapsed * .16) * 8
          : height * .62 + (line - 12) * 8 - Math.sin(u * Math.PI) * height * .61 + Math.sin(u * 5 + line * .07 + elapsed * .14) * 16;
        const point = deform(x, y);
        if (step) ctx.lineTo(point.x, point.y); else ctx.moveTo(point.x, point.y);
      }
      ctx.globalAlpha = lower ? .18 : line % 6 === 0 ? .5 : .27;
      ctx.stroke();
    }
    // A few moving ink beads make the slow flow legible even before interaction.
    for (let bead = 0; bead < 3; bead++) {
      const u = (elapsed * .018 + .22 + bead * .27) % 1;
      const y = height * .62 + (bead - 1) * 42 - Math.sin(u * Math.PI) * height * .61 + Math.sin(u * 5 + elapsed * .14) * 16;
      const p = deform(u * (width + 100) - 50, y);
      ctx.globalAlpha = .65; ctx.fillStyle = palette.accent;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.3, 0, TAU); ctx.fill();
    }
  }

  function grid() {
    const spacing = 36;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = .7;
    for (let direction = 0; direction < 2; direction++) {
      const extent = direction ? height : width;
      const length = direction ? width : height;
      for (let position = 0; position <= extent; position += spacing) {
        ctx.beginPath();
        for (let step = 0; step <= length + 12; step += 12) {
          const p = deform(direction ? step : position, direction ? position : step, 1.2);
          const drift = Math.sin(position * .009 + elapsed * .24) * 1.5;
          if (step) ctx.lineTo(p.x, p.y + drift); else ctx.moveTo(p.x, p.y + drift);
        }
        ctx.globalAlpha = position % (spacing * 4) === 0 ? .23 : .11;
        ctx.stroke();
      }
    }
    ctx.fillStyle = palette.accent;
    for (const [x, y, size] of [[.43, .16, 12], [.86, .09, 7], [.62, .88, 8]]) {
      const p = deform(Math.round(width * x / spacing) * spacing, Math.round(height * y / spacing) * spacing);
      ctx.globalAlpha = .85; ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }
    for (const pulse of pulses) {
      const age = elapsed - pulse.time;
      ctx.globalAlpha = Math.max(0, .48 * (1 - age / 2.5)); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(pulse.x, pulse.y, age * 330 + 4, 0, TAU); ctx.stroke();
    }
  }

  function mesh(mesh: Mesh, cx: number, cy: number, size: number, rx: number, ry: number, opacity: number) {
    const cosX = Math.cos(rx), sinX = Math.sin(rx), cosY = Math.cos(ry), sinY = Math.sin(ry);
    ctx.strokeStyle = palette.accent; ctx.lineWidth = .85;
    for (const line of mesh) {
      ctx.beginPath();
      let depth = 0;
      for (let i = 0; i < line.length; i++) {
        const [x, y, z] = line[i];
        const x1 = x * cosY + z * sinY, z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX, z2 = y * sinX + z1 * cosX;
        const perspective = 4 / (4 + z2 * .65);
        const px = cx + x1 * size * perspective, py = cy + y1 * size * perspective;
        depth += z2;
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.globalAlpha = opacity * clamp(.6 - depth / line.length * .22, .2, .95);
      ctx.stroke();
    }
  }

  function wireframe() {
    const cx = width * .48, cy = height * .28;
    const size = Math.min(height * .12, width * .06, 72);
    const followX = (pointer.y / height - .4) * pointer.strength;
    const followY = (pointer.x / width - .5) * pointer.strength;
    const rx = -.36 + followX * .85, ry = .5 + elapsed * .14 + followY * 1.3;
    const progress = clamp((elapsed - shapeTime) / .55, 0, 1);
    ctx.strokeStyle = palette.line; ctx.globalAlpha = .5; ctx.lineWidth = .7;
    ctx.setLineDash([2, 6]);
    ctx.beginPath(); ctx.moveTo(cx - size * 1.7, cy); ctx.lineTo(cx + size * 1.7, cy); ctx.moveTo(cx, cy - size * 1.4); ctx.lineTo(cx, cy + size * 1.4); ctx.stroke(); ctx.setLineDash([]);
    if (progress < 1) mesh(meshes[previousShape], cx, cy, size * (1 + progress * .08), rx, ry, 1 - progress);
    mesh(meshes[shape], cx, cy, size * (.92 + progress * .08), rx, ry, .9 * progress);
    mesh(meshes[1], width * .94, height * .14, size * .36, -.2, -.3 - elapsed * .10, .4);
    mesh(meshes[2], width * .94, height * .85, size * .4, -.25, .4 + elapsed * .09, .3);
    ctx.fillStyle = palette.accent; ctx.globalAlpha = .5;
    for (const x of [-1, 1]) { ctx.fillRect(cx + x * size * 1.7 - 1.5, cy - 1.5, 3, 3); }
  }

  function updateSpheres(dt: number) {
    for (let i = 0; i < spheres.length; i++) {
      const ball = spheres[i];
      const targetY = ball.homeY + Math.sin(elapsed * .65 + i * 1.7) * 7;
      ball.vx += (ball.homeX - ball.x) * 1.9 * dt;
      ball.vy += (targetY - ball.y) * 1.9 * dt;
      const dx = ball.x - pointer.x, dy = ball.y - pointer.y, d = Math.hypot(dx, dy) || 1;
      const push = Math.max(0, 1 - d / (ball.radius + 110)) * 1300 * pointer.strength;
      ball.vx += dx / d * push * dt; ball.vy += dy / d * push * dt;
      const damping = Math.exp(-1.25 * dt);
      ball.vx *= damping; ball.vy *= damping;
      ball.x += ball.vx * dt; ball.y += ball.vy * dt;
      if (ball.x < ball.radius || ball.x > width - ball.radius) { ball.x = clamp(ball.x, ball.radius, width - ball.radius); ball.vx *= -.7; }
      if (ball.y < ball.radius || ball.y > height - ball.radius) { ball.y = clamp(ball.y, ball.radius, height - ball.radius); ball.vy *= -.7; }
      for (let j = 0; j < i; j++) {
        const other = spheres[j], bx = ball.x - other.x, by = ball.y - other.y;
        const distance = Math.hypot(bx, by) || 1, overlap = ball.radius + other.radius - distance;
        if (overlap <= 0) continue;
        const nx = bx / distance, ny = by / distance;
        ball.x += nx * overlap / 2; ball.y += ny * overlap / 2;
        other.x -= nx * overlap / 2; other.y -= ny * overlap / 2;
        const impulse = Math.min(0, (ball.vx - other.vx) * nx + (ball.vy - other.vy) * ny) * .7;
        ball.vx -= impulse * nx; ball.vy -= impulse * ny; other.vx += impulse * nx; other.vy += impulse * ny;
      }
    }
  }

  function balls() {
    for (const ball of spheres) {
      ctx.globalAlpha = dark ? .16 : .08; ctx.fillStyle = palette.ink;
      ctx.beginPath(); ctx.ellipse(ball.x + 5, ball.y + ball.radius + 10, ball.radius * .8, ball.radius * .16, 0, 0, TAU); ctx.fill();
      const gradient = ctx.createRadialGradient(ball.x - ball.radius * .35, ball.y - ball.radius * .4, ball.radius * .05, ball.x, ball.y, ball.radius * 1.2);
      gradient.addColorStop(0, mix(ball.color, "#ffffff", .6));
      gradient.addColorStop(.45, ball.color); gradient.addColorStop(1, mix(ball.color, "#231433", .35));
      ctx.globalAlpha = 1; ctx.fillStyle = gradient;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, TAU); ctx.fill();
      ctx.strokeStyle = palette.ink; ctx.globalAlpha = .12; ctx.lineWidth = .8; ctx.stroke();
      ctx.globalAlpha = .35; ctx.strokeStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(ball.x - ball.radius * .08, ball.y - ball.radius * .08, ball.radius * .78, Math.PI * 1.1, Math.PI * 1.48); ctx.stroke();
    }
  }

  function contour(cx: number, cy: number, scale: number, alpha: number, phase: number) {
    ctx.strokeStyle = palette.accent; ctx.lineWidth = .8;
    for (let ring = 0; ring < 21; ring++) {
      ctx.beginPath();
      for (let step = 0; step <= 96; step++) {
        const angle = step / 96 * TAU;
        const radius = (24 + ring * 8) * scale;
        const organic = 1 + .11 * Math.sin(angle * 3 + phase + elapsed * .12) + .065 * Math.cos(angle * 5 - ring * .075 + elapsed * .08);
        const p = deform(cx + Math.cos(angle) * radius * organic * 1.18, cy + Math.sin(angle) * radius * organic * .75, .9);
        if (step) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
      }
      ctx.globalAlpha = alpha * (.55 + ring / 42); ctx.stroke();
    }
    ctx.globalAlpha = alpha * 1.6; ctx.fillStyle = palette.accent;
    ctx.beginPath(); ctx.ellipse(cx, cy, 3, 5, -.5 + Math.sin(elapsed * .2) * .15, 0, TAU); ctx.fill();
  }

  function botanical() {
    const scale = Math.min(width / 1137, height / 490, 1.15);
    contour(width * .53, height * .19, scale, .4, 0);
    contour(width * .96, height * .86, scale * 1.15, .23, 1.8);
    contour(width * .045, height * .92, scale * .7, .17, 3);
  }

  function paint() {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    if (theme === "editorial") paths();
    else if (theme === "swiss") grid();
    else if (theme === "blueprint") wireframe();
    else if (theme === "play") balls();
    else botanical();
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = "destination-out"; ctx.drawImage(mask, 0, 0, width, height); ctx.restore();
  }

  function tick(now: number) {
    if (disposed) return;
    const dt = lastTime ? Math.min((now - lastTime) / 1000, .035) : 0;
    lastTime = now; elapsed += dt;
    const ease = 1 - Math.exp(-dt * 7);
    pointer.x += (pointer.targetX - pointer.x) * ease;
    pointer.y += (pointer.targetY - pointer.y) * ease;
    pointer.strength += (pointer.targetStrength - pointer.strength) * ease;
    while (pulses.length && elapsed - pulses[0].time > 2.5) pulses.shift();
    if (theme === "play") updateSpheres(dt);
    paint();
    frame = requestAnimationFrame(tick);
  }

  function syncRunning() {
    cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    const running = !reduced && visible && !document.hidden;
    canvas.dataset.artState = reduced ? "static" : running ? "running" : "paused";
    if (running) frame = requestAnimationFrame(tick);
  }

  function move(event: PointerEvent) {
    if (reduced || event.pointerType !== "mouse") return;
    rect = canvas.getBoundingClientRect();
    pointer.targetX = event.clientX - rect.x; pointer.targetY = event.clientY - rect.y;
    pointer.targetStrength = 1;
  }
  function leave() { pointer.targetStrength = 0; }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);
  const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncRunning(); });
  intersectionObserver.observe(parent);
  document.addEventListener("visibilitychange", syncRunning);
  parent.addEventListener("pointermove", move, { passive: true });
  parent.addEventListener("pointerleave", leave, { passive: true });
  resize(); syncRunning();

  return {
    activate(point) {
      if (reduced) return forms[shape];
      rect = canvas.getBoundingClientRect();
      const x = point ? point.x - rect.x : width * .54, y = point ? point.y - rect.y : height * .19;
      pulses.push({ x, y, time: elapsed });
      if (pulses.length > 3) pulses.shift();
      canvas.dataset.interactions = String(++interactions);
      if (theme === "blueprint") {
        previousShape = shape; shape = (shape + 1) % meshes.length; shapeTime = elapsed;
      } else if (theme === "play") {
        for (let i = 0; i < spheres.length; i++) {
          const ball = spheres[i], dx = ball.x - x, dy = ball.y - y;
          const distance = Math.hypot(dx, dy) || 1;
          const force = 230 + 180 * Math.exp(-distance / 350);
          ball.vx += (dx / distance + Math.cos(i * 2.4) * .25) * force;
          ball.vy += (dy / distance + Math.sin(i * 2.4) * .25) * force;
        }
      }
      return forms[shape];
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", syncRunning);
      parent.removeEventListener("pointermove", move); parent.removeEventListener("pointerleave", leave);
    },
  };
}
