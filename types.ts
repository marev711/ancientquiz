export type Place = { id: string; name: string; lat: number; lng: number; era?: string; note?: string; };
export type Mode = 'guess-location' | 'identify-marker';
export type Attempt = { ts: number; mode: Mode; place: string; distanceKm?: number; correct: boolean; };
