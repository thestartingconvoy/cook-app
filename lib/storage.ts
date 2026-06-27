"use client";

import type { MenuSelection } from "./types";
import { toDateKey } from "./rotation";

const KEY = "cook.selection";

export function getSelection(): MenuSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MenuSelection) : null;
  } catch {
    return null;
  }
}

/** Save selection and (re)set the anchor date to today. */
export function selectMenu(menuId: string): MenuSelection {
  const selection: MenuSelection = {
    menuId,
    anchorDate: toDateKey(new Date()),
  };
  localStorage.setItem(KEY, JSON.stringify(selection));
  return selection;
}

/** Reset the anchor to today, keeping the same menu (used by Refresh). */
export function resetAnchor(menuId: string): MenuSelection {
  return selectMenu(menuId);
}

export function clearSelection() {
  localStorage.removeItem(KEY);
}
