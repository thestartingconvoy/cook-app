"use client";

import type { MenuDay } from "./types";

let currentAudio: HTMLAudioElement | null = null;

/** Preferred TTS languages, best first. en-IN = Indian English accent. */
const PREFERRED_LANGS = ["en-IN", "en-GB", "en"];

/**
 * Pick the best available voice for the cook. Voices load asynchronously, so
 * this may return null on the very first call; speakDay handles that.
 */
function pickVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;
  for (const lang of PREFERRED_LANGS) {
    const exact = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
    if (exact) return exact;
    const prefix = voices.find((v) =>
      v.lang.toLowerCase().startsWith(lang.toLowerCase())
    );
    if (prefix) return prefix;
  }
  return voices[0] ?? null;
}

/** Warm up the voice list early (Chrome populates it lazily). */
export function primeVoices(): void {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.getVoices();
}

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

  let spoken = false;
  const speak = () => {
    if (spoken) return;
    spoken = true;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      // No voice object yet — still hint the locale to the engine.
      utter.lang = "en-IN";
    }
    utter.rate = 0.9;
    if (onEnd) utter.onend = onEnd;
    speechSynthesis.speak(utter);
  };

  // If the voice list isn't ready yet, wait for it once then speak.
  if (!speechSynthesis.getVoices().length) {
    speechSynthesis.addEventListener("voiceschanged", speak, { once: true });
    // Safety net in case the event never fires.
    setTimeout(speak, 300);
  } else {
    speak();
  }
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
