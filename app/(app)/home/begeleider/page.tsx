import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/home/stat-card";
import { MenteeCard } from "@/components/home/mentee-card";
import { CheckInItem } from "@/components/home/check-in-item";
import { ShortcutItem } from "@/components/home/shortcut-item";
import { TeamActivityItem } from "@/components/home/team-activity-item";
import { ArrowLink } from "@/components/ui/arrow-link";
import {
  getMenteesForMentor,
  getShortcuts,
  getStatsForMentor,
  getTeamActivityForMentor,
  getUpcomingCheckInsForMentor,
} from "@/lib/mock-data/home";
import { formatDayAndMonth, getGreeting } from "@/lib/utils/format";

export default async function DashboardBegeleider() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName: string = user?.user_metadata?.full_name ?? "";
  const firstName = fullName.split(" ")[0] || "daar";

  const [stats, mentees, checkIns, shortcuts, teamActivity] = await Promise.all([
    getStatsForMentor(),
    getMenteesForMentor(),
    getUpcomingCheckInsForMentor(),
    getShortcuts(),
    getTeamActivityForMentor(),
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
              Je begeleidt op dit moment {mentees.length} nieuwe medewerkers.
              Vincent heeft een taak niet meer bijgewerkt in 4 dagen.
            </p>
          </div>
        </div>

        {/*
         * Mobile shortcuts — the right aside is hidden below lg, so
         * shortcuts (incl. BHV) stay inline on the mentor view too.
         */}
        <section className="lg:hidden flex flex-col gap-3">
          <h2 className="text-nav leading-normal text-black/60">Snelkoppelingen</h2>
          <div className="flex flex-col gap-1">
            {shortcuts.map((shortcut) => (
              <ShortcutItem key={shortcut.id} shortcut={shortcut} />
            ))}
          </div>
        </section>

        {/* Stat tiles (three short cards, no caption) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shadow-card">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Mentee progress */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-5">
            <h2 className="font-display font-medium text-sm">Vooruitgang medewerkers</h2>
            <ArrowLink href="/team" className="font-display font-medium text-xs">
              Alle begeleide medewerkers
            </ArrowLink>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {mentees.map((mentee) => (
              <MenteeCard key={mentee.id} mentee={mentee} />
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
          <h2 className="text-nav leading-normal text-black/60">Aankomende check-ins</h2>
          <div className="flex flex-col">
            {checkIns.map((checkIn) => (
              <CheckInItem key={checkIn.id} checkIn={checkIn} />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
