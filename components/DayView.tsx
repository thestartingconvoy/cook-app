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
    <div className="flex min-h-dvh flex-col px-6 pb-9 pt-16">
      {/* Meals in chronological order. */}
      <div className="stagger mx-auto flex w-full max-w-md flex-1 flex-col gap-5">
        {today.meals.map((meal, i) => (
          <div
            key={i}
            className="surface flex items-center gap-5 rounded-4xl p-4 pr-6"
          >
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-warm to-sand shadow-ring">
              {meal.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meal.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl opacity-80">🍽️</span>
              )}
              <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/85 font-display text-sm font-semibold text-ivory backdrop-blur">
                {i + 1}
              </span>
            </div>
            <div className="min-w-0 truncate font-display text-3xl font-medium tracking-tightest text-ink">
              {meal.name}
            </div>
          </div>
        ))}
      </div>

      {/* Primary: play today's meals. */}
      <div className="mx-auto mt-12 flex w-full max-w-md flex-col items-center">
        <button
          onClick={() => toggle("today")}
          aria-label="Play today's meals"
          className={`relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accentDark text-white shadow-float transition-transform duration-300 active:scale-95 ${
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
          className={`mt-9 flex items-center gap-3 rounded-full px-7 py-3.5 text-base font-medium shadow-soft transition-colors duration-300 active:scale-95 ${
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
