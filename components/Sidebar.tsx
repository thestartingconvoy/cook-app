"use client";

import { useState } from "react";
import { GearIcon, DownloadIcon } from "./icons";

/**
 * Hidden settings drawer for the owner — NOT for the cook. Triggered by a
 * small, low-contrast gear tucked in the corner. Holds the two maintenance
 * actions: change the menu, and refresh the menu from the server.
 */
export default function Sidebar({
  onChangeMenu,
  onRefresh,
}: {
  onChangeMenu: () => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      setOpen(false);
    }
  }

  return (
    <>
      {/* Deliberately small and faint so the cook never notices it. */}
      <button
        aria-label="Settings"
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-20 p-2 text-ink/[0.12] transition-colors active:text-ink/30"
      >
        <GearIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-3 bg-cream p-6 shadow-2xl">
            <div className="mb-3 font-display text-xl font-medium tracking-tightest text-ink/70">
              Settings
            </div>

            <button
              onClick={onChangeMenu}
              className="surface flex items-center gap-3 rounded-2xl p-4 text-left text-lg active:scale-[0.98]"
            >
              <span className="text-2xl">🍲</span>
              Change menu
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="surface flex items-center gap-3 rounded-2xl p-4 text-left text-lg active:scale-[0.98] disabled:opacity-60"
            >
              <DownloadIcon className="h-6 w-6 text-ink/60" />
              {refreshing ? "Refreshing…" : "Refresh menu"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="mt-auto rounded-2xl p-4 text-ink/40"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
