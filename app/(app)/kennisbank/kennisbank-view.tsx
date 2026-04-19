"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { canWriteArticles, useRole } from "@/components/layout/role-context";
import { FilterItem } from "@/components/knowledge/filter-item";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_DISCIPLINES, type KnowledgeArticle, type KnowledgeCategory, type KnowledgeDiscipline } from "@/lib/types/knowledge";

interface KennisbankViewProps {
  articles: KnowledgeArticle[];
  currentUserPhotoUrl: string;
}

/*
 * Client view for the kennisbank.
 *
 * Holds three bits of UI state:
 *   - `search`: free-text query matched against title + description
 *   - `selectedDiscipline`: optional discipline filter (click again to clear)
 *   - `selectedCategory`: optional category filter (click again to clear)
 *
 * The article list is filtered live through a `useMemo`, so typing
 * updates the grid and the count in the header without any
 * additional network calls. The sidebar counts always reflect the
 * full (unfiltered) library — clicking a filter shows how many
 * articles would surface — and the filters themselves are sorted
 * by descending count so the biggest bucket is always on top.
 */
export function KennisbankView({ articles, currentUserPhotoUrl }: KennisbankViewProps) {
  const role = useRole();
  const showWriteArticle = canWriteArticles(role);

  const [search, setSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<KnowledgeDiscipline | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return articles.filter((article) => {
      if (selectedDiscipline && article.discipline !== selectedDiscipline) return false;
      if (selectedCategory && article.category !== selectedCategory) return false;
      if (needle) {
        const haystack = `${article.title} ${article.description}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [articles, search, selectedDiscipline, selectedCategory]);

  /*
   * Counts are cross-filtered: discipline counts factor in the
   * active category + search (but not the active discipline), and
   * vice versa. This way the number always shows "how many articles
   * will I see if I click THIS filter", preventing dead-end 0-states.
   */
  const sortedDisciplines = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const counts = new Map<KnowledgeDiscipline, number>();
    for (const article of articles) {
      if (selectedCategory && article.category !== selectedCategory) continue;
      if (needle && !`${article.title} ${article.description}`.toLowerCase().includes(needle)) continue;
      counts.set(article.discipline, (counts.get(article.discipline) ?? 0) + 1);
    }
    return [...KNOWLEDGE_DISCIPLINES].map((disc) => ({ ...disc, count: counts.get(disc.id) ?? 0 })).sort((a, b) => b.count - a.count);
  }, [articles, selectedCategory, search]);

  const sortedCategories = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const counts = new Map<KnowledgeCategory, number>();
    for (const article of articles) {
      if (selectedDiscipline && article.discipline !== selectedDiscipline) continue;
      if (needle && !`${article.title} ${article.description}`.toLowerCase().includes(needle)) continue;
      counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
    }
    return [...KNOWLEDGE_CATEGORIES].map((cat) => ({ ...cat, count: counts.get(cat.id) ?? 0 })).sort((a, b) => b.count - a.count);
  }, [articles, selectedDiscipline, search]);

  const activeFilterCount = (selectedDiscipline ? 1 : 0) + (selectedCategory ? 1 : 0);

  /* Shared filter sections — rendered both in the mobile inline
     panel (toggled by the "Filteren" button) and in the desktop
     sidebar. Keeping it inline dedupes ~30 lines of JSX without
     a separate component. */
  const filterSections = (
    <>
      <section className="flex flex-col gap-3">
        <h3 className="font-display font-medium text-xs leading-normal text-black/50 px-6">Disciplines</h3>
        <div className="flex flex-col">
          {sortedDisciplines.map((disc) => (
            <FilterItem key={disc.id} label={disc.label} count={disc.count} active={selectedDiscipline === disc.id} onClick={() => setSelectedDiscipline(selectedDiscipline === disc.id ? null : disc.id)} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 pt-6 border-t border-black/15">
        <h3 className="font-display font-medium text-xs leading-normal text-black/50 px-6">Categorieën</h3>
        <div className="flex flex-col">
          {sortedCategories.map((cat) => (
            <FilterItem key={cat.id} label={cat.label} count={cat.count} active={selectedCategory === cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)} />
          ))}
        </div>
      </section>
    </>
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col gap-6 p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-3 min-w-0">
            <h1 className="font-display font-medium text-h2">Kennisbank</h1>
            <p className="text-body text-sm text-black/60">{filteredArticles.length} artikelen</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile filter toggle — hidden on desktop where the
                sidebar is always visible. */}
            <button type="button" onClick={() => setMobileFiltersOpen((o) => !o)} className="lg:hidden cursor-pointer flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors" aria-expanded={mobileFiltersOpen}>
              <span className="icon h-4">tune</span>
              Filteren
              {activeFilterCount > 0 && <span className="ml-0.5 rounded-full bg-purple text-white text-2xs leading-none px-1.5 py-0.5 font-medium">{activeFilterCount}</span>}
            </button>
            {showWriteArticle && (
              <Link href="/kennisbank/nieuw" className="shrink-0 cursor-pointer flex items-center gap-1.5 bg-black border border-black rounded-md px-3 py-1.5 hover:bg-purple hover:border-purple transition-colors">
                <span className="icon text-white">add_2</span>
                <span className="text-xs text-white">Schrijf een artikel</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search (right panel is hidden below lg) */}
        <div className="lg:hidden">
          <label className="flex gap-2 items-center bg-white border border-black/10 rounded-md px-3 py-2 transition-colors focus-within:border-purple">
            <span className="sr-only">Zoek in de kennisbank</span>
            <span aria-hidden className="icon text-black/50">
              search
            </span>
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Type om te zoeken" className="flex-1 min-w-0 font-display text-xs leading-normal text-black placeholder:text-black/50 outline-none" />
          </label>
        </div>

        {/* Mobile inline filters */}
        {mobileFiltersOpen && <div className="lg:hidden bg-white border border-black/10 rounded-lg py-6 flex flex-col gap-6">{filterSections}</div>}

        {/* Articles grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredArticles.map((article) => (
              <KnowledgeCard key={article.id} article={article} fallbackPhotoUrl={currentUserPhotoUrl} />
            ))}
          </div>
        ) : (
          <p className="text-body text-sm text-black/60">Geen artikelen gevonden voor deze combinatie van filter en zoekopdracht.</p>
        )}
      </div>

      {/* Right panel */}
      <aside className="hidden lg:flex w-71 shrink-0 bg-white border-l border-black/15 flex-col gap-6 py-6">
        <div className="px-6">
          <label className="flex gap-2 items-center bg-white border border-black/10 rounded-md px-3 py-2.5 transition-colors focus-within:border-purple">
            <span className="sr-only">Zoek in de kennisbank</span>
            <span aria-hidden className="icon text-black/50">
              search
            </span>
            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Type om te zoeken" className="flex-1 min-w-0 font-display text-xs leading-normal text-black placeholder:text-black/50 outline-none" />
          </label>
        </div>

        {filterSections}
      </aside>
    </div>
  );
}
