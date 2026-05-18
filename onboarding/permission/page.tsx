// app/onboarding/permission/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { CrossLitHalos, StatusBar, HomeIndicator } from "@/components/chrome";
import { setOnboarded } from "@/lib/storage";

export default function Permission() {
  const router = useRouter();

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop()); // release; engine reacquires
    } catch {
      // denied — still proceed; tuner shows blocked state
    }
    setOnboarded();
    router.replace("/");
  };

  const skip = () => {
    setOnboarded();
    router.replace("/");
  };

  return (
    <div className="absolute inset-0">
      <CrossLitHalos />
      <StatusBar />

      <div className="absolute top-[170px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full bg-[rgba(255,216,154,0.12)] flex items-center justify-center">
        <svg width="38" height="38" viewBox="0 0 24 24">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="none" stroke="#FFD89A" strokeWidth="2" />
          <path d="M6 11 a6 6 0 0 0 12 0" fill="none" stroke="#FFD89A" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="17" x2="12" y2="21" stroke="#FFD89A" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="21" x2="16" y2="21" stroke="#FFD89A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="absolute top-[300px] left-6 right-6 text-center text-[24px] font-medium tracking-tight">
        Microphone access
      </h1>
      <p className="absolute top-[358px] left-9 right-9 text-center text-[13px] leading-relaxed text-text/60">
        Particle Tuner listens to your guitar to detect pitch. Audio is processed
        live on your device and never recorded or stored.
      </p>

      <button
        onClick={requestMic}
        className="absolute bottom-[120px] left-[18px] right-[18px] h-[52px] bg-amber text-bg-primary rounded-2xl font-medium text-[15px] flex items-center justify-center"
        style={{ boxShadow: "0 10px 28px rgba(255,216,154,0.22)" }}
      >
        Allow microphone
      </button>
      <button
        onClick={skip}
        className="absolute bottom-[64px] left-0 right-0 text-center text-[12px] text-text/55"
      >
        Maybe later
      </button>

      <HomeIndicator />
    </div>
  );
}
