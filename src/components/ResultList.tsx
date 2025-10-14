import type { Attempt } from '@/types';

export default function ResultsList({ history }: { history: Attempt[] }) {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-800/60 shadow p-4 backdrop-blur">
      <div className="font-semibold mb-2">Senaste resultat</div>
      <ul className="space-y-2 text-sm">
        {history.length === 0 && <li className="opacity-60">Inga resultat ännu.</li>}
        {history.map((h, i) => (
          <li key={i} className="border rounded-xl p-2 bg-white/70 dark:bg-slate-900/50">
            <div className="flex justify-between">
              <span className="font-medium">{h.place}</span>
              <span className={h.correct ? 'text-emerald-600' : 'text-rose-600'}>
                {h.correct ? 'Rätt' : 'Fel'}
              </span>
            </div>
            <div className="opacity-70">
              <span>{h.mode === 'guess-location' ? 'Gissning' : 'Identifiering'}</span>
              {typeof h.distanceKm === 'number' && <span> · {h.distanceKm.toFixed(0)} km</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
