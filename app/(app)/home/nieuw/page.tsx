import { createClient } from "@/lib/supabase/server";
import { PhaseCard } from "@/components/home/phase-card";
import { TaskItem } from "@/components/home/task-item";
import { ShortcutItem } from "@/components/home/shortcut-item";
import { KnowledgeItem } from "@/components/home/knowledge-item";
import { TeamActivityItem } from "@/components/home/team-activity-item";
import { ArrowLink } from "@/components/ui/arrow-link";
import {
  getKnowledgePreviewsForNewEmployee,
  getOpenTasksForNewEmployee,
  getPhasesForNewEmployee,
  getShortcuts,
  getTeamActivityForNewEmployee,
} from "@/lib/mock-data/home";
import { formatDayAndMonth, getGreeting } from "@/lib/utils/format";

export default async function DashboardNieuw() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName: string = user?.user_metadata?.full_name ?? "";
  const firstName = fullName.split(" ")[0] || "daar";

  const [phases, tasks, shortcuts, knowledge, teamActivity] = await Promise.all([
    getPhasesForNewEmployee(),
    getOpenTasksForNewEmployee(),
    getShortcuts(),
    getKnowledgePreviewsForNewEmployee(),
    getTeamActivityForNewEmployee(),
  ]);

  const now = new Date();
  const greeting = getGreeting(now);
  const today = formatDayAndMonth(now);

  return (
    /*
     * Two-column layout. The main column is the only scroll
     * container on this page — the right aside stays pinned via
     * flex layout (no sticky needed) because the parent has a
     * fixed height from the AppShell.
     */
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col gap-6 lg:gap-10 p-4 lg:p-8">
        {/* Briefing header */}
        <div className="flex flex-col gap-3">
          <p className="text-body text-xs text-black/50">
            {today} · Jouw dagelijkse briefing
          </p>
          <div className="flex flex-col gap-4">
            <h1 className="font-display font-medium text-h1">
              {greeting}, {firstName}
            </h1>
            <p className="text-body text-sm">
              Je zit in module 2, week 2 van je Development onboardingpad. Er
              staan nog 3 taken open, waarvan je er vandaag één kunt afronden.
              Voltooi de hele module en verdien 250 XP!
            </p>
          </div>
        </div>

        {/*
         * Mobile shortcuts — the right aside is hidden below lg, but
         * the BHV contact and other emergency links need to stay
         * within reach, so we render them inline in the main column.
         */}
        <section className="lg:hidden flex flex-col gap-3">
          <h2 className="text-nav leading-normal text-black/60">Snelkoppelingen</h2>
          <div className="flex flex-col gap-1">
            {shortcuts.map((shortcut) => (
              <ShortcutItem key={shortcut.id} shortcut={shortcut} />
            ))}
          </div>
        </section>

        {/* Phase cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 shadow-card">
          {phases.map((phase) => (
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

        {/* Tasks section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-display font-medium text-sm">Mijn taken</h2>
            <ArrowLink href="/mijn-pad" className="font-display font-medium text-xs">
              Alle taken
            </ArrowLink>
          </div>
          <div className="bg-white border border-black/15 rounded-lg shadow-card overflow-hidden divide-y divide-black/15">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </section>

        {/* Team activity section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-display font-medium text-sm">Teamactiviteit</h2>
            <ArrowLink href="/team" className="font-display font-medium text-xs">
              Alles bekijken
            </ArrowLink>
          </div>
          <div className="bg-white border border-black/15 rounded-lg shadow-card overflow-hidden divide-y divide-black/15">
            {teamActivity.map((activity) => (
              <TeamActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </section>
      </div>

      {/* Right panel — hidden on < lg, static (no scroll) on desktop */}
      <aside className="hidden lg:flex w-71 shrink-0 bg-white border-l border-black/15 flex-col gap-6 p-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-nav leading-normal text-black/60">Snelkoppelingen</h2>
          <div className="flex flex-col gap-1">
            {shortcuts.map((shortcut) => (
              <ShortcutItem key={shortcut.id} shortcut={shortcut} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <h2 className="text-nav leading-normal text-black/60">Nieuw in kennisbank</h2>
          <div className="flex flex-col">
            {knowledge.map((item) => (
              <KnowledgeItem key={item.id} item={item} />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
