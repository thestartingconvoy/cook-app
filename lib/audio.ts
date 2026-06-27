"use client";

import type { MenuDay } from "./types";

let currentAudio: HTMLAudioElement | null = null;

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

/** Speak the meal names in order as a fallback when no voice note exists. */
function speakDay(day: MenuDay, onEnd?: () => void) {
  if (typeof speechSynthesis === "undefined") {
    onEnd?.();
    return;
  }
  const text = day.meals.map((m) => m.name).join(", ");
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  if (onEnd) utter.onend = onEnd;
  speechSynthesis.speak(utter);
}

/**
 * Play a day's combined voice note. Falls back to text-to-speech when the
 * voice note is missing — the caller (and the cook) sees no difference.
 */
export function playDay(day: MenuDay, onEnd?: () => void): void {
  stopCurrent();
  if (day.voiceNote) {
    const audio = new Audio(day.voiceNote);
    currentAudio = audio;
    audio.onended = () => {
      currentAudio = null;
      onEnd?.();
    };
    audio.onerror = () => {
      // Voice note failed (e.g. not cached) — fall back to TTS.
      currentAudio = null;
      speakDay(day, onEnd);
    };
    audio.play().catch(() => speakDay(day, onEnd));
  } else {
    speakDay(day, onEnd);
  }
}

export function stopPlayback(): void {
  stopCurrent();
}
