"use client";

import type { Menu } from "./types";

const CACHE_NAME = "cook-assets-v1";

/** Collect every asset URL referenced by a menu. */
function assetUrls(menu: Menu): string[] {
  const urls: string[] = [];
  for (const day of menu.days) {
    if (day.voiceNote) urls.push(day.voiceNote);
    for (const meal of day.meals) {
      if (meal.image) urls.push(meal.image);
    }
  }
  return Array.from(new Set(urls));
}

/**
 * Download all images + voice notes for a menu into the Cache API so the
 * day view works with no network. Returns how many assets were stored.
 */
export async function downloadMenuAssets(menu: Menu): Promise<number> {
  if (typeof caches === "undefined") return 0;
  const cache = await caches.open(CACHE_NAME);
  const urls = assetUrls(menu);
  await Promise.allSettled(urls.map((u) => cache.add(u)));
  return urls.length;
}

/** Wipe every cached asset (used by a hard refresh). */
export async function clearAssetCache(): Promise<void> {
  if (typeof caches === "undefined") return;
  const keys = await caches.keys();
  await Promise.all(keys.map((k) => caches.delete(k)));
}

/** True if every asset for the menu is present in the cache. */
export async function isMenuDownloaded(menu: Menu): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  const cache = await caches.open(CACHE_NAME);
  const urls = assetUrls(menu);
  if (urls.length === 0) return true;
  for (const u of urls) {
    if (!(await cache.match(u))) return false;
  }
  return true;
}
