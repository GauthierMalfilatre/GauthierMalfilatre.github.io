// Shown when Steam stats are unavailable (no API key or profile set, or the Steam API is down).
// With both set, the section lists your most recently played Steam games instead.
export const fallbackGames: { appid: number; name: string }[] = [
  { appid: 1072420, name: "Dragon Quest Builders 2" },
  { appid: 1229490, name: "ULTRAKILL" },
];

/** Steam apps never shown, by app id (tools, not games). Find an id in its store URL. */
export const hiddenApps: number[] = [
  431960, // Wallpaper Engine
];

/** How many recently played games to show. */
export const recentGamesLimit = 5;
