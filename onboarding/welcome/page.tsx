// app/onboarding/welcome/page.tsx
"use client";

import Link from "next/link";
import { CrossLitHalos, StatusBar, HomeIndicator } from "@/components/chrome";
import { setUnlocked } from "@/lib/storage";

const PICK_PATH =
  "M 65 5 C 80 5, 124 13, 124 29 C 119 58, 88 118, 65 141 C 42 118, 11 58, 6 29 C 6 13, 50 5, 65 5 Z";

export default function Welcome() {
  return (
    <div className="absolute inset-0">
      <CrossLitHalos />
      <StatusBar />

      <div className="absolute top-[150px] left-1/2 -translate-x-1/2">
        <svg width="130" height="150" viewBox="0 0 130 150">
          <defs>
            <clipPath id="wc">
              <path d={PICK_PATH} />
            </clipPath>
            <radialGradient id="ww" cx="75%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFD89A" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FFD89A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wcl" cx="25%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#A8E9F4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#A8E9F4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g clipPath="url(#wc)">
            <rect width="130" height="150" fill="url(#ww)" />
            <rect width="130" height="150" fill="url(#wcl)" />
          </g>
          <path d={PICK_PATH} fill="none" stroke="rgba(245,235,215,0.25)" strokeWidth="0.6" />
          <path
            d="M 65 5 C 80 5, 124 13, 124 29 C 119 58, 88 118, 65 141"
            stroke="#FFD89A"
            strokeWidth="1.7"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M 65 5 C 50 5, 6 13, 6 29 C 11 58, 42 118, 65 141"
            stroke="#A8E9F4"
            strokeWidth="1.7"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </div>

      <h1 className="absolute top-[330px] left-6 right-6 text-center text-[28px] font-medium tracking-tight">
        Particle Tuner
      </h1>
      <p className="absolute top-[388px] left-9 right-9 text-center text-[14px] leading-relaxed text-text/65">
        The fastest, most accurate way to tune your guitar — beautifully simple.
      </p>

      <Link
        href="/onboarding/about"
        className="absolute bottom-[120px] left-[18px] right-[18px] h-[52px] bg-amber text-bg-primary rounded-2xl font-medium text-[15px] flex items-center justify-center"
        style={{ boxShadow: "0 10px 28px rgba(255,216,154,0.22)" }}
      >
        Get started
      </Link>
      <button
        onClick={() => {
          setUnlocked();
          window.location.href = "/onboarding/about";
        }}
        className="absolute bottom-[64px] left-0 right-0 text-center text-[12px] text-text/55"
      >
        Restore purchase
      </button>

      <HomeIndicator />
    </div>
  );
}
