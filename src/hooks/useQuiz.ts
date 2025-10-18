"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import type { Place, Mode, Attempt, Score } from "@/types";
import { distanceKm, isWithinTolerance } from "@/lib/distance";
import {
  extractCategories,
  filterPlacesByCategory,
  selectRandomPlace,
  createAttempt,
  formatGuessResult,
  formatIdentifyResult,
} from "@/lib/quiz-utils";
import { QUIZ_DEFAULTS } from "@/lib/constants";

export function useQuiz(initialPlaces: Place[]) {
  // Settings state
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [mode, setMode] = useState<Mode>("guess-location");
  const [category, setCategory] = useState<string>(
    QUIZ_DEFAULTS.DEFAULT_CATEGORY
  );
  const [toleranceKm, setToleranceKm] = useState<number>(
    QUIZ_DEFAULTS.TOLERANCE_KM
  );
  const [roundSize, setRoundSize] = useState<number>(QUIZ_DEFAULTS.ROUND_SIZE);

  // Game state
  const [target, setTarget] = useState<Place | null>(null);
  const [lastTarget, setLastTarget] = useState<Place | null>(null);
  const [lastResult, setLastResult] = useState<string>("");
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [history, setHistory] = useState<Attempt[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  // Update places on hot reload
  useEffect(() => {
    setPlaces(initialPlaces);
  }, [initialPlaces]);

  // Derive categories from places
  const categories = useMemo(() => extractCategories(places), [places]);

  // Filter places by category
  const filtered = useMemo(
    () => filterPlacesByCategory(places, category),
    [places, category]
  );

  // Set initial target when filtered list changes
  useEffect(() => {
    setTarget(selectRandomPlace(filtered));
  }, [filtered]);

  // Move to next target
  const nextTarget = useCallback(() => {
    setTarget(selectRandomPlace(filtered));
  }, [filtered]);

  // Add attempt to history (limited to MAX_HISTORY items)
  const pushAttempt = useCallback((attempt: Attempt) => {
    setHistory((prev) =>
      [attempt, ...prev].slice(0, QUIZ_DEFAULTS.MAX_HISTORY)
    );
  }, []);

  // Register an attempt and check if round is finished
  const registerAttempt = useCallback(
    (correct: boolean, dist?: number) => {
      setScore((prev) => {
        const next: Score = {
          correct: prev.correct + (correct ? 1 : 0),
          total: prev.total + 1,
        };
        if (next.total >= roundSize) {
          setFinished(true);
        }
        return next;
      });

      if (target) {
        pushAttempt(createAttempt(mode, target.name, correct, dist));
      }
    },
    [roundSize, target, mode, pushAttempt]
  );

  // Handle map guess
  const guessOnMap = useCallback(
    (lat: number, lng: number) => {
      if (finished || mode !== "guess-location" || !target) return;

      const distance = distanceKm({ lat, lng }, target);
      const correct = isWithinTolerance(distance, toleranceKm);

      setLastResult(
        formatGuessResult(correct, target.name, distance, toleranceKm)
      );
      setLastTarget(target); // Set lastTarget BEFORE registering attempt

      // Check if this will be the last question
      const willBeFinished = score.total + 1 >= roundSize;
      registerAttempt(correct, distance);

      // Only move to next target if not finished
      if (!willBeFinished) {
        nextTarget();
      }
    },
    [
      finished,
      mode,
      target,
      toleranceKm,
      registerAttempt,
      nextTarget,
      score.total,
      roundSize,
    ]
  );

  // Handle place identification
  const identify = useCallback(
    (place: Place) => {
      if (finished || mode !== "identify-marker" || !target) return;

      const correct = place.id === target.id;

      setLastResult(formatIdentifyResult(correct, place.name, target.name));
      setLastTarget(target); // Set lastTarget BEFORE registering attempt

      // Check if this will be the last question
      const willBeFinished = score.total + 1 >= roundSize;
      registerAttempt(correct);

      // Only move to next target if not finished
      if (!willBeFinished) {
        nextTarget();
      }
    },
    [
      finished,
      mode,
      target,
      registerAttempt,
      nextTarget,
      score.total,
      roundSize,
    ]
  );

  // Reset round to initial state
  const resetRound = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    setLastResult("");
    setLastTarget(null);
    setHistory([]);
    setFinished(false);
    nextTarget();
  }, [nextTarget]);

  return {
    // State
    places,
    filtered,
    categories,
    category,
    mode,
    toleranceKm,
    roundSize,
    target,
    lastTarget,
    lastResult,
    score,
    history,
    finished,
    // Actions
    setCategory,
    setMode,
    setToleranceKm,
    setRoundSize,
    guessOnMap,
    identify,
    resetRound,
  };
}
