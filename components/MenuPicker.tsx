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
    <div className="min-h-dvh px-5 py-8">
      <div className="mx-auto grid max-w-md grid-cols-1 gap-5">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onPick(menu)}
            className="flex items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition active:scale-[0.98]"
          >
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-warm">
              {menu.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={menu.cover} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">🍲</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-2xl font-semibold">{menu.name}</div>
              <div className="text-sm text-ink/50">{menu.days.length} days</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
