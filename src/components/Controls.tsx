import type { Mode } from '@/types';

export default function Controls({
  categories, category, setCategory,
  mode, setMode,
  toleranceKm, setToleranceKm,
  roundSize, setRoundSize,
  onReset,
}: {
  categories: string[]; category: string; setCategory: (v: string) => void;
  mode: Mode; setMode: (v: Mode) => void;
  toleranceKm: number; setToleranceKm: (n: number) => void;
  roundSize: number; setRoundSize: (n: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="container mt-6">
      <div className="rounded-2xl bg-white/80 dark:bg-slate-800/60 shadow p-4 backdrop-blur flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Era</label>
          <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Läge</label>
          <select className="select" value={mode} onChange={e => setMode(e.target.value as Mode)}>
            <option value="guess-location">Gissa platsen</option>
            <option value="identify-marker">Identifiera plats</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Gräns (km)</label>
          <input type="number" min={5} max={500} step={5}
            className="input w-28"
            value={toleranceKm}
            onChange={e => setToleranceKm(Math.max(5, Math.min(500, Number(e.target.value) || 50)))} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-500">Frågor/runda</label>
          <input type="number" min={5} max={50} step={1}
            className="input w-24"
            value={roundSize}
            onChange={e => setRoundSize(Math.max(5, Math.min(50, Number(e.target.value) || 10)))} />
        </div>

        <button onClick={onReset}
          className="ml-auto btn">
          Starta om
        </button>
      </div>
    </div>
  );
}

/* Små Tailwind "component classes" via @apply – lägg i globals.css om du vill:
.select { @apply border rounded-xl px-3 py-2 bg-white/70 dark:bg-slate-900/60 shadow-inner; }
.input  { @apply border rounded-xl px-3 py-2 bg-white/70 dark:bg-slate-900/60 shadow-inner; }
.btn    { @apply rounded-xl px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition; }
*/
