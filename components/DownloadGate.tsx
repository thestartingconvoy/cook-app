"use client";

import { useState } from "react";
import type { Menu } from "@/lib/types";
import { downloadMenuAssets } from "@/lib/offline";
import { CheckIcon, DownloadIcon } from "./icons";

/**
 * Shown right after a menu is picked: confirms the choice and downloads all
 * assets for offline use. This is part of the (admin-run) setup flow.
 */
export default function DownloadGate({
  menu,
  onDone,
}: {
  menu: Menu;
  onDone: () => void;
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-leaf/15 text-leaf">
        <CheckIcon className="h-12 w-12" />
      </div>
      <div className="mt-6 text-3xl font-semibold">{menu.name}</div>
      <div className="mt-1 text-ink/50">{menu.days.length} days</div>

      {status === "done" ? (
        <button
          onClick={onDone}
          className="mt-12 flex items-center gap-3 rounded-full bg-leaf px-10 py-5 text-2xl font-semibold text-white shadow-lg active:scale-95"
        >
          <CheckIcon className="h-7 w-7" />
          Start
        </button>
      ) : (
        <button
          onClick={handleDownload}
          disabled={status === "working"}
          className="mt-12 flex items-center gap-3 rounded-full bg-accent px-10 py-5 text-2xl font-semibold text-white shadow-lg active:scale-95 disabled:opacity-60"
        >
          <DownloadIcon className="h-7 w-7" />
          {status === "working" ? "Saving…" : "Save offline"}
        </button>
      )}
    </div>
  );
}
