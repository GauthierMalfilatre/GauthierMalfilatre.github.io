// GitHub contribution calendar, fetched at build time from the public HTML fragment that
// github.com/<user> itself loads (no API key needed). It is undocumented, so parsing is
// defensive and any failure returns null: the card is hidden and the build still succeeds.

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  level: number; // 0..4, GitHub's intensity bucket
  count: number;
}

export interface Contributions {
  total: number;
  days: ContributionDay[];
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

function parse(html: string): Contributions | null {
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = text.match(/^\s*([\d,]+) contributions?/);
    counts.set(id, n ? Number(n[1].replace(/,/g, "")) : 0);
  }
  const days: ContributionDay[] = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = attr(tag, "data-date");
    const level = Number(attr(tag, "data-level"));
    if (!date || !(level >= 0 && level <= 4)) continue;
    days.push({ date, level, count: counts.get(attr(tag, "id") ?? "") ?? 0 });
  }
  if (days.length < 7) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));
  const heading = html.match(/([\d,]+)\s+contributions?\s+in the last year/);
  const total = heading ? Number(heading[1].replace(/,/g, "")) : days.reduce((sum, day) => sum + day.count, 0);
  return { total, days };
}

const ATTEMPTS = 2; // github.com is occasionally slow from CI runners
const TIMEOUT = 15_000;

async function fetchContributions(username: string): Promise<Contributions | null> {
  const url = `https://github.com/users/${encodeURIComponent(username)}/contributions`;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(TIMEOUT) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = parse(await res.text());
      if (!data) throw new Error("unexpected page format");
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[github] contributions for ${username}, attempt ${attempt}/${ATTEMPTS}: ${message}`);
    }
  }
  return null;
}

const cache = new Map<string, Promise<Contributions | null>>();

export function getContributions(username: string): Promise<Contributions | null> {
  if (!cache.has(username)) cache.set(username, fetchContributions(username));
  return cache.get(username)!;
}
