"use client";
import { useEffect, useState, useCallback } from "react";
import { CheckCircleIcon, XMarkIcon } from "./icons";

interface CompletionToastProps {
  isVisible: boolean;
  onClose: () => void;
  score: { correct: number; total: number };
  roundSize: number;
}

export default function CompletionToast({
  isVisible,
  onClose,
  score,
  roundSize,
}: CompletionToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, handleClose]);

  if (!isVisible && !isAnimating) {
    return null;
  }

  const percentage = Math.round((score.correct / roundSize) * 100);
  const isGoodScore = percentage >= 70;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`mx-4 max-w-sm rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl transform transition-all duration-300 ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon
              className={`w-8 h-8 ${
                isGoodScore ? "text-emerald-500" : "text-amber-500"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold">Rundan klar!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {score.correct} av {roundSize} rätt ({percentage}%)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Stäng"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                isGoodScore ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {isGoodScore ? "Bra jobbat!" : "Bra försök!"}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {isGoodScore
                ? "Du känner Mellanöstern väl!"
                : "Fortsätt öva för att bli bättre!"}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2 px-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl hover:opacity-90 transition"
          >
            Fortsätt
          </button>
        </div>
      </div>
    </div>
  );
}
