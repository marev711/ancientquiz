'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place, Mode, Attempt } from '@/types';
import { distanceKm } from '@/lib/distance';

export function useQuiz() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [mode, setMode] = useState<Mode>('guess-location');
  const [category, setCategory] = useState<string>('Alla');
  const [toleranceKm, setToleranceKm] = useState<number>(50);
  const [roundSize, setRoundSize] = useState<number>(10);

  const [target, setTarget] = useState<Place | null>(null);
  const [lastResult, setLastResult] = useState<string>('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [history, setHistory] = useState<Attempt[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  // ladda data
  useEffect(() => { fetch('/api/places').then(r => r.json()).then((d: Place[]) => setPlaces(d)); }, []);

  const categories = useMemo(() => {
    const eras = new Set<string>();
    for (const p of places) eras.add(p.era || 'Övrigt');
    return ['Alla', ...Array.from(eras).sort()];
  }, [places]);

  const filtered = useMemo(() => {
    if (category === 'Alla') return places;
    return places.filter(p => (p.era || 'Övrigt') === category);
  }, [places, category]);

  useEffect(() => {
    if (!filtered.length) { setTarget(null); return; }
    setTarget(filtered[Math.floor(Math.random() * filtered.length)]);
  }, [filtered]);

  function nextTarget() {
    if (!filtered.length) return;
    setTarget(filtered[Math.floor(Math.random() * filtered.length)]);
  }

  function pushAttempt(a: Attempt) {
    setHistory(h => [a, ...h].slice(0, 10));
  }

  function registerAttempt(correct: boolean, distanceKmVal?: number) {
    setScore(s => {
      const next = { correct: s.correct + (correct ? 1 : 0), total: s.total + 1 };
      if (next.total >= roundSize) setFinished(true);
      return next;
    });
    if (target) pushAttempt({ ts: Date.now(), mode, place: target.name, distanceKm: distanceKmVal, correct });
  }

  // interaktioner (karta)
  function guessOnMap(lat: number, lng: number) {
    if (finished || mode !== 'guess-location' || !target) return;
    const guess = { lat, lng };
    const truth = { lat: target.lat, lng: target.lng };
    const d = distanceKm(guess, truth);
    const ok = d <= toleranceKm;
    setLastResult(`${ok ? 'Rätt!' : 'Nära…'} ${target.name} låg ${d.toFixed(0)} km från din gissning. (gräns ${toleranceKm} km)`);
    registerAttempt(ok, d);
    if (!finished) nextTarget();
  }

  function identify(place: Place) {
    if (finished || mode !== 'identify-marker' || !target) return;
    const ok = place.id === target.id;
    setLastResult(ok ? `Rätt: ${place.name}` : `Fel: Det var ${target.name}`);
    registerAttempt(ok);
    if (!finished) nextTarget();
  }

  function resetRound() {
    setScore({ correct: 0, total: 0 });
    setLastResult('');
    setHistory([]);
    setFinished(false);
    nextTarget();
  }

  return {
    // state
    places, filtered, categories, category, setCategory,
    mode, setMode,
    toleranceKm, setToleranceKm,
    roundSize, setRoundSize,
    target, lastResult, score, history, finished,
    // actions
    guessOnMap, identify, resetRound,
  };
}
