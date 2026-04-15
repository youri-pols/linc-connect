import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KnowledgeCard } from "@/components/knowledge/knowledge-card";
import { BadgeGrid } from "@/components/team/badge-grid";
import { StatRow } from "@/components/team/stat-row";
import { XpTierCard } from "@/components/team/xp-tier-card";
import { ArrowLink } from "@/components/ui/arrow-link";
import { getKnowledgeArticles } from "@/lib/mock-data/knowledge";
import { TEAM_DISCIPLINES } from "@/lib/mock-data/team-members";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberBySlugWithProfile } from "@/lib/team/server";

interface TeamlidPageProps {
  params: Promise<{ slug: string }>;
}

/*
 * Team member profile page. Two-pane layout:
 *
 *   ┌ Left sidebar ─ fixed ─┐ ┌ Content ── scrolls ┐
 *   │ back button            │ │ Badges grid         │
 *   │ avatar + name + role   │ │ Stats row           │
 *   │ XP / tier card         │ │ Recente artikelen   │
 *   │ expertise pills        │ │                     │
 *   │ contact                │ │                     │
 *   │ "Over mij" bio         │ │                     │
 *   └────────────────────────┘ └─────────────────────┘
 *
 * Only the right pane scrolls; the sidebar stays visible. The
 * whole page background is white (per Figma) and the container
 * stretches to fill whatever width is available, so collapsing
 * the app nav automatically gives the content more room.
 */
export default async function TeamlidPage({ params }: TeamlidPageProps) {
  const { slug } = await params;
  const member = await getTeamMemberBySlugWithProfile(slug);
  if (!member) notFound();

  const disciplineLabel = TEAM_DISCIPLINES.find((d) => d.id === member.discipline)?.label ?? member.discipline;

  // Use the signed-in user's Google photo as a fallback when the
  // profile belongs to the signed-in user but has no `photoUrl`.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isCurrentUser = user?.email?.toLowerCase() === member.email.toLowerCase();
  const fallbackPhotoUrl = isCurrentUser ? (user?.user_metadata?.avatar_url as string | undefined) : undefined;
  const photoUrl = member.photoUrl ?? fallbackPhotoUrl;

  // Default the Chat handle to @<local-part-of-email> so every
  // member has something to show until we store a real handle.
  const chatHandle = member.chatHandle ?? `@${member.email.split("@")[0]}`;

  // "Recent articles" are whatever KB entries share the member's
  // name as author. Falls back to the 6 most recent so the
  // section is never empty.
  const allArticles = await getKnowledgeArticles();
  const authored = allArticles.filter((a) => a.authorName === member.name);
  const recentArticles = (authored.length > 0 ? authored : allArticles).slice(0, 6);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
      {/* Sidebar — fixed column on lg+ with its own scroll, stacks
          on top of the content on narrower screens and flows with
          the outer scroll. White background; right pane keeps
          the app's default lavender tint. */}
      <aside className="w-full lg:w-80 shrink-0 lg:h-full lg:overflow-y-auto bg-white border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col gap-8 p-6">
        <Link href="/team" className="w-fit flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
          <span className="icon h-4">arrow_back</span>
          Terug naar Team
        </Link>

        <div className="flex flex-col gap-4 items-start">
          {photoUrl ? (
            <Image src={photoUrl} alt={member.name} width={72} height={72} className="size-18 rounded-full object-cover" />
          ) : (
            <div className="size-18 rounded-full bg-purple flex items-center justify-center">
              <span className="font-display font-medium text-xl leading-none text-white">
                {member.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <h1 className="font-display font-medium text-h2-s leading-none">{member.name}</h1>
            <p className="text-body text-13 text-black/60 leading-normal">
              {member.jobTitle} · {disciplineLabel}
            </p>
          </div>
        </div>

        {typeof member.xp === "number" && member.xpTier && typeof member.xpTarget === "number" && <XpTierCard xp={member.xp} tier={member.xpTier} target={member.xpTarget} />}

        {member.expertises.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-medium text-xs text-black/50 leading-none">Expertise</h2>
            <div className="flex flex-wrap gap-1.5">
              {member.expertises.map((tag) => (
                <span key={tag} className="bg-purple/10 text-purple text-body text-11 leading-none rounded-sm px-2 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 className="font-display font-medium text-xs text-black/50 leading-none">Contactgegevens</h2>
          <div className="flex flex-col gap-1.5 text-body text-sm text-black">
            <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-purple transition-colors">
              <span className="icon text-black">forward_to_inbox</span>
              {member.email}
            </a>
            {member.phone && (
              <a href={`tel:${member.phone}`} className="flex items-center gap-2 hover:text-purple transition-colors">
                <span className="icon text-black">call</span>
                {member.phone}
              </a>
            )}
            <a href="https://mail.google.com/chat/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-purple transition-colors">
              <span className="icon text-black">add_comment</span>
              {chatHandle}
            </a>
          </div>
        </section>

        {member.bio && (
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-medium text-xs text-black/50 leading-none">Over {member.name.split(" ")[0]}</h2>
            <p className="text-body text-sm text-black leading-relaxed">{member.bio}</p>
          </section>
        )}
      </aside>

      {/* Right content pane — independent scroll. */}
      <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto p-6 lg:p-8 flex flex-col gap-8">
        {member.earnedBadges && member.earnedBadges.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-medium text-sm text-black leading-none px-5">Badges</h2>
            <BadgeGrid badges={member.earnedBadges} />
          </section>
        )}

        <section className="flex flex-col gap-3">
          <StatRow
            stats={[
              {
                value: member.publishedArticlesCount ?? 0,
                label: "Gepubliceerde artikelen",
              },
              {
                value: member.answeredQuestionsCount ?? 0,
                label: "Beantwoorde vragen",
              },
              {
                value: `${member.yearsAtLinc ?? 0}+`,
                label: "Jaar bij LiNC",
              },
            ]}
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 px-5">
            <h2 className="font-display font-medium text-sm text-black leading-none">Recente artikelen</h2>
            <ArrowLink
              href="/kennisbank"
              className="font-display font-medium text-xs"
            >
              Alles bekijken
            </ArrowLink>
          </div>
          {recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recentArticles.map((article) => (
                <KnowledgeCard key={article.id} article={article} fallbackPhotoUrl={photoUrl} />
              ))}
            </div>
          ) : (
            <p className="text-body text-sm text-black/60">Nog geen artikelen gepubliceerd.</p>
          )}
        </section>
      </main>
    </div>
  );
}
