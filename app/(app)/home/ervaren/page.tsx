import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/home/stat-card";
import { OpenQuestionItem } from "@/components/home/open-question-item";
import { ShortcutItem } from "@/components/home/shortcut-item";
import { KnowledgeItem } from "@/components/home/knowledge-item";
import { TeamActivityItem } from "@/components/home/team-activity-item";
import { ArrowLink } from "@/components/ui/arrow-link";
import {
  getKnowledgePreviewsForExperiencedEmployee,
  getOpenQuestionsForExperiencedEmployee,
  getShortcuts,
  getStatsForExperiencedEmployee,
  getTeamActivityForExperiencedEmployee,
} from "@/lib/mock-data/home";
import { formatDayAndMonth, getGreeting } from "@/lib/utils/format";

export default async function DashboardErvaren() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName: string = user?.user_metadata?.full_name ?? "";
  const firstName = fullName.split(" ")[0] || "daar";

  const [stats, openQuestions, shortcuts, knowledge, teamActivity] = await Promise.all([
    getStatsForExperiencedEmployee(),
    getOpenQuestionsForExperiencedEmployee(),
    getShortcuts(),
    getKnowledgePreviewsForExperiencedEmployee(),
    getTeamActivityForExperiencedEmployee(),
  ]);

  const now = new Date();
  const greeting = getGreeting(now);
  const today = formatDayAndMonth(now);

  return (
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
              3 nieuwe artikelen in de kennisbank deze week. Er staan 2 vragen
              open in Design die jij kunt beantwoorden.
            </p>
          </div>
        </div>

        {/*
         * Mobile shortcuts — the right aside is hidden below lg, but
         * BHV contacts and other quick links still need to be within
         * reach for the experienced view too.
         */}
        <section className="lg:hidden flex flex-col gap-3">
          <h2 className="text-nav leading-normal text-black/60">Snelkoppelingen</h2>
          <div className="flex flex-col gap-1">
            {shortcuts.map((shortcut) => (
              <ShortcutItem key={shortcut.id} shortcut={shortcut} />
            ))}
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 shadow-card">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Open vragen */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-display font-medium text-sm">Open vragen</h2>
            <ArrowLink href="/kennisbank" className="font-display font-medium text-xs">
              Bekijk kennisbank
            </ArrowLink>
          </div>
          <div className="bg-white border border-black/15 rounded-lg shadow-card overflow-hidden divide-y divide-black/15">
            {openQuestions.map((question) => (
              <OpenQuestionItem key={question.id} question={question} />
            ))}
          </div>
        </section>

        {/* Team activity */}
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

      {/* Right panel */}
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
