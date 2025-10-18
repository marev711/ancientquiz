// Core domain types
export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  era?: string;
  note?: string;
}

export type Mode = "guess-location" | "identify-marker";

export interface Attempt {
  ts: number;
  mode: Mode;
  place: string;
  distanceKm?: number;
  correct: boolean;
}

// UI State types
export interface Score {
  correct: number;
  total: number;
}

export interface QuizState {
  places: Place[];
  filtered: Place[];
  categories: string[];
  category: string;
  mode: Mode;
  toleranceKm: number;
  roundSize: number;
  target: Place | null;
  lastTarget: Place | null;
  lastResult: string;
  score: Score;
  history: Attempt[];
  finished: boolean;
}

export interface QuizActions {
  setCategory: (category: string) => void;
  setMode: (mode: Mode) => void;
  setToleranceKm: (km: number) => void;
  setRoundSize: (size: number) => void;
  guessOnMap: (lat: number, lng: number) => void;
  identify: (place: Place) => void;
  resetRound: () => void;
}

// Coordinate type
export interface Coordinates {
  lat: number;
  lng: number;
}
