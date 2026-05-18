// lib/tunings.ts
// A tuning is six note names. Target Hz is computed from the user's reference pitch.

export interface Tuning {
  id: string;
  name: string;
  section: "Standard" | "Open" | "Custom";
  notes: string[]; // low -> high, e.g. ["E2","A2","D3","G3","B3","E4"]
}

export const TUNINGS: Tuning[] = [
  { id: "e-standard", name: "E Standard", section: "Standard", notes: ["E2", "A2", "D3", "G3", "B3", "E4"] },
  { id: "drop-d", name: "Drop D", section: "Standard", notes: ["D2", "A2", "D3", "G3", "B3", "E4"] },
  { id: "half-step-down", name: "Half-step down", section: "Standard", notes: ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"] },
  { id: "full-step-down", name: "Full-step down", section: "Standard", notes: ["D2", "G2", "C3", "F3", "A3", "D4"] },
  { id: "open-g", name: "Open G", section: "Open", notes: ["D2", "G2", "D3", "G3", "B3", "D4"] },
  { id: "open-d", name: "Open D", section: "Open", notes: ["D2", "A2", "D3", "F#3", "A3", "D4"] },
  { id: "open-c", name: "Open C", section: "Open", notes: ["C2", "G2", "C3", "G3", "C4", "E4"] },
  { id: "dadgad", name: "DADGAD", section: "Open", notes: ["D2", "A2", "D3", "G3", "A3", "D4"] },
];

export const FREE_TUNING_ID = "e-standard";

const NOTE_INDEX: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5,
  "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// "E2" -> MIDI number (E2 = 40)
export function midiFromNoteName(note: string): number {
  const m = note.match(/^([A-G]#?)(-?\d+)$/);
  if (!m) throw new Error("bad note " + note);
  const pc = NOTE_INDEX[m[1]];
  const octave = parseInt(m[2], 10);
  return (octave + 1) * 12 + pc;
}

// MIDI -> frequency given reference A4
export function freqFromMidi(midi: number, a4: number): number {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

export function targetHz(note: string, a4: number): number {
  return freqFromMidi(midiFromNoteName(note), a4);
}

// frequency -> { note name, octave, cents offset to nearest note }
export function analyzeFrequency(freq: number, a4: number) {
  const midiFloat = 69 + 12 * Math.log2(freq / a4);
  const nearest = Math.round(midiFloat);
  const cents = (midiFloat - nearest) * 100;
  const pc = ((nearest % 12) + 12) % 12;
  const octave = Math.floor(nearest / 12) - 1;
  return { noteName: SHARP_NAMES[pc], octave, cents, midi: nearest };
}

export function getTuningById(id: string): Tuning {
  return TUNINGS.find((t) => t.id === id) ?? TUNINGS[0];
}

// Given a detected frequency and a tuning, find the nearest string index (0..5)
export function nearestStringIndex(freq: number, tuning: Tuning, a4: number): number {
  let best = 0;
  let bestDelta = Infinity;
  tuning.notes.forEach((n, i) => {
    const t = targetHz(n, a4);
    const cents = Math.abs(1200 * Math.log2(freq / t));
    if (cents < bestDelta) {
      bestDelta = cents;
      best = i;
    }
  });
  return best;
}
