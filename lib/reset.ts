"use client";

import { kvClear } from "./kv";
import { clearAssetCache } from "./offline";
import { clearSelection } from "./storage";

/**
 * Hard reset: wipe everything stored on the device — the saved menu
 * selection (localStorage), the cached menu records (IndexedDB), and the
 * downloaded images/voice notes (Cache API). After this the app behaves like
 * a fresh first run, so the next fetch pulls straight from the admin DB.
 */
export async function clearAllLocalData(): Promise<void> {
  clearSelection();
  await Promise.allSettled([kvClear(), clearAssetCache()]);
}
