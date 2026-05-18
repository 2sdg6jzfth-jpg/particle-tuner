// app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CrossLitHalos, StatusBar, HomeIndicator, BackChevron } from "@/components/chrome";
import {
  getSettings,
  saveSettings,
  isUnlocked,
  setUnlocked,
  Settings,
} from "@/lib/storage";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-[42px] h-[25px] rounded-full relative flex-shrink-0 transition-colors"
      style={{ background: on ? "#FFD89A" : "rgba(245,235,215,0.15)" }}
      aria-pressed={on}
    >
      <span
        className="absolute top-[2px] w-[21px] h-[21px] rounded-full transition-all"
        style={{
          background: on ? "#0A0E18" : "#F5EBD7",
          left: on ? "19px" : "2px",
        }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [s, setS] = useState<Settings>({
    referenceHz: 440,
    haptic: true,
    chime: false,
    leftHanded: false,
  });
  const [unlocked, setUnlockedState] = useState(false);

  useEffect(() => {
    setMounted(true);
    setS(getSettings());
    setUnlockedState(isUnlocked());
  }, []);

  const update = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);
    saveSettings(next);
  };

  const adjustRef = (delta: number) => {
    const next = Math.min(466, Math.max(415, s.referenceHz + delta));
    update({ referenceHz: next });
  };

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
        <span className="text-[17px] font-medium">Settings</span>
      </div>

      <div className="absolute top-[100px] bottom-[20px] left-0 right-0 overflow-y-auto no-scrollbar px-[18px]">
        {/* Tuning */}
        <div className="mb-[22px]">
          <div className="text-[10px] tracking-wider uppercase text-text/45 font-medium mb-2 ml-1">
            Tuning
          </div>
          <div className="bg-[rgba(245,235,215,0.03)] border border-[rgba(245,235,215,0.07)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-[14px] border-b border-[rgba(245,235,215,0.06)]">
              <span className="flex-1 text-[14px]">Reference pitch</span>
              <button
                onClick={() => adjustRef(-1)}
                className="w-7 h-7 rounded-full bg-[rgba(245,235,215,0.06)] flex items-center justify-center text-text/70"
              >
                −
              </button>
              <span className="text-[13px] tabular-nums w-[64px] text-center">
                A = {s.referenceHz} Hz
              </span>
              <button
                onClick={() => adjustRef(1)}
                className="w-7 h-7 rounded-full bg-[rgba(245,235,215,0.06)] flex items-center justify-center text-text/70"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-3 p-[14px]">
              <span className="flex-1 text-[14px]">Left-handed string order</span>
              <Toggle on={s.leftHanded} onClick={() => update({ leftHanded: !s.leftHanded })} />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mb-[22px]">
          <div className="text-[10px] tracking-wider uppercase text-text/45 font-medium mb-2 ml-1">
            Feedback
          </div>
          <div className="bg-[rgba(245,235,215,0.03)] border border-[rgba(245,235,215,0.07)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-[14px] border-b border-[rgba(245,235,215,0.06)]">
              <span className="flex-1 text-[14px]">Haptic on lock</span>
              <Toggle on={s.haptic} onClick={() => update({ haptic: !s.haptic })} />
            </div>
            <div className="flex items-center gap-3 p-[14px]">
              <span className="flex-1 text-[14px]">Chime on lock</span>
              <Toggle on={s.chime} onClick={() => update({ chime: !s.chime })} />
            </div>
          </div>
        </div>

        {/* Purchase */}
        <div className="mb-[22px]">
          <div className="text-[10px] tracking-wider uppercase text-text/45 font-medium mb-2 ml-1">
            Purchase
          </div>
          <div className="bg-[rgba(245,235,215,0.03)] border border-[rgba(245,235,215,0.07)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-[14px] border-b border-[rgba(245,235,215,0.06)]">
              <span className="flex-1 text-[14px]">All tunings</span>
              <span
                className="text-[13px]"
                style={{ color: unlocked ? "#7BDC9B" : "#F5EBD7", opacity: unlocked ? 1 : 0.5 }}
              >
                {unlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
            <button
              onClick={() => {
                setUnlocked();
                setUnlockedState(true);
              }}
              className="w-full text-left flex items-center gap-3 p-[14px]"
            >
              <span className="flex-1 text-[14px]">Restore purchase</span>
              <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-35">
                <path d="M9 6l6 6-6 6" stroke="#F5EBD7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="mb-[22px]">
          <div className="text-[10px] tracking-wider uppercase text-text/45 font-medium mb-2 ml-1">
            About
          </div>
          <div className="bg-[rgba(245,235,215,0.03)] border border-[rgba(245,235,215,0.07)] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-[14px]">
              <span className="flex-1 text-[14px]">Version</span>
              <span className="text-[13px] text-text/50">1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
}
