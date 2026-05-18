// components/string-rail.tsx
"use client";

interface Props {
  notes: string[]; // e.g. ["E2","A2","D3","G3","B3","E4"]
  detectedIndex: number | null;
  tunedIndices: Set<number>;
  onTapString: (i: number) => void;
}

// strip octave for display: "E2" -> "E"
function letter(n: string) {
  return n.replace(/\d+$/, "");
}

export function StringRail({ notes, detectedIndex, tunedIndices, onTapString }: Props) {
  return (
    <div className="absolute bottom-[74px] left-0 right-0">
      <div className="flex justify-between items-end px-6">
        {notes.map((n, i) => {
          const isDetected = detectedIndex === i;
          const isTuned = tunedIndices.has(i);
          let btnCls =
            "w-[42px] h-[42px] rounded-full flex items-center justify-center text-sm font-medium transition-all border-[1.5px] ";
          if (isTuned) {
            btnCls +=
              "bg-[rgba(120,220,150,0.18)] border-green text-green";
          } else if (isDetected) {
            btnCls +=
              "bg-[rgba(93,211,232,0.16)] border-cyan-deep text-cyan";
          } else {
            btnCls +=
              "bg-[rgba(245,235,215,0.04)] border-[rgba(245,235,215,0.12)] text-text";
          }
          return (
            <div key={i} className="flex flex-col items-center gap-[7px]">
              <div
                className="w-[2px] h-6 rounded-full transition-colors"
                style={{
                  background: isTuned
                    ? "rgba(120,220,150,0.45)"
                    : isDetected
                    ? "rgba(93,211,232,0.4)"
                    : "rgba(245,235,215,0.18)",
                }}
              />
              <button
                className={btnCls}
                onClick={() => onTapString(i)}
                aria-label={`Play reference ${letter(n)}`}
                style={
                  isDetected
                    ? { boxShadow: "0 0 18px rgba(93,211,232,0.28)" }
                    : isTuned
                    ? { boxShadow: "0 0 14px rgba(120,220,150,0.22)" }
                    : undefined
                }
              >
                {letter(n)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
