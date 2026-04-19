import Image from "next/image";
import type { ProfileBadge } from "@/lib/mock-data/team-members";

interface BadgeGridProps {
  badges: ProfileBadge[];
}

/*
 * Earned-badges grid on the team member profile. Each badge is
 * a compact card: square badge image on top, two small caption
 * lines underneath (label + "+XP" in the gradient paint). Grid
 * wraps from 2 → 6 columns depending on available width.
 */
export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return <p className="text-body text-sm text-black/60">Nog geen badges verdiend.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {badges.map((badge) => (
        <div key={badge.src} className="flex flex-col gap-1.5 bg-white border border-black/15 rounded-lg shadow-card p-4">
          <div className="relative size-12">
            <Image src={badge.src} alt={badge.label} fill sizes="48px" className="object-contain" />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <p className="text-body text-11 text-black/60 leading-normal">{badge.label}</p>
            {typeof badge.xp === "number" && (
              <span className="xp-pill-gradient-bg rounded-sm px-1.5 py-1 flex items-center w-fit justify-center">
                <span className="xp-pill-gradient-text text-body text-2xs leading-pill">+{badge.xp} XP</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
