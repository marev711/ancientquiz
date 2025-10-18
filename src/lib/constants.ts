// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [34.5, 43.5] as [number, number],
  DEFAULT_ZOOM: 6,
  MAX_ZOOM_IDENTIFY: 7,
  MAX_ZOOM_GUESS: 6,
  MIN_ZOOM: 4, // Prevent excessive zoom out
  MAX_ZOOM: 8, // Prevent excessive zoom in
  PADDING_IDENTIFY: [50, 50] as [number, number],
  PADDING_GUESS: [80, 80] as [number, number],
  ANIMATION_DURATION: 0.8,
  // Middle East bounds to prevent zooming outside region
  REGION_BOUNDS: {
    north: 42.0,
    south: 12.0,
    east: 60.0,
    west: 26.0,
  },
} as const;

// Quiz default settings
export const QUIZ_DEFAULTS = {
  TOLERANCE_KM: 100,
  ROUND_SIZE: 10,
  MAX_HISTORY: 10,
  DEFAULT_CATEGORY: "Alla",
} as const;

// Input constraints
export const INPUT_CONSTRAINTS = {
  TOLERANCE_MIN: 1,
  TOLERANCE_MAX: 500,
  ROUND_SIZE_MIN: 5,
  ROUND_SIZE_MAX: 50,
  MIN_TOUCH_TARGET: 44, // px - iOS/Android minimum
} as const;

// Map marker styles
export const MARKER_STYLES = {
  IDENTIFY: {
    color: "#2563eb",
    fillColor: "#60a5fa",
    radius: 8,
    weight: 2,
    fillOpacity: 0.7,
  },
  ANSWER: {
    color: "#16a34a",
    fillColor: "#86efac",
    radius: 9,
    weight: 3,
    fillOpacity: 0.8,
  },
  TOLERANCE_CIRCLE: {
    color: "#16a34a",
    fillColor: "#86efac",
    fillOpacity: 0.15,
    weight: 2,
    dashArray: "5, 5",
  },
} as const;

// Tile layer
export const TILE_LAYER = {
  URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
} as const;
