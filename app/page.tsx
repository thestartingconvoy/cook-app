"use client";

import { useCallback, useEffect, useState } from "react";
import type { Menu } from "@/lib/types";
import {
  fetchAllMenus,
  fetchMenu,
  cacheMenu,
  getCachedMenu,
} from "@/lib/menus";
import {
  getSelection,
  selectMenu,
  resetAnchor,
  clearSelection,
} from "@/lib/storage";
import { downloadMenuAssets } from "@/lib/offline";
import MenuPicker from "@/components/MenuPicker";
import DownloadGate from "@/components/DownloadGate";
import DayView from "@/components/DayView";
import Sidebar from "@/components/Sidebar";

type View =
  | { kind: "loading" }
  | { kind: "picking"; menus: Menu[] }
  | { kind: "downloading"; menu: Menu }
  | { kind: "ready"; menu: Menu; anchorDate: string };

export default function Home() {
  const [view, setView] = useState<View>({ kind: "loading" });

  // Initial boot: show the saved day, or the picker on first run.
  const boot = useCallback(async () => {
    const selection = getSelection();
    if (selection) {
      // Prefer the offline copy; fall back to the network on first sync.
      const menu =
        (await getCachedMenu(selection.menuId)) ??
        (await fetchMenu(selection.menuId).catch(() => null));
      if (menu) {
        if (!(await getCachedMenu(menu.id))) await cacheMenu(menu);
        setView({ kind: "ready", menu, anchorDate: selection.anchorDate });
        return;
      }
    }
    const menus = await fetchAllMenus().catch(() => []);
    setView({ kind: "picking", menus });
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  async function handlePick(menu: Menu) {
    selectMenu(menu.id); // sets anchor to today
    await cacheMenu(menu);
    setView({ kind: "downloading", menu });
  }

  async function handleBackToMenus() {
    clearSelection();
    const menus = await fetchAllMenus().catch(() => []);
    setView({ kind: "picking", menus });
  }

  function handleDownloadDone(menu: Menu) {
    const selection = getSelection();
    setView({
      kind: "ready",
      menu,
      anchorDate: selection?.anchorDate ?? new Date().toISOString().slice(0, 10),
    });
  }

  async function handleChangeMenu() {
    clearSelection();
    const menus = await fetchAllMenus().catch(() => []);
    setView({ kind: "picking", menus });
  }

  // Refresh: re-pull the menu, re-cache, reset the anchor to today.
  async function handleRefresh() {
    const selection = getSelection();
    if (!selection) return;
    const fresh = await fetchMenu(selection.menuId).catch(() => null);
    if (!fresh) return;
    await cacheMenu(fresh);
    await downloadMenuAssets(fresh);
    const updated = resetAnchor(fresh.id);
    setView({ kind: "ready", menu: fresh, anchorDate: updated.anchorDate });
  }

  if (view.kind === "loading") {
    return <div className="min-h-dvh bg-cream" />;
  }

  if (view.kind === "picking") {
    return <MenuPicker menus={view.menus} onPick={handlePick} />;
  }

  if (view.kind === "downloading") {
    return (
      <DownloadGate
        menu={view.menu}
        onBack={handleBackToMenus}
        onDone={() => handleDownloadDone(view.menu)}
      />
    );
  }

  return (
    <>
      <Sidebar onChangeMenu={handleChangeMenu} onRefresh={handleRefresh} />
      <DayView menu={view.menu} anchorDate={view.anchorDate} />
    </>
  );
}
