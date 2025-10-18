import { SettingsIcon, ClipboardIcon } from "./icons";

interface HeaderProps {
  onToggleControls: () => void;
  onToggleResults: () => void;
}

export default function Header({
  onToggleControls,
  onToggleResults,
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 dark:from-indigo-500/10 dark:to-emerald-500/10 border-b">
      <div className="container py-3 md:py-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-3xl font-bold tracking-tight">
            Kart-quiz
          </h1>
          <p className="hidden md:block text-slate-600 dark:text-slate-300 mt-1 text-sm">
            Historiska & geografiska platser i Mellanöstern
          </p>
        </div>

        {/* Mobile menu buttons */}
        <div className="flex gap-2 md:hidden">
          <button
            onClick={onToggleControls}
            className="p-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
            aria-label="Inställningar"
          >
            <SettingsIcon />
          </button>
          <button
            onClick={onToggleResults}
            className="p-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition"
            aria-label="Resultat"
          >
            <ClipboardIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
