"use client";

import { useState } from "react";
import type { Menu } from "@/lib/types";
import { RefreshIcon } from "./icons";

/**
 * First-run screen (admin sets this up for the cook): a grid of menus to
 * choose from. No instructional text — just tappable cards.
 */
export default function MenuPicker({
  menus,
  onPick,
  onRefresh,
}: {
  menus: Menu[];
  onPick: (menu: Menu) => void;
  onRefresh?: () => Promise<void> | void;
}) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="min-h-dvh px-6 py-12">
      <div className="mx-auto mb-6 flex max-w-md items-center justify-end">
        {onRefresh && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh menus"
            className="surface flex h-11 w-11 items-center justify-center rounded-full text-ink/60 active:scale-95 disabled:opacity-60"
          >
            <RefreshIcon className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>
      <div className="stagger mx-auto grid max-w-md grid-cols-1 gap-5">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onPick(menu)}
            className="surface flex items-center gap-5 rounded-4xl p-5 text-left transition-transform duration-300 active:scale-[0.97]"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-warm to-sand shadow-ring">
              {menu.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={menu.cover} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl opacity-80">🍲</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-2xl font-medium tracking-tightest text-ink">
                {menu.name}
              </div>
              <div className="mt-0.5 text-sm font-medium uppercase tracking-[0.18em] text-gold">
                {menu.days.length} days
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
