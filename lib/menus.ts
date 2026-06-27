"use client";

import { kvGet, kvSet } from "./kv";
import type { Menu } from "./types";

const CACHE_PREFIX = "cook.menu.";

const DEFAULT_MENUS_API_URL = "https://cook-admin-lovat.vercel.app/api/menus";
const MENUS_API_URL =
  process.env.NEXT_PUBLIC_MENUS_API_URL || DEFAULT_MENUS_API_URL;
const LEGACY_MENUS_URL = "/data/menus.json";

function menuUrl(id?: string): string {
  const base = MENUS_API_URL.replace(/\/+$/, "");
  return id ? `${base}/${encodeURIComponent(id)}` : base;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load menus (${res.status})`);
  return (await res.json()) as T;
}

async function fetchLegacyMenus(): Promise<Menu[]> {
  return fetchJson<Menu[]>(LEGACY_MENUS_URL);
}

/** Source of truth for menus from the admin app public API. */
export async function fetchAllMenus(): Promise<Menu[]> {
  try {
    return await fetchJson<Menu[]>(menuUrl());
  } catch (err) {
    console.error("[cook-app] Failed to load menus from admin API", err);
    return fetchLegacyMenus();
  }
}

/** Get a single menu from the network (used for refresh). */
export async function fetchMenu(id: string): Promise<Menu | null> {
  try {
    return await fetchJson<Menu>(menuUrl(id));
  } catch (err) {
    console.error("[cook-app] Failed to load menu from admin API", err);
    const all = await fetchLegacyMenus().catch(() => []);
    return all.find((m) => m.id === id) ?? null;
  }
}

/** Persist a full menu locally so it works offline. */
export async function cacheMenu(menu: Menu): Promise<void> {
  await kvSet(CACHE_PREFIX + menu.id, menu);
}

/** Read a previously cached menu (offline-friendly). */
export async function getCachedMenu(id: string): Promise<Menu | null> {
  return (await kvGet<Menu>(CACHE_PREFIX + id)) ?? null;
}
