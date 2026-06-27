"use client";

import { kvGet, kvSet } from "./kv";
import type { Menu } from "./types";

const CACHE_PREFIX = "cook.menu.";

/**
 * Source of truth for menus. Today this is a static JSON file; later this
 * becomes the admin API. The cook app only ever calls these helpers.
 */
const MENUS_URL = "/data/menus.json";

export async function fetchAllMenus(): Promise<Menu[]> {
  const res = await fetch(MENUS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load menus");
  return (await res.json()) as Menu[];
}

/** Get a single menu from the network (used for refresh). */
export async function fetchMenu(id: string): Promise<Menu | null> {
  const all = await fetchAllMenus();
  return all.find((m) => m.id === id) ?? null;
}

/** Persist a full menu locally so it works offline. */
export async function cacheMenu(menu: Menu): Promise<void> {
  await kvSet(CACHE_PREFIX + menu.id, menu);
}

/** Read a previously cached menu (offline-friendly). */
export async function getCachedMenu(id: string): Promise<Menu | null> {
  return (await kvGet<Menu>(CACHE_PREFIX + id)) ?? null;
}
