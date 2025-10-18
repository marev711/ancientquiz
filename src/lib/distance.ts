import type { Coordinates } from "@/types";

/**
 * Earth's radius in kilometers
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param a First coordinate
 * @param b Second coordinate
 * @returns Distance in kilometers
 */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const a_formula =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  const c = 2 * Math.asin(Math.sqrt(a_formula));

  return EARTH_RADIUS_KM * c;
}

/**
 * Check if a guess is within tolerance
 */
export function isWithinTolerance(
  distance: number,
  toleranceKm: number
): boolean {
  return distance <= toleranceKm;
}
