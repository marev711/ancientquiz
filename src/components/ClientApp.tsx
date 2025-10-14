"use client";
import Controls from "@/components/Controls";
import MapView from "@/components/MapView";
import Scorebar from "@/components/Scorebar";
import ResultsList from "@/components/ResultsList";
import { useQuiz } from "@/hooks/useQuiz";
import type { Place } from "@/types";

export default function ClientApp({
  initialPlaces,
}: {
  initialPlaces: Place[];
}) {
  const q = useQuiz(initialPlaces);
  console.log(q.places);

  if (!q.places.length || !q.target) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Laddar karta & data…</div>
      </main>
    );
  }

  return (
    <main className="pb-12">
      <header className="bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 dark:from-indigo-500/10 dark:to-emerald-500/10 border-b">
        <div className="container py-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Kart-quiz: Historiska & geografiska platser i Mellanöstern
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Välj läge, svårighet och antal frågor.
          </p>
        </div>
      </header>

      <Controls
        categories={q.categories}
        category={q.category}
        setCategory={q.setCategory}
        mode={q.mode}
        setMode={q.setMode}
        toleranceKm={q.toleranceKm}
        setToleranceKm={q.setToleranceKm}
        roundSize={q.roundSize}
        setRoundSize={q.setRoundSize}
        onReset={q.resetRound}
      />

      <Scorebar
        target={q.target}
        score={q.score}
        roundSize={q.roundSize}
        toleranceKm={q.toleranceKm}
        lastResult={q.lastResult}
        finished={q.finished}
      />

      <div className="container mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <MapView
          mode={q.mode}
          places={q.filtered}
          target={q.target}
          lastResult={q.lastResult}
          onGuess={q.guessOnMap}
          onIdentify={q.identify}
        />
        <ResultsList history={q.history} />
      </div>

      <footer className="container mt-8 text-xs text-slate-500">
        Kartdata: © OpenStreetMap-medverkande · Dataset från statisk JSON (ingen
        API-route).
      </footer>
    </main>
  );
}
