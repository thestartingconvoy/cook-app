"use client";

import { useEffect, useState } from "react";
import type { Menu } from "@/lib/types";
import { dayForToday, dayForTomorrow } from "@/lib/rotation";
import { playDay, stopPlayback } from "@/lib/audio";
import { PlayIcon, StopIcon, MoonIcon } from "./icons";

type Playing = "none" | "today" | "tomorrow";

/**
 * The only screen the cook normally sees: today's meals in order, a big play
 * button for today, and a small play button for tomorrow's prep.
 */
export default function DayView({
  menu,
  anchorDate,
}: {
  menu: Menu;
  anchorDate: string;
}) {
  const today = dayForToday(menu, anchorDate);
  const tomorrow = dayForTomorrow(menu, anchorDate);
  const [playing, setPlaying] = useState<Playing>("none");

  // Stop any audio when leaving the screen.
  useEffect(() => () => stopPlayback(), []);

  function toggle(which: "today" | "tomorrow") {
    if (playing === which) {
      stopPlayback();
      setPlaying("none");
      return;
    }
    const day = which === "today" ? today : tomorrow;
    setPlaying(which);
    playDay(day, () => setPlaying("none"));
  }

  const todayActive = playing === "today";
  const tomorrowActive = playing === "tomorrow";

  return (
    <div className="flex min-h-dvh flex-col px-6 pt-16">
      {/* Meals in chronological order. */}
      <div className="stagger mx-auto flex w-full max-w-md flex-1 flex-col gap-4">
        {today.meals.map((meal, i) => (
          <div
            key={i}
            className="surface flex items-center gap-4 rounded-3xl p-3.5 pr-6"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-warm to-sand shadow-ring">
              {meal.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meal.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl opacity-80">🍽️</span>
              )}
              <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/85 font-display text-[11px] font-semibold text-ivory backdrop-blur">
                {i + 1}
              </span>
            </div>
            <div className="min-w-0 truncate font-display text-xl font-medium tracking-tightest text-ink/90">
              {meal.name}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky controls so the cook never has to scroll to play. */}
      <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex flex-col items-center bg-gradient-to-t from-cream via-cream/95 to-transparent px-6 pb-9 pt-10">
        {/* Primary: play today's meals. */}
        <button
          onClick={() => toggle("today")}
          aria-label="Play today's meals"
          className={`relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-rausch to-rauschDark text-white shadow-floatPink transition-transform duration-300 active:scale-95 ${
            playing === "none" ? "animate-breathe play-halo" : ""
          }`}
        >
          <span className="pointer-events-none absolute inset-1.5 rounded-full ring-1 ring-inset ring-white/25" />
          {todayActive ? (
            <StopIcon className="h-14 w-14" />
          ) : (
            <PlayIcon className="ml-1.5 h-16 w-16 drop-shadow" />
          )}
        </button>

        {/* Secondary: tomorrow's meals for prepping before leaving. */}
        <button
          onClick={() => toggle("tomorrow")}
          aria-label="Play tomorrow's meals"
          className={`mt-7 flex items-center gap-3 rounded-full px-7 py-3.5 text-base font-medium shadow-soft transition-colors duration-300 active:scale-95 ${
            tomorrowActive ? "bg-ink text-ivory" : "surface text-ink/70"
          }`}
        >
          <MoonIcon className="h-5 w-5 text-gold" />
          {tomorrowActive ? (
            <StopIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
