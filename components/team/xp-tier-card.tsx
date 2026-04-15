interface XpTierCardProps {
  xp: number;
  tier: string;
  target: number;
  /** Total number of tiers in the path. */
  totalTiers?: number;
}

/*
 * Gradient XP/Tier card in the profile sidebar. Soft purple→
 * orange background, no border, and the heading is painted with
 * the same gradient via `background-clip: text` so it reads as a
 * coloured label rather than a plain one.
 *
 * - Header label: Roboto (text-body) — not Safiro — per design.
 * - Tier pill: plain white fill, no border. The max-tier number
 *   is bold to highlight "where am I out of …".
 * - XP number: medium-sized Safiro.
 * - Meta row: "Until next tier (1500 XP)" with the count in bold.
 */
export function XpTierCard({ xp, tier, target, totalTiers = 30 }: XpTierCardProps) {
  const pct = Math.min(100, (xp / target) * 100);
  const remaining = Math.max(0, target - xp);
  const currentTierNum = Number.parseInt(tier.match(/(\d+)/)?.[1] ?? "1", 10) || 1;

  return (
    <div
      className="flex flex-col gap-6 rounded-lg p-4"
      style={{
        backgroundImage: "linear-gradient(214deg, rgba(113, 97, 239, 0.1) 28%, rgba(236, 115, 87, 0.1) 72%)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-body text-sm font-medium leading-none bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(214deg, #7161ef 28%, #ec7357 72%)",
          }}
        >
          LiNC Connect Tier
        </p>
        <span className="bg-white rounded-sm px-1.5 py-1 text-body text-11 text-black leading-none">
          Tier {currentTierNum} / <span className="font-bold text-black">{totalTiers}</span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="font-display font-medium text-xl text-black leading-none">{xp} XP</p>
        <div className="flex flex-col gap-3">
          <div className="h-1 w-full rounded-full bg-white overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundImage: "linear-gradient(214deg, #7161ef 28%, #ec7357 72%)",
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-body text-11 text-black leading-none">{tier}</p>
            <p className="text-body text-11 text-black leading-none">
              Until next tier <span className="font-bold text-black">({remaining} XP)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
