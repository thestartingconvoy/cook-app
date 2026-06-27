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
    <div className="flex min-h-dvh flex-col px-5 pb-6 pt-14">
      {/* Meals in chronological order. */}
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4">
        {today.meals.map((meal, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
              {i + 1}
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-warm">
              {meal.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meal.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl">🍽️</span>
              )}
            </div>
            <div className="min-w-0 truncate text-2xl font-semibold">{meal.name}</div>
          </div>
        ))}
      </div>

      {/* Primary: play today's meals. */}
      <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center">
        <button
          onClick={() => toggle("today")}
          aria-label="Play today's meals"
          className={`flex h-32 w-32 items-center justify-center rounded-full bg-accent text-white shadow-xl active:scale-95 ${
            playing === "none" ? "animate-soft-pulse" : ""
          }`}
        >
          {todayActive ? (
            <StopIcon className="h-14 w-14" />
          ) : (
            <PlayIcon className="ml-2 h-16 w-16" />
          )}
        </button>

        {/* Secondary: tomorrow's meals for prepping before leaving. */}
        <button
          onClick={() => toggle("tomorrow")}
          aria-label="Play tomorrow's meals"
          className={`mt-6 flex items-center gap-3 rounded-full px-6 py-3 text-lg font-medium shadow-sm ring-1 ring-black/5 active:scale-95 ${
            tomorrowActive ? "bg-ink text-white" : "bg-white text-ink/70"
          }`}
        >
          <MoonIcon className="h-6 w-6" />
          {tomorrowActive ? (
            <StopIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
