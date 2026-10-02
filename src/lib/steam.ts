// Steam data, fetched at build time. The Web API key stays on the build machine:
// only the derived numbers end up in the generated HTML.
// Every failure just drops that piece of data, so Steam never breaks the build.
import { STEAM_API_KEY } from "astro:env/server";
import { games, type GameEntry } from "../data/games";

export interface Game {
  name: string;
  url: string | null;
  cover: string | null;
  achievements: { unlocked: number; total: number } | null;
}

const API = "https://api.steampowered.com";
const ASSETS = "https://shared.steamstatic.com/store_item_assets";

const warned = new Set<string>();
function warn(message: string) {
  if (!warned.has(message)) console.warn(`[steam] ${message}`);
  warned.add(message);
}

async function call<T>(
  path: string,
  params: Record<string, string | number>,
  { withKey = true, quietStatuses = [] as number[] } = {},
): Promise<T | null> {
  const url = new URL(path, API);
  if (withKey) url.searchParams.set("key", STEAM_API_KEY ?? "");
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, String(value));
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) return (await res.json()) as T;
    if (res.status === 403 && path.includes("Achievements")) {
      warn("achievements hidden: set “Game details” to Public in your Steam privacy settings");
    } else if (!quietStatuses.includes(res.status)) {
      warn(`${path}: HTTP ${res.status}`);
    }
  } catch (error) {
    // Log the path only: the full URL contains the key.
    warn(`${path}: ${error}`);
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
  if (data?.response.success !== 1) warn(`could not resolve profile "${profile}"`);
  return data?.response.steamid ?? null;
}

/** Portrait cover art by app id. Public store data, no key needed; asset URLs are hashed, so ask the store. */
async function getCovers(appids: number[]): Promise<Map<number, string>> {
  const covers = new Map<number, string>();
  if (!appids.length) return covers;
  const data = await call<{
    response: { store_items?: { appid: number; assets?: { asset_url_format?: string; library_capsule?: string } }[] };
  }>(
    "/IStoreBrowseService/GetItems/v1/",
    {
      input_json: JSON.stringify({
        ids: appids.map((appid) => ({ appid })),
        context: { language: "english", country_code: "FR" },
        data_request: { include_assets: true },
      }),
    },
    { withKey: false },
  );
  for (const item of data?.response.store_items ?? []) {
    const { asset_url_format: format, library_capsule: file } = item.assets ?? {};
    if (format && file) covers.set(item.appid, `${ASSETS}/${format.replace("${FILENAME}", file)}`);
  }
  return covers;
}

async function getAchievements(steamid: string, appid: number) {
  // Games without achievements answer 400 or 500, which is expected.
  const data = await call<{ playerstats: { achievements?: { achieved: number }[] } }>(
    "/ISteamUserStats/GetPlayerAchievements/v1/",
    { steamid, appid },
    { quietStatuses: [400, 500] },
  );
  const list = data?.playerstats.achievements;
  return list?.length ? { unlocked: list.filter((a) => a.achieved).length, total: list.length } : null;
}

async function load(profile: string): Promise<Game[]> {
  const steamIds = games.flatMap((game) => (game.steamAppId ? [game.steamAppId] : []));
  const [covers, steamid] = await Promise.all([
    getCovers(steamIds),
    STEAM_API_KEY && profile ? resolveSteamId(profile) : null,
  ]);
  return Promise.all(
    games.map(async (game: GameEntry) => ({
      name: game.name,
      url: game.url ?? (game.steamAppId ? `https://store.steampowered.com/app/${game.steamAppId}/` : null),
      cover: game.cover ?? (game.steamAppId ? (covers.get(game.steamAppId) ?? null) : null),
      achievements:
        steamid && game.onSteam && game.steamAppId ? await getAchievements(steamid, game.steamAppId) : null,
    })),
  );
}

let cached: Promise<Game[]> | undefined;

/** The games from src/data/games.ts with cover art and achievements. Fetched once per build. */
export function getGames(profile: string): Promise<Game[]> {
  cached ??= load(profile);
  return cached;
}
