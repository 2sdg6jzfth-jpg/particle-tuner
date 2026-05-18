// lib/storage.ts
"use client";

export interface Settings {
  referenceHz: number;
  haptic: boolean;
  chime: boolean;
  leftHanded: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  referenceHz: 440,
  haptic: true,
  chime: false,
  leftHanded: false,
};

export function getSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem("particle_tuner_settings");
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem("particle_tuner_settings", JSON.stringify(s));
}

export function isOnboarded(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("particle_tuner_onboarded") === "true";
}

export function setOnboarded() {
  if (typeof window === "undefined") return;
  localStorage.setItem("particle_tuner_onboarded", "true");
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("particle_tuner_unlocked") === "true";
}

export function setUnlocked() {
  if (typeof window === "undefined") return;
  localStorage.setItem("particle_tuner_unlocked", "true");
}

export function getSelectedTuning(): string {
  if (typeof window === "undefined") return "e-standard";
  return localStorage.getItem("particle_tuner_tuning") || "e-standard";
}

export function setSelectedTuning(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("particle_tuner_tuning", id);
}
