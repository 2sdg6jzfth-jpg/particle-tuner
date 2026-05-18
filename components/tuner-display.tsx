// components/tuner-display.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  hasSignal: boolean;
  noteName: string;
  octave: number;
  displayCents: number;
  isInTune: boolean;
}

// cents -> needle angle, non-linear for precision near zero (ENGINE_SPEC 5)
function centsToAngle(cents: number): number {
  const c = Math.max(-50, Math.min(50, cents));
  const sign = c < 0 ? -1 : 1;
  const norm = Math.abs(c) / 50;
  const curved = Math.pow(norm, 0.7);
  return sign * curved * 45; // -45..+45 degrees
}

const PICK_PATH =
  "M 145 14 C 178 14, 274 32, 274 66 C 264 130, 196 270, 145 322 C 94 270, 26 130, 16 66 C 16 32, 112 14, 145 14 Z";

export function TunerDisplay({
  hasSignal,
  noteName,
  octave,
  displayCents,
  isInTune,
}: Props) {
  const angle = centsToAngle(displayCents);

  // color state
  const color = !hasSignal
    ? "#5b6472"
    : isInTune
    ? "#7BDC9B"
    : displayCents < 0
    ? "#A8E9F4"
    : "#FFD89A";

  const dim = !hasSignal;

  // one-shot pulse when entering in-tune
  const [pulseKey, setPulseKey] = useState(0);
  const wasInTune = useRef(false);
  useEffect(() => {
    if (isInTune && !wasInTune.current) setPulseKey((k) => k + 1);
    wasInTune.current = isInTune;
  }, [isInTune]);

  return (
    <svg
      width="100%"
      viewBox="0 0 290 340"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxHeight: "100%", opacity: dim ? 0.55 : 1, transition: "opacity 0.25s" }}
    >
      <defs>
        <clipPath id="pickClip">
          <path d={PICK_PATH} />
        </clipPath>
        <radialGradient id="pWarm" cx="72%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#FFD89A" stopOpacity="0.26" />
          <stop offset="55%" stopColor="#FFD89A" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#FFD89A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pCool" cx="28%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#A8E9F4" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#A8E9F4" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#A8E9F4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pGreen" cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#7BDC9B" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#7BDC9B" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#7BDC9B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* body fill */}
      <g clipPath="url(#pickClip)">
        {isInTune ? (
          <rect width="290" height="340" fill="url(#pGreen)" />
        ) : (
          <>
            <rect width="290" height="340" fill="url(#pWarm)" />
            <rect width="290" height="340" fill="url(#pCool)" />
          </>
        )}
      </g>

      {/* outline */}
      {isInTune ? (
        <>
          <path d={PICK_PATH} fill="none" stroke="#7BDC9B" strokeWidth="2.5" opacity="0.9" />
          <path d={PICK_PATH} fill="none" stroke="#7BDC9B" strokeWidth="6" opacity="0.14" />
        </>
      ) : (
        <>
          <path d={PICK_PATH} fill="none" stroke="rgba(245,235,215,0.2)" strokeWidth="0.8" />
          <path
            d="M 145 14 C 178 14, 274 32, 274 66 C 264 130, 196 270, 145 322"
            stroke="#FFD89A"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 145 14 C 112 14, 16 32, 16 66 C 26 130, 94 270, 145 322"
            stroke="#A8E9F4"
            strokeWidth="2"
            fill="none"
            opacity="0.45"
          />
        </>
      )}

      {/* framing tick arc */}
      <path
        d="M 38 110 A 173 173 0 0 1 252 110"
        fill="none"
        stroke={isInTune ? "rgba(120,220,150,0.2)" : "rgba(245,235,215,0.1)"}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g stroke="rgba(245,235,215,0.18)" strokeWidth="2" strokeLinecap="round">
        <line x1="44" y1="128" x2="53" y2="120" />
        <line x1="78" y1="74" x2="88" y2="69" />
        <line x1="145" y1="56" x2="145" y2="42" />
        <line x1="212" y1="74" x2="202" y2="69" />
        <line x1="246" y1="128" x2="237" y2="120" />
      </g>
      <circle cx="145" cy="50" r="3.5" fill="rgba(245,235,215,0.4)" />

      {/* pulse ring on lock */}
      {isInTune && (
        <circle
          key={pulseKey}
          className="pulse-ring"
          cx="145"
          cy="54"
          r="14"
          fill="none"
          stroke="#7BDC9B"
          strokeWidth="2"
          style={{ transformOrigin: "145px 54px" }}
        />
      )}

      {/* the needle - anchored pivot at (145,300), rotates */}
      <g
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "145px 300px",
          transition: "transform 0.05s linear",
        }}
      >
        <line
          x1="145"
          y1="300"
          x2="145"
          y2="54"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="145" cy="54" r="7" fill={color} />
      </g>

      {/* fixed anchor hub */}
      <circle
        cx="145"
        cy="300"
        r="13"
        fill="#0A0E18"
        stroke={isInTune ? "rgba(120,220,150,0.5)" : "rgba(245,235,215,0.3)"}
        strokeWidth="2"
      />
      <circle cx="145" cy="300" r="5" fill={color} />

      {/* detected note */}
      <text
        x="145"
        y="262"
        textAnchor="middle"
        fontSize="74"
        fontWeight="200"
        fill={isInTune ? "#7BDC9B" : "#F5EBD7"}
        fontFamily="system-ui, sans-serif"
        letterSpacing="-2"
      >
        {hasSignal ? noteName : "—"}
      </text>
      {hasSignal && (
        <text
          x="193"
          y="246"
          textAnchor="middle"
          fontSize="21"
          fontWeight="300"
          fill={isInTune ? "rgba(120,220,150,0.4)" : "rgba(245,235,215,0.35)"}
          fontFamily="system-ui, sans-serif"
        >
          {octave}
        </text>
      )}
    </svg>
  );
}
