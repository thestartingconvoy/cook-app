"use client";

import { useState } from "react";
import type { Menu } from "@/lib/types";
import { downloadMenuAssets } from "@/lib/offline";
import { ArrowLeftIcon, CheckIcon, DownloadIcon } from "./icons";

/**
 * Shown right after a menu is picked: confirms the choice and downloads all
 * assets for offline use. This is part of the (admin-run) setup flow.
 */
export default function DownloadGate({
  menu,
  onDone,
  onBack,
}: {
  menu: Menu;
  onDone: () => void;
  onBack: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");

  async function handleDownload() {
    setStatus("working");
    try {
      await downloadMenuAssets(menu);
    } catch {
      /* assets are best-effort; TTS still works without them */
    }
    setStatus("done");
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <button
        onClick={onBack}
        disabled={status === "working"}
        aria-label="Back to menus"
        className="surface absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full text-ink active:scale-95 disabled:opacity-50"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>

      <div className="animate-scale-in flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-leaf/20 to-leaf/5 text-leaf shadow-soft ring-1 ring-inset ring-leaf/15">
        <CheckIcon className="h-14 w-14" />
      </div>
      <div className="mt-8 font-display text-4xl font-medium tracking-tightest text-ink">
        {menu.name}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-gold">
        {menu.days.length} days
      </div>

      {status === "done" ? (
        <button
          onClick={onDone}
          className="mt-14 flex items-center gap-3 rounded-full bg-gradient-to-br from-leaf to-[#587857] px-12 py-5 font-display text-2xl font-medium text-white shadow-float active:scale-95"
        >
          <CheckIcon className="h-7 w-7" />
          Start
        </button>
      ) : (
        <button
          onClick={handleDownload}
          disabled={status === "working"}
          className="mt-14 flex items-center gap-3 rounded-full bg-gradient-to-br from-accent to-accentDark px-12 py-5 font-display text-2xl font-medium text-white shadow-float active:scale-95 disabled:opacity-60"
        >
          <DownloadIcon className="h-7 w-7" />
          {status === "working" ? "Saving…" : "Save offline"}
        </button>
      )}
    </div>
  );
}
