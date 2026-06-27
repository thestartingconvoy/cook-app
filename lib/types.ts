export interface Meal {
  name: string;
  image?: string | null;
}

export interface MenuDay {
  /** 1-indexed day number within the menu */
  day: number;
  meals: Meal[];
  /** Combined voice note for the whole day's meals. Null => fall back to TTS. */
  voiceNote?: string | null;
}

export interface Menu {
  id: string;
  name: string;
  /** Optional cover image shown on the menu-selection screen. */
  cover?: string | null;
  days: MenuDay[];
}

/** What we persist locally once the cook (or admin) selects a menu. */
export interface MenuSelection {
  menuId: string;
  /** ISO date (yyyy-mm-dd) representing "Day 1". */
  anchorDate: string;
}
