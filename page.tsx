// app/page.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PitchEngine, PitchState, playReferenceTone } from "@/lib/pitch-engine";
import {
  getTuningById,
  targetHz,
  nearestStringIndex,
} from "@/lib/tunings";
import {
  isOnboarded,
  getSettings,
  getSelectedTuning,
} from "@/lib/storage";
import { CrossLitHalos, StatusBar, HomeIndicator, GearIcon } from "@/components/chrome";
import { TunerDisplay } from "@/components/tuner-display";
import { StringRail } from "@/components/string-rail";

export default function TunerPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const [state, setState] = useState<PitchState>({
    hasSignal: false,
    noteName: "E",
    octave: 2,
    displayCents: 0,
    targetCents: 0,
    frequency: 0,
    isInTune: false,
    confidence: 0,
  });

  const engineRef = useRef<PitchEngine | null>(null);
  const [tuningId, setTuningId] = useState("e-standard");
  const [a4, setA4] = useState(440);
  const [leftHanded, setLeftHanded] = useState(false);
  const [detectedIndex, setDetectedIndex] = useState<number | null>(null);
  const [tunedIndices, setTunedIndices] = useState<Set<number>>(new Set());

  // first-launch routing — client only (avoids SSR localStorage crash)
  useEffect(() => {
    setMounted(true);
    if (!isOnboarded()) {
      router.replace("/onboarding/welcome");
      return;
    }
    const s = getSettings();
    setA4(s.referenceHz);
    setLeftHanded(s.leftHanded);
    setTuningId(getSelectedTuning());
  }, [router]);

  const tuning = getTuningById(tuningId);
  const railNotes = leftHanded ? [...tuning.notes].reverse() : tuning.notes;

  // start engine
  useEffect(() => {
    if (!mounted || !isOnboarded()) return;
    const engine = new PitchEngine();
    engine.setReference(a4);
    engineRef.current = engine;

    engine.onUpdate((s) => {
      setState(s);
      if (s.hasSignal && s.frequency > 0) {
        const idx = nearestStringIndex(s.frequency, tuning, a4);
        const displayIdx = leftHanded ? tuning.notes.length - 1 - idx : idx;
        setDetectedIndex(displayIdx);
        if (s.isInTune) {
          setTunedIndices((prev) => {
            const next = new Set(prev);
            next.add(displayIdx);
            return next;
          });
        }
      } else {
        setDetectedIndex(null);
      }
    });

    engine
      .start()
      .then(() => setReady(true))
      .catch(() => setPermissionError(true));

    return () => engine.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, a4, tuningId, leftHanded]);

  const handleTapString = useCallback(
    (railIdx: number) => {
      const noteIdx = leftHanded ? tuning.notes.length - 1 - railIdx : railIdx;
      const note = tuning.notes[noteIdx];
      const f = targetHz(note, a4);
      engineRef.current?.setMuted(true);
      playReferenceTone(f, 1800);
      setTimeout(() => engineRef.current?.setMuted(false), 1950);
    },
    [tuning, a4, leftHanded]
  );

  if (!mounted) {
    return <div className="absolute inset-0 bg-bg-primary" />;
  }

  return (
    <div className="absolute inset-0">
      <CrossLitHalos green={state.isInTune} />
      <StatusBar />

      {/* brand wordmark */}
      <div className="absolute top-[50px] left-0 right-0 text-center text-[12px] font-medium tracking-[1.4px] uppercase text-text/45">
        Particle Tuner
      </div>

      {/* settings */}
      <Link
        href="/settings"
        className="absolute top-[46px] right-[18px] w-[30px] h-[30px] flex items-center justify-center z-10"
        aria-label="Settings"
      >
        <GearIcon />
      </Link>

      {/* tuning preset pill */}
      <Link
        href="/tunings"
        className="absolute top-[84px] left-1/2 -translate-x-1/2 flex items-center gap-2 px-[18px] py-[9px] bg-[rgba(245,235,215,0.04)] border border-[rgba(245,235,215,0.1)] rounded-pill text-[13px] font-medium z-10"
      >
        <span>{tuning.name}</span>
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path
            d="M6 9l6 6 6-6"
            stroke="#FFD89A"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* tuner zone */}
      <div className="absolute top-[128px] left-0 right-0 bottom-[150px] flex items-center justify-center px-2">
        <TunerDisplay
          hasSignal={state.hasSignal}
          noteName={state.noteName}
          octave={state.octave}
          displayCents={state.displayCents}
          isInTune={state.isInTune}
        />
      </div>

      <StringRail
        notes={railNotes}
        detectedIndex={detectedIndex}
        tunedIndices={tunedIndices}
        onTapString={handleTapString}
      />

      <div className="absolute bottom-[42px] left-0 right-0 text-center text-[11px] text-text/40">
        {permissionError
          ? "Microphone blocked — enable it in your browser settings"
          : !ready
          ? "Starting microphone…"
          : "Tap a string to hear its note · or just play"}
      </div>

      <HomeIndicator />
    </div>
  );
}
