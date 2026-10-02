export interface GameEntry {
  name: string;
  /** Steam app id, used for the cover art (and the store link if `url` is not set). */
  steamAppId?: number;
  /** You play it on Steam: shows your achievements (needs STEAM_API_KEY and a public "Game details" setting). */
  onSteam?: boolean;
  /** Link for the card. Defaults to the Steam store page. */
  url?: string;
  /** Cover image for games without a Steam page: a portrait 2:3 image (e.g. 600x900) in public/games/. */
  cover?: string;
}

// Shown in this order.
export const games: GameEntry[] = [
  { name: "THE FINALS", steamAppId: 2073850, onSteam: true },
  { name: "Dragon Quest Builders 2", steamAppId: 1072420, onSteam: true },
  { name: "ULTRAKILL", steamAppId: 1229490, onSteam: true },
  { name: "Vampire Survivors", steamAppId: 1794680, onSteam: true },
  { name: "Wuthering Waves", steamAppId: 3513350, url: "https://wutheringwaves.kurogames.com/" },
  // Not on Steam. Add cover: "/games/honkai-star-rail.jpg" once the image is in public/games/.
  { name: "Honkai: Star Rail", url: "https://hsr.hoyoverse.com/" },
];
