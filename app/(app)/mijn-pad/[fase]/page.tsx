import Link from "next/link";
import { notFound } from "next/navigation";
import { PhaseCompleteDemoTrigger } from "@/components/my-path/phase-complete-demo-trigger";
import { PhaseModuleRow } from "@/components/my-path/phase-module-row";
import { getOnboardingPath } from "@/lib/mock-data/my-path";

interface FasePageProps {
  params: Promise<{ fase: string }>;
}

/*
 * Phase detail page. Renders a wider version of the module list
 * from the overview, with each row expanded to include its long
 * description. A lead paragraph under the heading explains what
 * the phase covers.
 */
export default async function FasePage({ params }: FasePageProps) {
  const { fase } = await params;
  const path = await getOnboardingPath();
  const phase = path.phases.find((p) => p.id === fase);

  if (!phase) {
    notFound();
  }

  /*
   * Derive the numbers that the celebration popup needs from the
   * phase data. `phaseNumber` is parsed from the id ("phase-2" → 2)
   * so the subtitle reads "Je hebt fase 2 voltooid". XP earned is
   * the sum of this phase's module rewards; running total and
   * target come from `path.xpEarned` / `path.xpTarget` on a real
   * run but are mocked here until the task-completion logic lands.
   */
  const phaseNumber = Number.parseInt(phase.id.replace(/^phase-/, ""), 10) || 1;
  const xpEarned = phase.modules.reduce((sum, m) => sum + m.xpReward, 0);
  const xpTarget = 1500;
  const xpTotal = phaseNumber * 300;
  const nextPhase = path.phases.find((p) => {
    const n = Number.parseInt(p.id.replace(/^phase-/, ""), 10) || 0;
    return n === phaseNumber + 1;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/mijn-pad"
            className="self-start flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors"
          >
            <span className="icon h-4">arrow_back</span>
            Terug naar Mijn pad
          </Link>
          <PhaseCompleteDemoTrigger
            userName="Youri"
            phaseLabel={phase.sectionTitle.replace(/^Week [^-]+ - /, "")}
            phaseNumber={phaseNumber}
            nextPhaseNumber={nextPhase ? phaseNumber + 1 : undefined}
            nextPhaseId={nextPhase?.id}
            xpEarned={xpEarned}
            xpTotal={xpTotal}
            xpTarget={xpTarget}
            badgeImageSrc="/images/badge-fase-2.webp"
            profileHref="/team/youri-pols"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="font-display font-medium text-h2">{phase.sectionTitle}</h1>
          <p className="text-body text-sm text-black/80">{phase.description}</p>
        </div>

        <div className="h-px bg-black/15" />

        <div className="flex flex-col bg-white border border-black/15 rounded-lg shadow-card overflow-hidden">
          {phase.modules.map((module, i) => (
            <PhaseModuleRow key={module.id} module={module} isLast={i === phase.modules.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
