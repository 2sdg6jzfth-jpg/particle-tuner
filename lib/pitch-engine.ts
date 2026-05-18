// lib/pitch-engine.ts
// Implements ENGINE_SPEC.md: real-time pitch detection with the full smoothing
// pipeline (noise gate -> YIN/AMDF -> confidence gating -> octave guard ->
// median(5) -> adaptive EMA -> Schmitt-trigger hysteresis).
//
// Web Audio prototype. For native iOS the same pipeline maps onto AudioKit PitchTap.

import { YIN } from "pitchfinder";
import { analyzeFrequency } from "./tunings";

export interface PitchState {
  hasSignal: boolean;
  noteName: string;
  octave: number;
  // smoothed cents used to drive the needle (already EMA'd)
  displayCents: number;
  // raw (median-filtered) cents target
  targetCents: number;
  frequency: number;
  isInTune: boolean;
  confidence: number;
}

type Listener = (s: PitchState) => void;

const SAMPLE_RATE_TARGET = 44100;
const ANALYSIS_WINDOW = 1024; // samples fed to detector
const MIN_FREQ = 70;
const MAX_FREQ = 1400;

// Hysteresis (ENGINE_SPEC 4.8)
const ENTER_TUNE_CENTS = 4.0;
const EXIT_TUNE_CENTS = 8.0;
const HOLD_MS = 350;

export class PitchEngine {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private rafId: number | null = null;
  private buf: Float32Array | null = null;
  private analysisBuf: Float32Array = new Float32Array(ANALYSIS_WINDOW);

  private detect: ((b: Float32Array) => number | null) | null = null;

  private a4 = 440;
  private listener: Listener | null = null;

  // smoothing state
  private medianWindow: number[] = [];
  private displayCents = 0;
  private lastStableFreq = 0;
  private isInTune = false;
  private withinThresholdSince = 0;

  // adaptive noise floor
  private noiseFloorRms = 0.0015;
  private calibrated = false;
  private calibrationSamples: number[] = [];

  private lastState: PitchState = {
    hasSignal: false,
    noteName: "E",
    octave: 2,
    displayCents: 0,
    targetCents: 0,
    frequency: 0,
    isInTune: false,
    confidence: 0,
  };

  setReference(a4: number) {
    this.a4 = a4;
  }

  onUpdate(cb: Listener) {
    this.listener = cb;
  }

  async start(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    this.source = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048; // gives us >= ANALYSIS_WINDOW time-domain samples
    this.source.connect(this.analyser);
    this.buf = new Float32Array(this.analyser.fftSize);

    const sr = this.ctx.sampleRate || SAMPLE_RATE_TARGET;
    this.detect = YIN({ sampleRate: sr, threshold: 0.12 });

    this.loop();
  }

  stop(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.ctx?.close();
    this.ctx = null;
    this.stream = null;
    this.source = null;
    this.analyser = null;
  }

  // Pause detection while a reference tone plays so we don't hear ourselves.
  private muted = false;
  setMuted(m: boolean) {
    this.muted = m;
  }

  private rms(b: Float32Array): number {
    let s = 0;
    for (let i = 0; i < b.length; i++) s += b[i] * b[i];
    return Math.sqrt(s / b.length);
  }

  private median(arr: number[]): number {
    const a = [...arr].sort((x, y) => x - y);
    const mid = Math.floor(a.length / 2);
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
  }

  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);
    if (!this.analyser || !this.buf || !this.detect) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.analyser.getFloatTimeDomainData(this.buf as any);
    // copy into a standalone buffer (some YIN impls dislike subarray views)
    this.analysisBuf.set(this.buf.subarray(0, ANALYSIS_WINDOW));
    const window = this.analysisBuf;
    const level = this.rms(window);

    // --- adaptive noise floor calibration (first ~30 frames of quiet) ---
    if (!this.calibrated) {
      this.calibrationSamples.push(level);
      if (this.calibrationSamples.length >= 30) {
        const avg =
          this.calibrationSamples.reduce((a, b) => a + b, 0) /
          this.calibrationSamples.length;
        this.noiseFloorRms = Math.max(0.0015, avg * 3.5);
        this.calibrated = true;
      }
    }

    const now = performance.now();

    // --- noise gate (ENGINE_SPEC 4.1) ---
    if (this.muted || level < this.noiseFloorRms) {
      // hold last needle position, just mark no signal & keep easing toward last target
      this.easeNeedle(this.lastState.targetCents);
      this.emit({ ...this.lastState, hasSignal: false, displayCents: this.displayCents });
      return;
    }

    // --- pitch detection (ENGINE_SPEC 4.2) ---
    const freq = this.detect(window);
    if (!freq || freq < MIN_FREQ || freq > MAX_FREQ || !isFinite(freq)) {
      this.easeNeedle(this.lastState.targetCents);
      this.emit({ ...this.lastState, hasSignal: false, displayCents: this.displayCents });
      return;
    }

    // --- octave guard (ENGINE_SPEC 4.4) ---
    let f = freq;
    if (this.lastStableFreq > 0) {
      const ratio = f / this.lastStableFreq;
      if (ratio > 1.8 && ratio < 2.2) f = f / 2; // octave-up artifact
      else if (ratio > 0.45 && ratio < 0.55) f = f * 2; // octave-down artifact
    }

    const { noteName, octave, cents } = analyzeFrequency(f, this.a4);

    // --- median filter (ENGINE_SPEC 4.6) ---
    this.medianWindow.push(cents);
    if (this.medianWindow.length > 5) this.medianWindow.shift();
    const medCents = this.median(this.medianWindow);

    this.lastStableFreq = f;

    // --- adaptive EMA needle (ENGINE_SPEC 4.7) ---
    this.easeNeedle(medCents);

    // --- Schmitt-trigger hysteresis lock (ENGINE_SPEC 4.8) ---
    if (!this.isInTune) {
      if (Math.abs(this.displayCents) <= ENTER_TUNE_CENTS) {
        if (this.withinThresholdSince === 0) this.withinThresholdSince = now;
        if (now - this.withinThresholdSince >= HOLD_MS) this.isInTune = true;
      } else {
        this.withinThresholdSince = 0;
      }
    } else {
      if (Math.abs(this.displayCents) > EXIT_TUNE_CENTS) {
        this.isInTune = false;
        this.withinThresholdSince = 0;
      }
    }

    this.emit({
      hasSignal: true,
      noteName,
      octave,
      displayCents: this.displayCents,
      targetCents: medCents,
      frequency: f,
      isInTune: this.isInTune,
      confidence: 1,
    });
  };

  private easeNeedle(target: number) {
    const distance = Math.abs(target - this.displayCents);
    const alpha = Math.min(0.45, Math.max(0.15, 0.15 + (distance / 50) * 0.3));
    this.displayCents += alpha * (target - this.displayCents);
  }

  private emit(s: PitchState) {
    this.lastState = s;
    this.listener?.(s);
  }
}

// Reference tone player (ENGINE_SPEC 6)
export function playReferenceTone(freq: number, durationMs = 1800): () => void {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  osc2.frequency.value = freq * 2;
  osc.type = "sine";
  osc2.type = "sine";
  const g2 = ctx.createGain();
  g2.gain.value = 0.25;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
  gain.gain.setValueAtTime(0.3, ctx.currentTime + durationMs / 1000 - 0.1);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);
  osc.connect(gain);
  osc2.connect(g2);
  g2.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc2.start();
  osc.stop(ctx.currentTime + durationMs / 1000);
  osc2.stop(ctx.currentTime + durationMs / 1000);
  const stop = () => {
    try {
      osc.stop();
      osc2.stop();
      ctx.close();
    } catch {}
  };
  setTimeout(() => ctx.close().catch(() => {}), durationMs + 100);
  return stop;
}
