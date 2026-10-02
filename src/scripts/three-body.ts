// Newtonian three-body problem in dimensionless units (G = 1), for the background easter eggs.
// Integrated with leapfrog (kick-drift-kick), which is symplectic: it keeps periodic orbits such
// as the figure-eight stable over long runs. Softening avoids infinite forces in close encounters.

export interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  m: number;
}

/** Period of the figure-eight orbit in these units. */
export const FIGURE_EIGHT_PERIOD = 6.32591398;

/** Chenciner & Montgomery's figure-eight (2000): three equal masses chasing each other on one curve. */
export function figureEight(): Body[] {
  const vx = 0.93240737;
  const vy = 0.86473146;
  return [
    { x: 0.97000436, y: -0.24308753, vx: vx / 2, vy: vy / 2, m: 1 },
    { x: -0.97000436, y: 0.24308753, vx: vx / 2, vy: vy / 2, m: 1 },
    { x: 0, y: 0, vx: -vx, vy: -vy, m: 1 },
  ];
}

/** Three bodies at random inside the unit disc, bound together, with zero total momentum. */
export function randomTriple(): Body[] {
  const bodies: Body[] = Array.from({ length: 3 }, () => {
    const a = Math.random() * Math.PI * 2;
    const r = 0.3 + Math.random() * 0.7;
    return {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      m: 0.8 + Math.random() * 0.4,
    };
  });
  // Move to the center-of-mass frame so the system stays centered on screen.
  const total = bodies.reduce((sum, b) => sum + b.m, 0);
  const cx = bodies.reduce((sum, b) => sum + b.m * b.x, 0) / total;
  const cy = bodies.reduce((sum, b) => sum + b.m * b.y, 0) / total;
  const px = bodies.reduce((sum, b) => sum + b.m * b.vx, 0) / total;
  const py = bodies.reduce((sum, b) => sum + b.m * b.vy, 0) / total;
  for (const b of bodies) {
    b.x -= cx;
    b.y -= cy;
    b.vx -= px;
    b.vy -= py;
  }
  return bodies;
}

export const clone = (bodies: Body[]): Body[] => bodies.map((b) => ({ ...b }));

function accelerations(bodies: Body[], softening: number): [number, number][] {
  const acc: [number, number][] = bodies.map(() => [0, 0]);
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dx = bodies[j].x - bodies[i].x;
      const dy = bodies[j].y - bodies[i].y;
      const r2 = dx * dx + dy * dy + softening * softening;
      const inv = 1 / (r2 * Math.sqrt(r2));
      acc[i][0] += bodies[j].m * dx * inv;
      acc[i][1] += bodies[j].m * dy * inv;
      acc[j][0] -= bodies[i].m * dx * inv;
      acc[j][1] -= bodies[i].m * dy * inv;
    }
  }
  return acc;
}

/** Advances the system by `time`, in leapfrog steps no longer than `dt`. */
export function advance(bodies: Body[], time: number, dt: number, softening: number) {
  const steps = Math.max(1, Math.ceil(time / dt));
  const h = time / steps;
  let acc = accelerations(bodies, softening);
  for (let s = 0; s < steps; s++) {
    bodies.forEach((b, i) => {
      b.vx += (acc[i][0] * h) / 2;
      b.vy += (acc[i][1] * h) / 2;
      b.x += b.vx * h;
      b.y += b.vy * h;
    });
    acc = accelerations(bodies, softening);
    bodies.forEach((b, i) => {
      b.vx += (acc[i][0] * h) / 2;
      b.vy += (acc[i][1] * h) / 2;
    });
  }
}

/** Largest distance between matching bodies of two systems. */
export const divergence = (a: Body[], b: Body[]) =>
  Math.max(...a.map((p, i) => Math.hypot(p.x - b[i].x, p.y - b[i].y)));
