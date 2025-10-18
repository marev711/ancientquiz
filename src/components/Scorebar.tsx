import type { Place } from "@/types";

export default function Scorebar({
  target,
  score,
  roundSize,
  toleranceKm,
  lastResult,
  finished,
}: {
  target: Place | null;
  score: { correct: number; total: number };
  roundSize: number;
  toleranceKm: number;
  lastResult: string;
  finished: boolean;
}) {
  return (
    <div className="container mt-2 md:mt-6">
      {/* Mobile: Compact 2-row layout */}
      <div className="md:hidden">
        <div className="rounded-xl bg-white/80 dark:bg-slate-800/70 shadow p-3 backdrop-blur space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-500">Mål</div>
              <div className="font-semibold truncate">
                {target?.name ?? "—"}
              </div>
            </div>
            <div className="text-right ml-3">
              <div className="text-xs text-slate-500">Poäng</div>
              <div className="font-semibold">
                {score.correct}/{score.total}{" "}
                <span className="text-xs text-slate-400">av {roundSize}</span>
              </div>
            </div>
          </div>
          {lastResult && (
            <div className="text-xs bg-white/50 dark:bg-slate-900/50 rounded-lg p-2">
              {lastResult}
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Original 4-column layout */}
      <div className="hidden md:grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow p-4 backdrop-blur">
          <div className="text-sm text-slate-500">Mål</div>
          <div className="font-semibold text-lg">{target?.name ?? "—"}</div>
        </div>
        <div className="rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow p-4 backdrop-blur">
          <div className="text-sm text-slate-500">Poäng</div>
          <div className="font-semibold text-lg">
            {score.correct} / {score.total}{" "}
            <span className="text-slate-400">av {roundSize}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow p-4 backdrop-blur">
          <div className="text-sm text-slate-500">Gräns</div>
          <div className="font-semibold text-lg">{toleranceKm} km</div>
        </div>
        <div className="rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow p-4 backdrop-blur">
          <div
            className={`text-sm ${
              finished ? "text-emerald-600" : "text-slate-500"
            }`}
          >
            {finished ? "Rundan klar" : "Pågår"}
          </div>
          <div className="text-sm">{lastResult || "—"}</div>
        </div>
      </div>
    </div>
  );
}
