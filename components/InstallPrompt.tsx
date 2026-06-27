"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isAndroidBrowser(): boolean {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  return ua.includes("android") && !standalone;
}

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAndroidBrowser()) return;

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  async function handleInstall() {
    if (!installEvent) return;
    setVisible(false);
    await installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
  }

  if (!visible || !installEvent) return null;

  return (
    <div className="surface animate-fade-up fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-3xl p-5 text-left">
      <div className="font-display text-lg font-medium tracking-tightest text-ink">
        Install this app
      </div>
      <div className="mt-1 text-sm text-ink/60">Open it faster from your phone.</div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setVisible(false)}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-ink/60 active:scale-95"
        >
          Skip
        </button>
        <button
          onClick={handleInstall}
          className="rounded-full bg-gradient-to-br from-accent to-accentDark px-5 py-2.5 text-sm font-semibold text-white shadow-soft active:scale-95"
        >
          Install
        </button>
      </div>
    </div>
  );
}
