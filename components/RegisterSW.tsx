"use client";

import { useEffect } from "react";
import { primeVoices } from "@/lib/audio";

/** Registers the offline service worker once on the client. */
export default function RegisterSW() {
  useEffect(() => {
    primeVoices(); // warm up the TTS voice list (incl. en-IN) early
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const onLoad = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
