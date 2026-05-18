// app/tunings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CrossLitHalos, StatusBar, HomeIndicator, BackChevron } from "@/components/chrome";
import { TUNINGS, FREE_TUNING_ID } from "@/lib/tunings";
import {
  isUnlocked,
  setUnlocked,
  getSelectedTuning,
  setSelectedTuning,
} from "@/lib/storage";

const PICK_PATH =
  "M 65 5 C 80 5, 124 13, 124 29 C 119 58, 88 118, 65 141 C 42 118, 11 58, 6 29 C 6 13, 50 5, 65 5 Z";

export default function TuningsPage() {
  const router = useRouter();
  const [unlocked, setUnlockedState] = useState(false);
  const [selected, setSelected] = useState(FREE_TUNING_ID);
  const [showUnlock, setShowUnlock] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUnlockedState(isUnlocked());
    setSelected(getSelectedTuning());
  }, []);

  const choose = (id: string) => {
    if (id !== FREE_TUNING_ID && !unlocked) {
      setShowUnlock(true);
      return;
    }
    setSelectedTuning(id);
    setSelected(id);
    router.push("/");
  };

  const doUnlock = () => {
    setUnlocked();
    setUnlockedState(true);
    setShowUnlock(false);
  };

  const sections = ["Standard", "Open"] as const;

  if (!mounted) return <div className="absolute inset-0 bg-bg-primary" />;

  return (
    <div className="absolute inset-0">
      <CrossLitHalos />
      <StatusBar />

      <button
        onClick={() => router.push("/")}
        className="absolute left-[14px] top-[48px] w-8 h-8 flex items-center justify-center z-10"
        aria-label="Back"
      >
        <BackChevron />
      </button>
      <div className="absolute top-[50px] left-0 right-0 flex items-center justify-center h-10">
        <span className="text-[17px] font-medium">Tunings</span>
      </div>

      <div className="absolute top-[104px] bottom-[20px] left-0 right-0 overflow-y-auto no-scrollbar px-[18px]">
        {sections.map((sec) => (
          <div key={sec}>
            <div className="text-[10px] tracking-wider uppercase text-text/45 font-medium mt-[18px] mb-2 ml-1 first:mt-1">
              {sec}
            </div>
            {TUNINGS.filter((t) => t.section === sec).map((t) => {
              const isSel = selected === t.id;
              const locked = t.id !== FREE_TUNING_ID && !unlocked;
              return (
                <button
                  key={t.id}
                  onClick={() => choose(t.id)}
                  className={`w-full flex items-center gap-3 p-[13px_14px] rounded-xl mb-2 border text-left ${
                    isSel
                      ? "bg-[rgba(255,216,154,0.1)] border-[rgba(255,216,154,0.45)]"
                      : "bg-[rgba(245,235,215,0.03)] border-[rgba(245,235,215,0.07)]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium">{t.name}</div>
                    <div className="text-[11px] text-text/50 mt-[3px] tracking-[1.5px]">
                      {t.notes.map((n) => n.replace(/\d+$/, "")).join(" ")}
                    </div>
                  </div>
                  {isSel && (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="rgba(255,216,154,0.15)" stroke="#FFD89A" strokeWidth="1.5" />
                      <path d="M7 12l3.5 3.5L17 8.5" stroke="#FFD89A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {locked && !isSel && (
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <rect x="6" y="11" width="12" height="9" rx="1.5" fill="none" stroke="#FFD89A" strokeWidth="2" />
                      <path d="M9 11 V8 a3 3 0 0 1 6 0 V11" fill="none" stroke="#FFD89A" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <HomeIndicator />

      {showUnlock && (
        <div className="absolute inset-0 z-40">
          <CrossLitHalos />
          <button
            onClick={() => setShowUnlock(false)}
            className="absolute left-[14px] top-[48px] w-8 h-8 flex items-center justify-center z-10"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <line x1="5" y1="5" x2="19" y2="19" stroke="#F5EBD7" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="#F5EBD7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute top-[110px] left-1/2 -translate-x-1/2">
            <svg width="96" height="112" viewBox="0 0 130 150">
              <defs>
                <clipPath id="ulc"><path d={PICK_PATH} /></clipPath>
                <radialGradient id="ulw" cx="75%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#FFD89A" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FFD89A" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="ulcl" cx="25%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#A8E9F4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#A8E9F4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g clipPath="url(#ulc)">
                <rect width="130" height="150" fill="url(#ulw)" />
                <rect width="130" height="150" fill="url(#ulcl)" />
              </g>
              <path d={PICK_PATH} fill="none" stroke="rgba(245,235,215,0.25)" strokeWidth="0.6" />
              <path d="M 65 5 C 80 5, 124 13, 124 29 C 119 58, 88 118, 65 141" stroke="#FFD89A" strokeWidth="1.7" fill="none" opacity="0.85" />
              <path d="M 65 5 C 50 5, 6 13, 6 29 C 11 58, 42 118, 65 141" stroke="#A8E9F4" strokeWidth="1.7" fill="none" opacity="0.7" />
            </svg>
          </div>

          <h1 className="absolute top-[250px] left-[30px] right-[30px] text-center text-[24px] font-medium tracking-tight">
            Unlock every tuning
          </h1>
          <p className="absolute top-[312px] left-9 right-9 text-center text-[13px] leading-relaxed text-text/60">
            One payment. Every alternate &amp; open tuning, plus unlimited custom
            tunings — forever.
          </p>

          <div className="absolute top-[392px] left-10 right-10 flex flex-col gap-[13px]">
            {[
              "Open G, Open D, DADGAD & more",
              "Unlimited custom tunings",
              "No subscription, no ads, ever",
            ].map((b) => (
              <div key={b} className="flex items-center gap-[11px] text-[13px]">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#7BDC9B" strokeWidth="1.5" />
                  <path d="M8 12l3 3 5-6" stroke="#7BDC9B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <button
            onClick={doUnlock}
            className="absolute bottom-[108px] left-[18px] right-[18px] h-[52px] bg-amber text-bg-primary rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2"
            style={{ boxShadow: "0 10px 28px rgba(255,216,154,0.25)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <rect x="6" y="11" width="12" height="9" rx="1.5" fill="none" stroke="#0A0E18" strokeWidth="2.2" />
              <path d="M9 11 V8 a3 3 0 0 1 6 0 V11" fill="none" stroke="#0A0E18" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Unlock all — $0.99
          </button>
          <button
            onClick={doUnlock}
            className="absolute bottom-[64px] left-0 right-0 text-center text-[12px] text-text/55"
          >
            Restore purchase
          </button>
          <HomeIndicator />
        </div>
      )}
    </div>
  );
}
