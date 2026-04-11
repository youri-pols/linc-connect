import type { HomeStat, StatAccent } from "@/lib/types/home";

interface StatCardProps {
  stat: HomeStat;
}

/*
 * Compact metric card used on the experienced and mentor homes.
 * Renders a big number with a supporting label, and optionally a
 * coloured caption underneath (e.g. "8 deze week" in green, "Wacht
 * op antwoord" in orange). The optional `captionIcon` is a Material
 * Symbols icon name rendered to the left of the caption.
 *
 * When `caption` is omitted the card is naturally shorter — the
 * mentor home uses this variant for the three summary tiles.
 */
const accentClass: Record<StatAccent, string> = {
  green: "text-green",
  orange: "text-orange",
  purple: "text-purple",
};

export function StatCard({ stat }: StatCardProps) {
  const { value, label, caption, captionAccent, captionIcon } = stat;

  return (
    <div className="flex-1 flex flex-col justify-between gap-6 bg-white border border-black/15 rounded-lg p-4">
      <div className="flex flex-col">
        <p className="font-display font-medium text-xl leading-card">{value}</p>
        <p className="text-body text-xs text-black/60 leading-card">{label}</p>
      </div>
      {caption && (
        <div className={`flex items-center gap-1 ${accentClass[captionAccent ?? "green"]}`}>
          {captionIcon && <span className="icon">{captionIcon}</span>}
          <p className="text-body text-xs font-medium">{caption}</p>
        </div>
      )}
    </div>
  );
}
