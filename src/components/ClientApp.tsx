"use client";
import { useState, useEffect } from "react";
import type { Place } from "@/types";
import { useQuiz } from "@/hooks/useQuiz";
import Header from "@/components/Header";
import Controls from "@/components/Controls";
import MapView from "@/components/MapView";
import Scorebar from "@/components/Scorebar";
import ResultsList from "@/components/ResultsList";
import MobileDrawer from "@/components/MobileDrawer";
import CompletionToast from "@/components/CompletionToast";

export default function ClientApp({
  initialPlaces,
}: {
  initialPlaces: Place[];
}) {
  const q = useQuiz(initialPlaces);
  const [showControls, setShowControls] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  // Show completion toast when round finishes (only once)
  useEffect(() => {
    if (q.finished) {
      setShowCompletionToast(true);
    }
  }, [q.finished]);

  if (!q.places.length || !q.target) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Laddar karta & data…</div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col">
      <Header
        onToggleControls={() => setShowControls(!showControls)}
        onToggleResults={() => setShowResults(!showResults)}
      />

      {/* Collapsible Controls - Mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all ${
          showControls ? "max-h-96" : "max-h-0"
        }`}
      >
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
          onReset={() => {
            q.resetRound();
            setShowCompletionToast(false);
          }}
        />
      </div>

      {/* Desktop Controls */}
      <div className="hidden md:block">
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
          onReset={() => {
            q.resetRound();
            setShowCompletionToast(false);
          }}
        />
      </div>

      {/* Compact Scorebar */}
      <Scorebar
        target={q.target}
        score={q.score}
        roundSize={q.roundSize}
        toleranceKm={q.toleranceKm}
        lastResult={q.lastResult}
        finished={q.finished}
      />

      {/* Map and Results */}
      <div className="container flex-1 mt-3 md:mt-6 grid gap-4 md:gap-6 lg:grid-cols-[1fr_360px] pb-4 md:pb-12">
        <MapView
          mode={q.mode}
          places={q.filtered}
          target={q.target}
          lastTarget={q.lastTarget}
          lastResult={q.lastResult}
          onGuess={q.guessOnMap}
          onIdentify={q.identify}
          toleranceKm={q.toleranceKm}
        />

        {/* Desktop Results */}
        <div className="hidden lg:block">
          <ResultsList history={q.history} />
        </div>
      </div>

      {/* Mobile Results Drawer */}
      <MobileDrawer
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        title="Resultat"
      >
        <ResultsList history={q.history} />
      </MobileDrawer>

      {/* Compact Footer */}
      <footer className="container py-2 text-xs text-slate-500 text-center hidden md:block">
        Kartdata: © OpenStreetMap-medverkande
      </footer>

      {/* Completion Toast */}
      <CompletionToast
        isVisible={showCompletionToast}
        onClose={() => setShowCompletionToast(false)}
        score={q.score}
        roundSize={q.roundSize}
      />
    </main>
  );
}
