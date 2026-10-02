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

const cache = new Map<string, Promise<Contributions | null>>();

export function getContributions(username: string): Promise<Contributions | null> {
  if (!cache.has(username)) {
    cache.set(
      username,
      fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(8000),
      })
        .then((res) => (res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((html) => parse(html) ?? Promise.reject(new Error("unexpected page format")))
        .catch((error) => {
          console.warn(`[github] contributions for ${username}: ${error.message ?? error}`);
          return null;
        }),
    );
  }
  return cache.get(username)!;
}
