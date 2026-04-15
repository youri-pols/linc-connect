import Link from "next/link";
import { notFound } from "next/navigation";
import { AskMentorButton } from "@/components/my-path/ask-mentor-button";
import { ModuleTaskChecklist } from "@/components/my-path/module-task-checklist";
import { getOnboardingPath } from "@/lib/mock-data/my-path";

interface ModulePageProps {
  params: Promise<{ fase: string; module: string }>;
}

/*
 * Module detail page. Resolves the phase + module from the route
 * params, then hands the interactive checklist off to a client
 * component. Back-button label is derived from the phase's short
 * title so it always matches the breadcrumb.
 *
 * Neighbouring modules power the "Vorige module" / "Volgende
 * module" footer nav — only rendered when a neighbour exists.
 */
export default async function ModulePage({ params }: ModulePageProps) {
  const { fase, module: moduleId } = await params;
  const path = await getOnboardingPath();
  const phase = path.phases.find((p) => p.id === fase);
  const module = phase?.modules.find((m) => m.id === moduleId);

  if (!phase || !module) {
    notFound();
  }

  const moduleIndex = phase.modules.findIndex((m) => m.id === module.id);
  const totalModules = phase.modules.length;
  const prevModule = phase.modules[moduleIndex - 1];

  const backLabel = phase.sectionTitle.replace(/ -.*/, "");
  const tasks = module.tasks ?? [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <Link href={`/mijn-pad/${phase.id}`} className="w-fit flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
          <span className="icon h-4">arrow_back</span>
          Terug naar {backLabel}
        </Link>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-body text-xs text-black/50">
              Module {moduleIndex + 1} van {totalModules}
            </p>
            <div className="xp-pill-gradient-bg rounded-sm px-1.5 py-1 flex items-center justify-center">
              <span className="xp-pill-gradient-text text-body text-2xs leading-[1.1]">+{module.xpReward} XP</span>
            </div>
          </div>
          <h1 className="font-display font-medium text-h2">{module.title}</h1>
          <p className="text-body text-sm text-black/80">{module.description ?? phase.description}</p>
        </div>

        <div className="h-px bg-black/15" />

        {tasks.length > 0 ? <ModuleTaskChecklist initialTasks={tasks} xpReward={module.xpReward} /> : <div className="bg-white border border-black/15 rounded-lg shadow-card px-5 py-6 text-body text-sm text-black/60 text-center">Deze module heeft nog geen taken.</div>}

        {/*
         * Prev module on the left (if any), "ask mentor" on the
         * right. The mentor action is a plain external link to the
         * Google Chat direct-message URL for the user's mentor —
         * we don't build an in-app chat, per spec.
         */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {prevModule ? (
            <Link href={`/mijn-pad/${phase.id}/${prevModule.id}`} className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
              <span className="icon h-4">arrow_back</span>
              Vorige module
            </Link>
          ) : (
            <span />
          )}
          <AskMentorButton mentorName="Joost Bakkers" />
        </div>
      </div>
    </div>
  );
}
