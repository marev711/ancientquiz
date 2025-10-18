import type { Mode } from "@/types";
import { INPUT_CONSTRAINTS, QUIZ_DEFAULTS } from "@/lib/constants";
import { clamp } from "@/lib/quiz-utils";

interface ControlsProps {
  categories: string[];
  category: string;
  setCategory: (v: string) => void;
  mode: Mode;
  setMode: (v: Mode) => void;
  toleranceKm: number;
  setToleranceKm: (n: number) => void;
  roundSize: number;
  setRoundSize: (n: number) => void;
  onReset: () => void;
}

export default function Controls({
  categories,
  category,
  setCategory,
  mode,
  setMode,
  toleranceKm,
  setToleranceKm,
  roundSize,
  setRoundSize,
  onReset,
}: ControlsProps) {
  const handleToleranceChange = (value: string) => {
    const num = Number(value) || QUIZ_DEFAULTS.TOLERANCE_KM;
    setToleranceKm(
      clamp(
        num,
        INPUT_CONSTRAINTS.TOLERANCE_MIN,
        INPUT_CONSTRAINTS.TOLERANCE_MAX
      )
    );
  };

  const handleRoundSizeChange = (value: string) => {
    const num = Number(value) || QUIZ_DEFAULTS.ROUND_SIZE;
    setRoundSize(
      clamp(
        num,
        INPUT_CONSTRAINTS.ROUND_SIZE_MIN,
        INPUT_CONSTRAINTS.ROUND_SIZE_MAX
      )
    );
  };

  return (
    <div className="container mt-2 md:mt-6">
      <div className="rounded-xl md:rounded-2xl bg-white/80 dark:bg-slate-800/60 shadow p-3 md:p-4 backdrop-blur flex flex-wrap gap-2 md:gap-3 items-end">
        <div className="flex flex-col flex-1 min-w-[120px]">
          <label
            htmlFor="category-select"
            className="text-xs text-slate-500 mb-1"
          >
            Era
          </label>
          <select
            id="category-select"
            className="select min-h-[44px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[140px]">
          <label htmlFor="mode-select" className="text-xs text-slate-500 mb-1">
            Läge
          </label>
          <select
            id="mode-select"
            className="select min-h-[44px]"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            <option value="guess-location">Gissa platsen</option>
            <option value="identify-marker">Identifiera plats</option>
          </select>
        </div>

        <div className="flex flex-col w-20 md:w-28">
          <label
            htmlFor="tolerance-input"
            className="text-xs text-slate-500 mb-1"
          >
            Gräns
          </label>
          <input
            id="tolerance-input"
            type="number"
            min={INPUT_CONSTRAINTS.TOLERANCE_MIN}
            max={INPUT_CONSTRAINTS.TOLERANCE_MAX}
            step={1}
            className="input min-h-[44px] text-center"
            value={toleranceKm}
            onChange={(e) => handleToleranceChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-20 md:w-24">
          <label
            htmlFor="round-size-input"
            className="text-xs text-slate-500 mb-1"
          >
            Frågor
          </label>
          <input
            id="round-size-input"
            type="number"
            min={INPUT_CONSTRAINTS.ROUND_SIZE_MIN}
            max={INPUT_CONSTRAINTS.ROUND_SIZE_MAX}
            step={1}
            className="input min-h-[44px] text-center"
            value={roundSize}
            onChange={(e) => handleRoundSizeChange(e.target.value)}
          />
        </div>

        <button
          onClick={onReset}
          className="btn min-h-[44px] px-4 md:px-6 md:ml-auto"
        >
          Starta om
        </button>
      </div>
    </div>
  );
}
