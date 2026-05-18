// components/chrome.tsx
"use client";

export function CrossLitHalos({ green = false }: { green?: boolean }) {
  return (
    <>
      <div
        className="absolute -top-32 -left-28 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{
          background: green
            ? "radial-gradient(circle, rgba(120,220,150,0.16) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(232,160,74,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-36 -right-28 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: green
            ? "radial-gradient(circle, rgba(120,220,150,0.13) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(63,190,212,0.18) 0%, transparent 70%)",
        }}
      />
      {green && (
        <div
          className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(120,220,150,0.18) 0%, transparent 62%)",
          }}
        />
      )}
    </>
  );
}

export function StatusBar() {
  return (
    <div className="absolute top-3.5 left-0 right-0 flex justify-between items-center px-6 text-[13px] font-medium text-text z-20">
      <span>9:41</span>
      <span className="inline-flex gap-1.5 items-center opacity-80">
        <svg width="16" height="11" viewBox="0 0 16 11">
          <rect x="0" y="8" width="2.5" height="3" fill="#F5EBD7" />
          <rect x="4" y="6" width="2.5" height="5" fill="#F5EBD7" />
          <rect x="8" y="3.5" width="2.5" height="7.5" fill="#F5EBD7" />
          <rect x="12" y="0.5" width="2.5" height="10.5" fill="#F5EBD7" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11">
          <rect x="0" y="0.5" width="20" height="10" rx="2.5" fill="none" stroke="#F5EBD7" strokeWidth="1" />
          <rect x="2" y="2.5" width="13" height="6" rx="1" fill="#F5EBD7" />
          <rect x="21" y="3.5" width="2" height="4" rx="1" fill="#F5EBD7" />
        </svg>
      </span>
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[110px] h-1 bg-text/40 rounded-full z-30" />
  );
}

export function GearIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" fill="none" stroke="#F5EBD7" strokeWidth="2" />
      <path
        d="M12 2 V5 M12 19 V22 M4.2 4.2 L6.3 6.3 M17.7 17.7 L19.8 19.8 M2 12 H5 M19 12 H22 M4.2 19.8 L6.3 17.7 M17.7 6.3 L19.8 4.2"
        stroke="#F5EBD7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BackChevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        d="M15 5l-7 7 7 7"
        stroke="#F5EBD7"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
