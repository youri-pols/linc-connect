"use client";

interface FilterItemProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

/*
 * Row in the kennisbank right-panel filter lists. The left border
 * is always 3px so the label stays horizontally aligned between
 * active and inactive states; only its colour flips to purple on
 * active. Click toggles the filter off (passing the same id twice
 * clears it).
 *
 * Active and hover share the same `purple/10` fill — active just
 * also paints the left border and bolds the label + count.
 */
export function FilterItem({ label, count, active, onClick }: FilterItemProps) {
  const containerClass = active
    ? "bg-purple/10 border-purple"
    : "border-transparent hover:bg-purple/10";

  const textWeight = active ? "font-bold" : "";
  const labelColor = active ? "text-black" : "text-black/70";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-1.5 border-l-3 transition-colors cursor-pointer ${containerClass}`}
    >
      <span className={`text-body text-sm leading-normal ${labelColor} ${textWeight}`}>
        {label}
      </span>
      {count !== undefined && (
        <span className={`text-body text-xs leading-normal text-black/60 ${textWeight}`}>
          {count}
        </span>
      )}
    </button>
  );
}
