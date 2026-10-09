export type CatPoint = { x: number; y: number };
export const CAT_MOBILE_CENTER_VISIT_MS = 4000;

export function catInMobileCenter(x: number, width: number, catWidth: number) {
  const center = x + catWidth / 2;
  return width < 600 && center > width * .25 && center < width * .75;
}

/** End a short center visit only when a margin has room for the complete cat. */
export function chooseCatMobileEdgeReturn(from: CatPoint, width: number, height: number, catWidth: number, catHeight: number, settledFor: number, obstacles: CatObstacle[]): CatPoint | null {
  if (settledFor < CAT_MOBILE_CENTER_VISIT_MS || !catInMobileCenter(from.x, width, catWidth)) return null;
  const point = chooseCatPerch(width, height, catWidth, catHeight, obstacles, from.x < width / 2 ? "left" : "right", 0, () => .5, from);
  return overlapArea(point, catWidth, catHeight, obstacles) === 0 ? point : null;
}
export type CatObstacle = CatPoint & { width: number; height: number };

/** At a screen edge, a resting cat looks into the page rather than offscreen. */
export function chooseCatRestFacing(x: number, width: number, catWidth: number, current: "left" | "right"): "left" | "right" {
  const left = x, right = width - x - catWidth;
  const edge = Math.min(width * .25, catWidth + 24);
  if (Math.min(left, right) > edge || left === right) return current;
  return left < right ? "right" : "left";
}

/** Follow the area at the reading line, rather than a sliver of the previous one. */
export function chooseCatPageArea(areas: readonly { id: string; top: number; bottom: number }[], height: number): string | null {
  const top = Math.min(90, height * .2), bottom = height * .8, readingLine = Math.max(top, height * .32);
  let best: string | null = null, bestDistance = Infinity;
  for (const area of areas) {
    if (area.bottom <= top || area.top >= bottom) continue;
    const distance = Math.max(area.top - readingLine, readingLine - area.bottom, 0);
    if (distance < bestDistance) { best = area.id; bestDistance = distance; }
  }
  return best;
}

/** Prefer the margins; score visible controls and the pointer as places to leave clear. */
export function chooseCatPerch(width: number, height: number, catWidth: number, catHeight: number, obstacles: CatObstacle[], preferredSide: "left" | "right", variation: number, random = Math.random, from?: CatPoint): CatPoint {
  const margin = 18;
  const left = margin;
  const right = Math.max(left, width - catWidth - margin);
  const top = Math.min(120, Math.max(18, height - catHeight - 18));
  const bottom = Math.max(top, height - catHeight - 28);
  const ys = height < 500 ? [bottom, top] : Array.from({ length: 8 }, (_, index) => top + (bottom - top) * index / 7);
  const sides = preferredSide === "right" ? [right, left] : [left, right];
  // If both margins contain text, use a genuinely clear pocket inside the layout.
  if (width >= 600) sides.push(Math.max(left, Math.min(right, width * .25 - catWidth / 2)), Math.max(left, Math.min(right, width * .75 - catWidth / 2)), Math.max(left, Math.min(right, width / 2 - catWidth / 2)));
  let best = { x: sides[0], y: Math.min(bottom, ys[variation % ys.length]) };
  let bestScore = Infinity;
  for (const [sideIndex, x] of sides.entries()) for (let index = 0; index < ys.length; index++) {
    const y = Math.min(bottom, ys[(index + variation) % ys.length]);
    const staying = from && Math.hypot(x - from.x, y - from.y) < Math.max(64, catWidth) ? 120 : 0;
    const sameSide = from && Math.abs(x - from.x) < catWidth ? 80 : 0;
    const score = overlapArea({ x, y }, catWidth, catHeight, obstacles) * 100 + staying + sameSide + sideIndex * 15 + random() * 40;
    if (score < bestScore) { bestScore = score; best = { x, y }; }
  }
  return best;
}

function overlapArea(point: CatPoint, width: number, height: number, obstacles: CatObstacle[]) {
  return obstacles.reduce((area, obstacle) => area + Math.max(0, Math.min(point.x + width + 10, obstacle.x + obstacle.width) - Math.max(point.x - 10, obstacle.x)) * Math.max(0, Math.min(point.y + height + 10, obstacle.y + obstacle.height) - Math.max(point.y - 10, obstacle.y)), 0);
}

/** Stop beside a resting cursor only when the complete cat has an unobstructed spot. */
export function chooseCatNuzzle(cursor: CatPoint, width: number, height: number, catWidth: number, catHeight: number, obstacles: CatObstacle[], random = Math.random): CatPoint | null {
  const candidates = [-1, 1].flatMap(direction => [-.35, .2].map(offset => ({ x: cursor.x + direction * (catWidth + 52) - catWidth / 2, y: cursor.y + catHeight * offset - catHeight / 2 })));
  const clear = candidates.filter(point => point.x >= 18 && point.x + catWidth <= width - 18 && point.y >= 150 && point.y + catHeight <= height - 24 && overlapArea(point, catWidth, catHeight, obstacles) === 0);
  return clear.length ? clear[Math.min(clear.length - 1, Math.floor(random() * clear.length))] : null;
}

/** Preserve a clear drop; otherwise settle into the closest safe space available. */
export function chooseCatDrop(point: CatPoint, width: number, height: number, catWidth: number, catHeight: number, obstacles: CatObstacle[]): CatPoint {
  const availableX = Math.max(0, width - catWidth);
  const availableY = Math.max(0, height - catHeight);
  // A cramped viewport may fit the cat without room for the usual 12px margin.
  const minX = Math.min(12, availableX / 2);
  const minY = Math.min(12, availableY / 2);
  const maxX = availableX - minX;
  const maxY = availableY - minY;
  const clampX = (x: number) => Math.max(minX, Math.min(maxX, Number.isFinite(x) ? x : minX));
  const clampY = (y: number) => Math.max(minY, Math.min(maxY, Number.isFinite(y) ? y : minY));
  const requested = { x: clampX(point.x), y: clampY(point.y) };
  if (overlapArea(requested, catWidth, catHeight, obstacles) === 0) return requested;

  const candidates = new Map<string, CatPoint>();
  const add = (x: number, y: number) => {
    const candidate = { x: clampX(x), y: clampY(y) };
    candidates.set(`${candidate.x}:${candidate.y}`, candidate);
  };
  add(requested.x, requested.y);

  // Rectangular text and controls make their expanded edges useful exact stops.
  const xs = new Set([requested.x, minX, maxX]);
  const ys = new Set([requested.y, minY, maxY]);
  for (const obstacle of obstacles) {
    xs.add(clampX(obstacle.x - catWidth - 10));
    xs.add(clampX(obstacle.x + obstacle.width + 10));
    ys.add(clampY(obstacle.y - catHeight - 10));
    ys.add(clampY(obstacle.y + obstacle.height + 10));
  }
  const nearby = (values: Set<number>, origin: number) => [...values]
    .sort((a, b) => Math.abs(a - origin) - Math.abs(b - origin) || a - b)
    .slice(0, 28);
  for (const x of nearby(xs, requested.x)) for (const y of nearby(ys, requested.y)) add(x, y);

  // Bounded samples still find distant open pockets in a dense page layout.
  for (const radius of [24, 56, 112, 192, 320, 512]) {
    for (let direction = 0; direction < 12; direction++) {
      const angle = direction * Math.PI / 6;
      add(requested.x + Math.cos(angle) * radius, requested.y + Math.sin(angle) * radius);
    }
  }
  for (let column = 0; column <= 6; column++) for (let row = 0; row <= 6; row++) {
    add(minX + (maxX - minX) * column / 6, minY + (maxY - minY) * row / 6);
  }

  let best = requested;
  let bestOverlap = Infinity;
  let bestDistance = Infinity;
  for (const candidate of candidates.values()) {
    const area = overlapArea(candidate, catWidth, catHeight, obstacles);
    const overlap = area < 1e-8 ? 0 : area;
    const distance = (candidate.x - requested.x) ** 2 + (candidate.y - requested.y) ** 2;
    // Overlap always outweighs distance, including when every position is blocked.
    if (overlap < bestOverlap - 1e-6 || (Math.abs(overlap - bestOverlap) <= 1e-6 && distance < bestDistance)) {
      best = candidate;
      bestOverlap = overlap;
      bestDistance = distance;
    }
  }
  return best;
}
