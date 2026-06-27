import type { Menu, MenuDay } from "./types";

/** Normalize a Date to local midnight, returns yyyy-mm-dd. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole days between two yyyy-mm-dd keys (b - a), ignoring time/DST. */
function daysBetween(aKey: string, bKey: string): number {
  const a = new Date(aKey + "T00:00:00");
  const b = new Date(bKey + "T00:00:00");
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/**
 * Given the anchor date (when Day 1 was first shown) and today, return the
 * rotating day index (0-based) into the menu's days array.
 */
export function currentDayIndex(
  anchorDate: string,
  total: number,
  today: Date = new Date()
): number {
  if (total <= 0) return 0;
  const elapsed = daysBetween(anchorDate, toDateKey(today));
  // Modulo that stays positive even if today < anchor (clock skew).
  return ((elapsed % total) + total) % total;
}

export function dayForToday(menu: Menu, anchorDate: string, today?: Date): MenuDay {
  const idx = currentDayIndex(anchorDate, menu.days.length, today);
  return menu.days[idx];
}

export function dayForTomorrow(menu: Menu, anchorDate: string, today?: Date): MenuDay {
  const idx = currentDayIndex(anchorDate, menu.days.length, today);
  const next = (idx + 1) % menu.days.length;
  return menu.days[next];
}
