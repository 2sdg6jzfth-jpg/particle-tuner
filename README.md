# Particle Tuner

A real, working guitar tuner web app. Cross-lit plectrum design, anchored
swinging needle, real microphone pitch detection with the full smoothing
pipeline (YIN detection → noise gate → median filter → adaptive EMA →
Schmitt-trigger hysteresis lock).

## Run it locally

You need Node.js 18+ installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in a browser. Allow microphone access when asked.
Best tested on a phone (open the deployed URL on mobile).

## Build (what Vercel runs)

```bash
npm run build
npm run start
```

If `npm run build` succeeds, Vercel will deploy cleanly.

## Deploy to Vercel

Easiest: install the Vercel CLI and run from this folder:

```bash
npm i -g vercel
vercel
```

Follow the prompts. You'll get a public URL. Open it on your phone and
"Add to Home Screen" for a near-native experience.

Alternatively: push this folder to a GitHub repo, then in the Vercel
dashboard "Add New Project" → import the repo → deploy. **Important:**
push the whole project (this folder with package.json), not just the docs.

## How it works

- `lib/pitch-engine.ts` — the audio engine. Web Audio API mic capture →
  YIN pitch detection (via `pitchfinder`) → the smoothing pipeline from the
  engine spec. Drives the needle at display-frame rate.
- `components/tuner-display.tsx` — the plectrum + anchored swinging needle.
  Needle pivot is fixed at SVG (145,300); it rotates like a speedometer.
  Cents → angle is non-linear (more travel near zero for fine-tuning).
- `app/page.tsx` — wires the engine to the display + string rail.
- Tunings, $0.99 unlock, settings, onboarding — all included.

## Accuracy notes

This is a Web Audio prototype. Browser mic pipelines vary; for absolute
best accuracy a native iOS build using AudioKit's PitchTap is the path
(the same pipeline applies). To sanity-check: play a known reference
(another tuner app or a tone generator) and confirm the note + needle.

Microphone requires HTTPS (or localhost). Vercel serves HTTPS, so the
deployed version will have mic access; opening the raw files will not.

## Monetization

Free on E Standard. The $0.99 one-time unlock (simulated here via
localStorage) unlocks all other tunings permanently. Real builds wire
this to StoreKit / Play Billing.
