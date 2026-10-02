// Steam data, fetched at build time. The Web API key stays on the build machine:
// only the derived numbers end up in the generated HTML.
// Every failure degrades to the fallback list so Steam never breaks the build.
import { STEAM_API_KEY } from "astro:env/server";
import { fallbackGames, recentGamesLimit } from "../data/games";

export interface Game {
  appid: number;
  name: string;
  cover: string | null;
  /** Total playtime in minutes; null when stats are unavailable. */
  minutes: number | null;
  achievements: { unlocked: number; total: number } | null;
}

interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  rtime_last_played: number;
}

const API = "https://api.steampowered.com";
const CDN = "https://cdn.cloudflare.steamstatic.com/steam/apps";

async function call<T>(path: string, params: Record<string, string | number>, quiet = false): Promise<T | null> {
  const url = new URL(path, API);
  url.searchParams.set("key", STEAM_API_KEY ?? "");
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) return (await res.json()) as T;
    if (!quiet) console.warn(`[steam] ${path}: HTTP ${res.status}`);
  } catch (error) {
    // Log the path only: the full URL contains the key.
    if (!quiet) console.warn(`[steam] ${path}: ${error}`);
  }
  return null;
}

async function resolveSteamId(profile: string): Promise<string | null> {
  const id = profile.match(/\b(\d{17})\b/)?.[1];
  if (id) return id;
  const vanity = profile.replace(/\/+$/, "").split("/").pop() ?? "";
  const data = await call<{ response: { success: number; steamid?: string } }>("/ISteamUser/ResolveVanityURL/v1/", {
    vanityurl: vanity,
  });
  if (data?.response.success !== 1) console.warn(`[steam] could not resolve profile "${profile}"`);
  return data?.response.steamid ?? null;
}

/** Portrait cover art, or the landscape header for older games without one. */
async function getCover(appid: number): Promise<string | null> {
  for (const file of ["library_600x900.jpg", "header.jpg"]) {
    const url = `${CDN}/${appid}/${file}`;
    try {
      if ((await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) })).ok) return url;
    } catch {}
  }
  return null;
}

async function getAchievements(steamid: string, appid: number) {
  // Games without achievements answer with an error, so stay quiet here.
  const data = await call<{ playerstats: { achievements?: { achieved: number }[] } }>(
    "/ISteamUserStats/GetPlayerAchievements/v1/",
    { steamid, appid },
    true,
  );
  const list = data?.playerstats.achievements;
  return list?.length ? { unlocked: list.filter((a) => a.achieved).length, total: list.length } : null;
}

async function getRecentGames(profile: string): Promise<Game[] | null> {
  if (!STEAM_API_KEY || !profile) return null;
  const steamid = await resolveSteamId(profile);
  if (!steamid) return null;

  const owned = await call<{ response: { games?: OwnedGame[] } }>("/IPlayerService/GetOwnedGames/v1/", {
    steamid,
    include_appinfo: 1,
    include_played_free_games: 1,
  });
  const games = owned?.response.games;
  if (!games?.length) {
    console.warn("[steam] no games returned; is “Game details” set to Public in your Steam privacy settings?");
    return null;
  }

  const recent = games
    .filter((game) => game.rtime_last_played > 0)
    .sort((a, b) => b.rtime_last_played - a.rtime_last_played)
    .slice(0, recentGamesLimit);
  return Promise.all(
    recent.map(async (game) => ({
      appid: game.appid,
      name: game.name,
      cover: await getCover(game.appid),
      minutes: game.playtime_forever,
      achievements: await getAchievements(steamid, game.appid),
    })),
  );
}

let cached: Promise<Game[]> | undefined;

/** Recently played games with stats, or the fallback list without stats. Fetched once per build. */
export function getGames(profile: string): Promise<Game[]> {
  cached ??= getRecentGames(profile).then(
    async (games) =>
      games ??
      Promise.all(
        fallbackGames.map(async (game) => ({
          ...game,
          cover: await getCover(game.appid),
          minutes: null,
          achievements: null,
        })),
      ),
  );
  return cached;
}
