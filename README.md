# Cook App

A dead-simple, image-and-voice PWA for a cook who can't read. After a one-time
setup (done by the owner), she only ever sees **today's meals** with a big play
button that reads them out loud.

## How it works

- **First run** → `MenuPicker`: tap a menu. This sets an *anchor date* (Day 1 =
  today) in `localStorage` and never asks again.
- **Save offline** → `DownloadGate`: confirms the choice and caches all images +
  voice notes so no internet is needed day to day.
- **Daily** → `DayView`: today's meals in order (1 = first cooked … etc.), a big
  primary play button for today, and a small button for **tomorrow's** meals to
  prep before leaving.
- **Rotation**: `currentDay = daysSince(anchor) % menu.days.length`. The menu
  loops forever — Day 43 → Day 1.
- **Hidden settings** (`Sidebar`, faint gear, top-left — not for the cook):
  - **Change menu** — back to the picker.
  - **Refresh menu** — re-pull from source, re-cache, reset anchor to today.

## Voice

Each day has one combined voice note (`voiceNote`). "Tomorrow's" audio is just
the next day's note (with wraparound) — no separate clip. If a note is missing,
the app falls back to browser **text-to-speech** transparently; the cook sees no
difference.

## Data

Currently mock data in `public/data/menus.json`. The cook app only talks to the
helpers in `lib/menus.ts`, so swapping in the admin API later is a one-file
change. Menus are also persisted in IndexedDB for offline boot.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · `idb` · custom service worker.

```bash
npm install
npm run dev
```
