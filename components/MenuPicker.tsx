"use client";

import type { Menu } from "@/lib/types";

/**
 * First-run screen (admin sets this up for the cook): a grid of menus to
 * choose from. No instructional text — just tappable cards.
 */
export default function MenuPicker({
  menus,
  onPick,
}: {
  menus: Menu[];
  onPick: (menu: Menu) => void;
}) {
  return (
    <div className="min-h-dvh px-6 py-12">
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
