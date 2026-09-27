// Seeded serval-print generator. Same seed, same spots — on every render.

export interface Spot {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
}

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jittered hex-grid spots, like a serval's coat. */
export function makeSpots(
  width: number,
  height: number,
  { cell = 34, seed = 7, minR = 5, maxR = 11, stretch = 0.4, gaps = 0.08 } = {},
): Spot[] {
  const rand = prng(seed);
  const spots: Spot[] = [];
  let row = 0;
  for (let y = cell / 2; y < height + cell; y += cell * 0.87, row++) {
    for (let x = cell / 2 + (row % 2 ? cell / 2 : 0); x < width + cell; x += cell) {
      const cx = x + (rand() - 0.5) * cell * 0.64;
      const cy = y + (rand() - 0.5) * cell * 0.64;
      const ry = minR + rand() * (maxR - minR);
      const rx = ry * (1 + rand() * stretch);
      const rot = rand() * 180;
      if (rand() > gaps) spots.push({ cx, cy, rx, ry, rot });
    }
  }
  return spots;
}

/** A seamless print tile as a CSS url(), used to fill giant type with spots. */
export function spotTile(fg: string, bg: string, size = 220, seed = 11): string {
  const base = makeSpots(size, size, { cell: 30, seed, minR: 4, maxR: 9 }).filter(
    (s) => s.cx < size && s.cy < size,
  );
  const shapes: string[] = [];
  for (const s of base) {
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        const cx = s.cx + dx;
        const cy = s.cy + dy;
        if (cx < -14 || cy < -14 || cx > size + 14 || cy > size + 14) continue;
        shapes.push(
          `<ellipse cx='${cx.toFixed(1)}' cy='${cy.toFixed(1)}' rx='${s.rx.toFixed(1)}' ry='${s.ry.toFixed(1)}' transform='rotate(${s.rot.toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})'/>`,
        );
      }
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='100%' height='100%' fill='${bg}'/><g fill='${fg}'>${shapes.join("")}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
