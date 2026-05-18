# Particle Tuner — How to Run & Deploy This App

This folder (and the `.zip`) is the **actual app code** — not specs. This is the thing you deploy.

## What this is

A complete, working Next.js app: real microphone pitch detection, the
anchored swinging-needle plectrum, tunings, $0.99 unlock, settings,
onboarding. Everything we designed, as real code.

---

## Option A — Deploy without installing anything (easiest)

Use Vercel's website. You do NOT need a terminal for this path.

1. **Make a GitHub account** (github.com) if you don't have one.
2. **Create a new repository** (the green "New" button). Name it `particle-tuner`. Make it Public or Private, doesn't matter. Click "Create repository".
3. On the new empty repo page, click **"uploading an existing file"**.
4. **Drag in the contents of the `particle-tuner-app` folder** — IMPORTANT: drag the *contents* (the `app` folder, `components`, `lib`, `package.json`, etc.), NOT the outer folder itself. The `package.json` must be at the top level of the repo.
5. Click **"Commit changes"**.
6. Go to **vercel.com**, sign in with your GitHub account.
7. Click **"Add New… → Project"**.
8. Find your `particle-tuner` repo, click **"Import"**.
9. Leave all settings at their defaults (Vercel auto-detects Next.js). Click **"Deploy"**.
10. Wait ~2 minutes. You'll get a URL like `https://particle-tuner-xxx.vercel.app`.
11. **Open that URL on your phone.** Allow microphone access. Tune a guitar.

> The mic only works over HTTPS — Vercel provides that automatically, so the deployed version will work. (Opening the files directly on your computer will NOT have mic access.)

---

## Option B — Run locally first (needs Node.js + terminal)

1. Install Node.js 18+ from nodejs.org
2. Open a terminal in the `particle-tuner-app` folder
3. Run:
   ```
   npm install
   npm run build
   npm run dev
   ```
4. Open http://localhost:3000 — allow mic access. (Localhost is treated as secure so mic works.)
5. If `npm run build` succeeds, deploying to Vercel will succeed too.
6. To deploy: `npm i -g vercel` then `vercel` and follow prompts.

---

## If the build fails on Vercel

The most common cause is a dependency version. If Vercel shows a build
error, the fix is almost always:

1. Open `package.json`
2. Tell Claude Code (or any developer) the exact error text from the
   Vercel build log

The code itself is structured to avoid the usual Next.js pitfalls:
- All `localStorage` access is client-side only (guarded with `mounted`
  state + `"use client"`), so there's no server-render crash — this was
  the exact bug that produced your earlier 404.
- The first-launch onboarding redirect runs inside `useEffect`, not
  during render.

## Important: accuracy

This is a real pitch-detection engine (YIN algorithm via `pitchfinder`,
with the full noise-gate → median → adaptive-EMA → hysteresis pipeline
from the spec). In a browser it will be good, but browser audio varies
by device. Test it against a known reference (another tuner or a tone
generator app) and expect to nudge two constants if needed:

- `lib/pitch-engine.ts` → `noiseFloorRms` multiplier (line ~148): raise
  if it's too twitchy in a quiet room, lower if it won't pick up quiet
  playing.
- `lib/pitch-engine.ts` → YIN `threshold` (line ~97, currently 0.12):
  lower = more sensitive but more octave errors; higher = stabler but
  needs a cleaner pluck.

For absolute best accuracy, the native iOS path (AudioKit PitchTap) in
the ENGINE_SPEC applies — same pipeline, better audio access.

## File map

- `lib/pitch-engine.ts` — the engine (mic → YIN → smoothing pipeline)
- `lib/tunings.ts` — tuning definitions + frequency math
- `lib/storage.ts` — localStorage (settings, unlock, onboarding)
- `components/tuner-display.tsx` — plectrum + anchored swinging needle
- `components/string-rail.tsx` — the 6-string bottom rail
- `app/page.tsx` — main tuner screen
- `app/onboarding/*` — 3 onboarding screens
- `app/tunings/page.tsx` — tunings library + $0.99 unlock modal
- `app/settings/page.tsx` — settings (A=440 calibration, toggles)
