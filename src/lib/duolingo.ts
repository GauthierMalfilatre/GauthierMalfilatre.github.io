// Duolingo has no official public API; this is the unauthenticated endpoint its own web app uses.
// It sends no CORS headers, so it can only be called at build time, not from the browser.
// Any failure returns null so a Duolingo outage never breaks the build.

export interface DuolingoStats {
  username: string;
  xp: number;
  streak: number;
}

interface DuolingoUser {
  username: string;
  streak: number;
  courses: { learningLanguage: string; xp: number }[];
}

const cache = new Map<string, Promise<DuolingoUser | null>>();

function fetchUser(username: string): Promise<DuolingoUser | null> {
  if (!cache.has(username)) {
    const url = `https://www.duolingo.com/2017-06-30/users?username=${encodeURIComponent(username)}`;
    cache.set(
      username,
      fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data?.users?.[0] ?? null)
        .catch((error) => {
          console.warn(`[duolingo] could not fetch ${username}: ${error}`);
          return null;
        }),
    );
  }
  return cache.get(username)!;
}

/** Stats for one course, by learning-language code (e.g. "ja"). */
export async function getDuolingoStats(username: string, language: string): Promise<DuolingoStats | null> {
  if (!username) return null;
  const user = await fetchUser(username);
  const course = user?.courses.find((c) => c.learningLanguage === language);
  return user && course ? { username: user.username, xp: course.xp, streak: user.streak } : null;
}
