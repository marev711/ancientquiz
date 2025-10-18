import type { Place, Attempt, Mode } from "@/types";
import { QUIZ_DEFAULTS } from "./constants";

/**
 * Extract unique categories from places
 */
export function extractCategories(places: Place[]): string[] {
  const eras = new Set<string>();
  places.forEach((p) => eras.add(p.era || "Övrigt"));
  return [QUIZ_DEFAULTS.DEFAULT_CATEGORY, ...Array.from(eras).sort()];
}

/**
 * Filter places by category
 */
export function filterPlacesByCategory(
  places: Place[],
  category: string
): Place[] {
  if (category === QUIZ_DEFAULTS.DEFAULT_CATEGORY) return places;
  return places.filter((p) => (p.era || "Övrigt") === category);
}

/**
 * Select a random place from array
 */
export function selectRandomPlace(places: Place[]): Place | null {
  if (places.length === 0) return null;
  return places[Math.floor(Math.random() * places.length)];
}

/**
 * Create an attempt record
 */
export function createAttempt(
  mode: Mode,
  place: string,
  correct: boolean,
  distanceKm?: number
): Attempt {
  return {
    ts: Date.now(),
    mode,
    place,
    distanceKm,
    correct,
  };
}

/**
 * Format result message
 */
export function formatGuessResult(
  correct: boolean,
  placeName: string,
  distance: number,
  toleranceKm: number
): string {
  const status = correct ? "Rätt!" : "Nära…";
  return `${status} ${placeName} låg ${distance.toFixed(
    0
  )} km bort (gräns ${toleranceKm} km).`;
}

/**
 * Format identify result message
 */
export function formatIdentifyResult(
  correct: boolean,
  guessedName: string,
  correctName: string
): string {
  return correct ? `Rätt: ${guessedName}` : `Fel: Det var ${correctName}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
