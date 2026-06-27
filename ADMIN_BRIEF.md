# Admin App — Build Brief

> Handoff doc for building the **admin** companion to this cook app. The admin
> app lives in a **separate repo** (`cook-admin`) and deploys as its **own
> Vercel project**. This file lives in the cook-app repo only as a
> cross-reference.

## Purpose
A private web app where the owner logs in (Google) and creates **menus** for the
cook app. Each menu is a list of days; each day has 3–5 meals (name + optional
image) and **one combined voice note** per day. On upload, the server
**generates TTS audio** for each day and stores it, so the cook app always has
real audio. Admin also exposes a **read API** the cook app fetches menus from.

## The contract that must not break (cook app depends on it)
The cook app already consumes this exact shape (see `lib/types.ts`). The admin's
public API must return an **array of `Menu`**:

```ts
interface Meal { name: string; image?: string | null; }
interface MenuDay {
  day: number;               // 1-indexed
  meals: Meal[];             // 3–5 items, order = cooking order (breakfast→dinner)
  voiceNote?: string | null; // URL to combined day audio; null => cook app uses browser TTS
}
interface Menu {
  id: string;                // stable slug, e.g. "north-indian-veg"
  name: string;
  cover?: string | null;
  days: MenuDay[];
}
```

- **Public read endpoint:** `GET /api/menus` → `Menu[]` (all published menus).
  Must be **CORS-enabled** for the cook app's origin and **cacheable**.
- (Optional) `GET /api/menus/:id` → single `Menu`.
- `voiceNote` and `image` are **absolute URLs** to stored files (work
  cross-origin and offline-cacheable).
- The cook app sets its own anchor date and does rotation math — **admin does
  not deal with dates/scheduling**. It only stores menu content.

> When the cook app switches from its mock `public/data/menus.json` to this API,
> that's a one-line change in its `lib/menus.ts` (`MENUS_URL`). Keep the shape
> identical.

## Core features
1. **Google login**, restricted to an allow-list of owner emails (env var).
   Everything behind auth except `GET /api/menus`.
2. **Menu CRUD:**
   - Create/rename/delete a menu; set cover image.
   - Add/reorder/delete **days**.
   - Per day: add 3–5 **meals** (name required, image optional), reorderable
     (order matters).
3. **Voice notes:** per day, **auto-generate TTS** from the meal names on save.
   Also allow **uploading a custom recording** that overrides TTS (cook app
   prefers the file; if absent, its own browser TTS is the final fallback — so
   TTS here is the "nice to have real audio" layer).
4. **Publish toggle** per menu (draft vs. live in `/api/menus`).
5. **Storage** of images + generated/uploaded audio in a blob store; URLs saved
   on the records.

## Suggested stack (decide in the new session)
- **Next.js (App Router) + TypeScript + Tailwind**, deployed on Vercel — mirrors
  the cook app.
- **Backend — pick one:**
  - **Supabase** (Postgres + Storage + Google auth in one) — simplest,
    recommended.
  - **Vercel-native:** Vercel Postgres (Neon) + Vercel Blob + Auth.js (NextAuth
    Google).
- **Auth:** Google OAuth, gate by `ALLOWED_ADMIN_EMAILS`.
- **TTS provider — pick one:**
  - **Google Cloud TTS** — best **en-IN / hi-IN** voices (recommended for India).
  - ElevenLabs (most natural, pricier) / OpenAI TTS (no dedicated Indian voice).
- **TTS language:** decide en-IN vs hi-IN, or add a **per-menu language
  dropdown**.

## Data model (relational sketch)
```
menus(id pk slug, name, cover_url, published bool, tts_lang, created_at)
days(id pk, menu_id fk, position int, voice_note_url, created_at)
meals(id pk, day_id fk, position int, name, image_url)
```
`day.position` and `meal.position` drive ordering; serialize to the `Menu` shape
above for the API.

## TTS-on-save flow
1. On day save, build text from meal names in order
   (e.g. `"Poha. Dal Chawal. Roti Aloo Gobi."`).
2. Call TTS provider (chosen lang) → audio (mp3).
3. Upload to blob storage → get URL → save as `days.voice_note_url`.
4. Custom uploaded recording, if present, takes precedence over generated.
5. Regenerate when meal names or language change.

## Env vars (template)
```
# auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALLOWED_ADMIN_EMAILS=satviks.2010@gmail.com
# db/storage (Supabase example)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
# tts (Google example)
GOOGLE_TTS_API_KEY=        # or service-account JSON
TTS_LANG=en-IN
```

## Deliverables for that session
1. New repo `cook-admin` (separate from `cook-app`), pushed.
2. Next.js admin app: Google-gated dashboard, menu/day/meal editor with image
   upload + reordering, publish toggle.
3. Server-side TTS generation on save + custom audio upload override.
4. Public `GET /api/menus` (CORS, cacheable) returning the `Menu[]` shape above.
5. README with env setup + Vercel deploy steps.
6. Note in README: update cook app's `lib/menus.ts` `MENUS_URL` to the admin's
   `/api/menus` once live.

## Constraints / notes
- Keep the cook-facing JSON shape **byte-compatible** with the interfaces above.
- File URLs must be absolute and CORS-accessible (cook app caches them via the
  Cache API for offline).
- The cook app is the simple/locked-down surface; **all complexity lives here**.
