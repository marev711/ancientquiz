import type { Attempt } from "@/types";

export default function ResultsList({ history }: { history: Attempt[] }) {
  return (
    <div className="lg:rounded-2xl bg-white/80 dark:bg-slate-800/60 lg:shadow lg:p-4 backdrop-blur">
      <div className="font-semibold mb-3 hidden lg:block">Senaste resultat</div>
      <ul className="space-y-2 text-sm">
        {history.length === 0 && (
          <li className="opacity-60 text-center py-4">Inga resultat ännu.</li>
        )}
        {history.map((h, i) => (
          <li
            key={i}
            className="border rounded-xl p-3 bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium flex-1 pr-2">{h.place}</span>
              <span
                className={`font-semibold flex-shrink-0 ${
                  h.correct ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {h.correct ? "✓ Rätt" : "✗ Fel"}
              </span>
            </div>
            <div className="text-xs opacity-70">
              <span>
                {h.mode === "guess-location"
                  ? "📍 Gissning"
                  : "🔍 Identifiering"}
              </span>
              {typeof h.distanceKm === "number" && (
                <span> · {h.distanceKm.toFixed(0)} km</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
