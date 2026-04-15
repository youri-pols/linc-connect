import { PhaseCard } from "@/components/home/phase-card";
import { PhaseSection } from "@/components/my-path/phase-section";
import { getOnboardingPath } from "@/lib/mock-data/my-path";

export default async function MijnPadPage() {
  const path = await getOnboardingPath();

  /*
   * Expanded sections render the active phase first (most recent
   * work is top of mind) followed by completed phases in reverse
   * chronological order. Upcoming phases only appear as summary
   * tiles at the top of the page.
   */
  const expandedPhases = [...path.phases]
    .filter((p) => p.status !== "upcoming")
    .sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;
      return b.id.localeCompare(a.id);
    });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl p-4 lg:p-8 flex flex-col gap-8">
        {/* Header — role + progress */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex flex-col gap-4 min-w-0">
            <p className="text-body text-xs text-black/60">
              {path.roleName} · Week {path.currentWeek} van {path.totalWeeks}
            </p>
            <h1 className="font-display font-medium text-h2">Jouw onboardingpad</h1>
            <p className="text-body text-sm">
              Begeleider: {path.mentorName} · {path.progress}% voltooid
            </p>
          </div>
          <div className="flex flex-col items-end text-right">
            <p className="font-display font-medium text-h2 leading-none">
              {path.progress}%
            </p>
            <p className="text-body text-xs text-black/60">voltooid</p>
          </div>
        </div>

        {/* Divider between header and phase tiles */}
        <div className="h-px bg-black/15" />

        {/* Phase summary tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 shadow-card">
          {path.phases.map((phase) => (
            <PhaseCard
              key={phase.id}
              title={phase.title}
              status={phase.status}
              statusLabel={phase.statusLabel}
              subtitle={phase.subtitle}
              progress={phase.progress}
            />
          ))}
        </div>

        {/* Expanded phase sections — active first, then completed */}
        <div className="flex flex-col gap-4">
          {expandedPhases.map((phase) => (
            <PhaseSection key={phase.id} phase={phase} />
          ))}
        </div>
      </div>
    </div>
  );
}
