// app/onboarding/about/page.tsx
"use client";

import Link from "next/link";
import { CrossLitHalos, StatusBar, HomeIndicator } from "@/components/chrome";

const FEATURES = [
  {
    title: "Instant pitch detection",
    sub: "Auto-detects any string you play",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="#FFD89A" strokeWidth="2" />
        <path
          d="M12 7 V12 L15 14"
          stroke="#FFD89A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Standard tunings free",
    sub: "E Standard, Drop D, half-step down",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M5 6 H19 M5 12 H19 M5 18 H19" stroke="#FFD89A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Unlock everything once",
    sub: "Open + custom tunings · one-time $0.99",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          d="M12 3 L14 9 L20 9 L15 13 L17 20 L12 16 L7 20 L9 13 L4 9 L10 9 Z"
          fill="none"
          stroke="#FFD89A"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "No subscription, no ads",
    sub: "Buy once, own it forever",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          d="M3 12a9 9 0 1 0 9-9 M3 12 H8 M3 12 V7"
          stroke="#FFD89A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div className="absolute inset-0">
      <CrossLitHalos />
      <StatusBar />

      <h1 className="absolute top-[88px] left-6 right-6 text-center text-[26px] font-medium tracking-tight">
        Everything you need
      </h1>

      <div className="absolute top-[170px] left-10 right-10 flex flex-col gap-[26px]">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex items-center gap-[14px]">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[rgba(255,216,154,0.13)] flex items-center justify-center flex-shrink-0">
              {f.icon}
            </div>
            <div>
              <div className="text-[13px] font-medium">{f.title}</div>
              <div className="text-[12px] text-text/55 mt-0.5">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/onboarding/permission"
        className="absolute bottom-[120px] left-[18px] right-[18px] h-[52px] bg-amber text-bg-primary rounded-2xl font-medium text-[15px] flex items-center justify-center"
        style={{ boxShadow: "0 10px 28px rgba(255,216,154,0.22)" }}
      >
        Continue
      </Link>
      <Link
        href="/onboarding/permission"
        className="absolute bottom-[64px] left-0 right-0 text-center text-[12px] text-text/55"
      >
        Skip
      </Link>

      <HomeIndicator />
    </div>
  );
}
