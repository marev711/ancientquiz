'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Place, Mode, Attempt } from '@/types';
import { distanceKm } from '@/lib/distance';

export function useQuiz(initialPlaces: Place[]) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces); // 👈
  const [mode, setMode] = useState<Mode>('guess-location');
  const [category, setCategory] = useState<string>('Alla');
  const [toleranceKm, setToleranceKm] = useState<number>(50);
  const [roundSize, setRoundSize] = useState<number>(10);

  const [target, setTarget] = useState<Place | null>(null);
  const [lastResult, setLastResult] = useState<string>('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [history, setHistory] = useState<Attempt[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  // Om JSON ändras via hot-reload
  useEffect(() => { setPlaces(initialPlaces); }, [initialPlaces]);

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

  function registerAttempt(correct: boolean, dist?: number) {
    setScore(s => {
      const next = { correct: s.correct + (correct ? 1 : 0), total: s.total + 1 };
      if (next.total >= roundSize) setFinished(true);
      return next;
    });
    if (target) pushAttempt({ ts: Date.now(), mode, place: target.name, distanceKm: dist, correct });
  }

  function guessOnMap(lat: number, lng: number) {
    if (finished || mode !== 'guess-location' || !target) return;
    const d = distanceKm({ lat, lng }, { lat: target.lat, lng: target.lng });
    const ok = d <= toleranceKm;
    setLastResult(`${ok ? 'Rätt!' : 'Nära…'} ${target.name} låg ${d.toFixed(0)} km bort (gräns ${toleranceKm} km).`);
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
    places, filtered, categories, category, setCategory,
    mode, setMode,
    toleranceKm, setToleranceKm,
    roundSize, setRoundSize,
    target, lastResult, score, history, finished,
    guessOnMap, identify, resetRound,
  };
}
