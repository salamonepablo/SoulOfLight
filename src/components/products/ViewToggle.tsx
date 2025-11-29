"use client";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

const GridIcon = () => (
  <svg
    aria-hidden
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="8" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
    <rect x="13" y="13" width="8" height="8" rx="2" />
  </svg>
);

const ListIcon = () => (
  <svg
    aria-hidden
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 6h12M9 12h12M9 18h12" />
    <circle cx="4" cy="6" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="4" cy="18" r="1.5" />
  </svg>
);

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`button-base button-ghost text-sm ${view === "grid" ? "border-emerald-100 text-emerald-700" : ""}`}
        onClick={() => onChange("grid")}
        aria-pressed={view === "grid"}
        aria-label="Ver en cuadrícula"
      >
        <GridIcon />
        Cuadrícula
      </button>
      <button
        type="button"
        className={`button-base button-ghost text-sm ${view === "list" ? "border-emerald-100 text-emerald-700" : ""}`}
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        aria-label="Ver en lista"
      >
        <ListIcon />
        Lista
      </button>
    </div>
  );
}
