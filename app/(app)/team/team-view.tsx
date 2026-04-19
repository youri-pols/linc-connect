"use client";

import { useMemo, useState } from "react";
import { FilterItem } from "@/components/knowledge/filter-item";
import { TeamCard } from "@/components/team/team-card";
import { TEAM_DISCIPLINES, type TeamDiscipline, type TeamMember } from "@/lib/mock-data/team-members";

interface TeamViewProps {
  members: TeamMember[];
  /** Email of the signed-in user — used to flag "JU" on their card. */
  currentUserEmail?: string;
  /** Google photo URL of the signed-in user. */
  currentUserPhotoUrl?: string;
}

/*
 * Client view for Team & Expertise. Two single-select filters —
 * discipline and expertise — each of which toggles off by clicking
 * the active option again. The filters are cross-counted so the
 * sidebar always shows "how many cards would surface if I clicked
 * THIS filter". No free-text search on this page.
 *
 * On desktop (≥ lg) the filter sidebar sits on the right. On
 * mobile we hide the sidebar and surface a "Filteren" button that
 * expands the filters inline when tapped.
 */
export function TeamView({ members, currentUserEmail, currentUserPhotoUrl }: TeamViewProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<TeamDiscipline | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (selectedDiscipline && m.discipline !== selectedDiscipline) return false;
      if (selectedExpertise && !m.expertises.includes(selectedExpertise)) return false;
      return true;
    });
  }, [members, selectedDiscipline, selectedExpertise]);

  const sortedDisciplines = useMemo(() => {
    const counts = new Map<TeamDiscipline, number>();
    for (const m of members) {
      if (selectedExpertise && !m.expertises.includes(selectedExpertise)) continue;
      counts.set(m.discipline, (counts.get(m.discipline) ?? 0) + 1);
    }
    return [...TEAM_DISCIPLINES].map((d) => ({ ...d, count: counts.get(d.id) ?? 0 })).sort((a, b) => b.count - a.count);
  }, [members, selectedExpertise]);

  const sortedExpertises = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of members) {
      if (selectedDiscipline && m.discipline !== selectedDiscipline) continue;
      for (const tag of m.expertises) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [members, selectedDiscipline]);

  const disciplineLabels = useMemo(() => {
    const map = new Map<TeamDiscipline, string>();
    for (const d of TEAM_DISCIPLINES) map.set(d.id, d.label);
    return map;
  }, []);

  const activeFilterCount = (selectedDiscipline ? 1 : 0) + (selectedExpertise ? 1 : 0);

  /* Shared filter sections — rendered in both the desktop sidebar
     and the mobile inline panel. Keeping it inline avoids a
     separate component just to dedupe ~30 lines of JSX. */
  const filterSections = (
    <>
      <section className="flex flex-col gap-3">
        <h3 className="font-display font-medium text-xs leading-normal text-black/50 px-6">Disciplines</h3>
        <div className="flex flex-col">
          {sortedDisciplines.map((d) => (
            <FilterItem key={d.id} label={d.label} count={d.count} active={selectedDiscipline === d.id} onClick={() => setSelectedDiscipline(selectedDiscipline === d.id ? null : d.id)} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 pt-6 border-t border-black/15">
        <h3 className="font-display font-medium text-xs leading-normal text-black/50 px-6">Expertises</h3>
        <div className="flex flex-col">
          {sortedExpertises.map((e) => (
            <FilterItem key={e.label} label={e.label} count={e.count} active={selectedExpertise === e.label} onClick={() => setSelectedExpertise(selectedExpertise === e.label ? null : e.label)} />
          ))}
        </div>
      </section>
    </>
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col gap-6 p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display font-medium text-h2">Team & Expertise</h1>
            <p className="text-body text-sm text-black/60">{filteredMembers.length} medewerkers</p>
          </div>

          {/* Mobile filter toggle — hidden on desktop where the
              sidebar is always visible. */}
          <button type="button" onClick={() => setMobileFiltersOpen((o) => !o)} className="lg:hidden cursor-pointer flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors" aria-expanded={mobileFiltersOpen}>
            <span className="icon h-4">tune</span>
            Filteren
            {activeFilterCount > 0 && <span className="ml-0.5 rounded-full bg-purple text-white text-2xs leading-none px-1.5 py-0.5 font-medium">{activeFilterCount}</span>}
          </button>
        </div>

        {/* Mobile inline filters */}
        {mobileFiltersOpen && <div className="lg:hidden bg-white border border-black/10 rounded-lg py-6 flex flex-col gap-6">{filterSections}</div>}

        {/* Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
            {filteredMembers.map((member) => (
              <TeamCard key={member.slug} member={member} isCurrentUser={member.email === currentUserEmail} fallbackPhotoUrl={currentUserPhotoUrl} disciplineLabel={disciplineLabels.get(member.discipline) ?? member.discipline} />
            ))}
          </div>
        ) : (
          <p className="text-body text-sm text-black/60">Geen medewerkers gevonden voor deze combinatie van filters.</p>
        )}
      </div>

      {/* Desktop right panel */}
      <aside className="hidden lg:flex w-71 shrink-0 bg-white border-l border-black/15 flex-col gap-6 py-6">{filterSections}</aside>
    </div>
  );
}
