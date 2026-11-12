"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "./icons";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function getPhoneType(): "android" | "iphone" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("android")) return "android";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return "iphone";
  }
  return "other";
}

export default function AppInstallButton() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [phoneType, setPhoneType] = useState<"android" | "iphone" | "other">(
    "other"
  );

  useEffect(() => {
    setPhoneType(getPhoneType());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function handleInstallConsumed() {
      setInstallEvent(null);
      setOpen(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("cook-install-consumed", handleInstallConsumed);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("cook-install-consumed", handleInstallConsumed);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    setOpen(false);
    await installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
    window.dispatchEvent(new Event("cook-install-consumed"));
  }

  const instructionTitle =
    phoneType === "iphone" ? "Add to your Home Screen" : "Add a shortcut";

  const instructionBody =
    phoneType === "iphone"
      ? "Tap Share, then Add to Home Screen."
      : phoneType === "android"
        ? "Tap Chrome's ⋮ menu, then Add to Home screen or Install app."
        : "Open your browser menu and choose Add to Home screen or Install app.";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="surface fixed inset-x-5 bottom-5 z-40 mx-auto flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-ink shadow-soft active:scale-95"
      >
        <DownloadIcon className="h-4 w-4 text-accent" />
        Get the app
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/20 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-action-title"
        >
          <div className="surface w-full max-w-sm rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  id="install-action-title"
                  className="font-display text-xl font-medium tracking-tightest text-ink"
                >
                  {installEvent ? "Install the app" : instructionTitle}
                </div>
                <div className="mt-2 text-sm leading-6 text-ink/65">
                  {installEvent
                    ? "Add Kitchen to your phone for faster access."
                    : instructionBody}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-ink/50 active:scale-95"
              >
                ×
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-ink/60 active:scale-95"
              >
                Close
              </button>
              {installEvent && (
                <button
                  onClick={handleInstall}
                  className="rounded-full bg-gradient-to-br from-accent to-accentDark px-5 py-2.5 text-sm font-semibold text-white shadow-soft active:scale-95"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
