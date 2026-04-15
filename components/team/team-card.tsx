"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import type { TeamMember } from "@/lib/mock-data/team-members";
import { ScheduleModal } from "./schedule-modal";

interface TeamCardProps {
  member: TeamMember;
  isCurrentUser: boolean;
  /** Fallback photo when the member has no `photoUrl` of their own. */
  fallbackPhotoUrl?: string;
  /** Discipline label for the "role · discipline" line. */
  disciplineLabel: string;
}

/*
 * Single card in the Team & Expertise grid. Layout:
 *
 *   avatar + name + (optional "JIJ" badge)    discipline label
 *   expertise tag pills (purple/10 bg)
 *   ─────
 *   chat/call/calendar icon buttons          primary CTA
 *
 * The card for the signed-in user surfaces a "Bewerk profiel"
 * button instead of the default "Profiel" link, and the three
 * icon actions are dimmed + non-interactive (you can't chat /
 * call / schedule yourself). Clicking the calendar icon on any
 * other card opens the `ScheduleModal` which queries Google
 * Calendar for the colleague's next free slots.
 */
export function TeamCard({ member, isCurrentUser, fallbackPhotoUrl, disciplineLabel }: TeamCardProps) {
  const photoUrl = member.photoUrl ?? (isCurrentUser ? fallbackPhotoUrl : undefined);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 h-full bg-white border border-black/10 rounded-lg shadow-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {photoUrl ? (
              <Image src={photoUrl} alt={member.name} width={40} height={40} className="size-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="size-10 rounded-full bg-purple shrink-0 flex items-center justify-center">
                <span className="font-display font-medium text-xs leading-none text-white">
                  {member.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="font-display font-medium text-sm text-black leading-none truncate">{member.name}</p>
                {isCurrentUser && (
                  <span className="shrink-0 bg-black rounded-sm px-1.5 py-0.75">
                    <span className="block text-white text-body text-2xs leading-2.75 font-medium">JIJ</span>
                  </span>
                )}
              </div>
              <p className="text-body text-xs text-black/60 leading-snug truncate">
                {member.jobTitle} · {disciplineLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Expertise tags */}
        {member.expertises.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {member.expertises.map((tag) => (
              <span key={tag} className="bg-purple/10 text-purple text-body text-11 leading-none rounded-sm px-2 py-1.5">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer row: icon buttons + primary CTA. `mt-auto` pins
            it to the card's bottom so cards stay aligned in the
            grid even when one has more expertise tags. */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-6 border-t border-black/10">
          <div className="flex items-center gap-1.5">
            <IconButton href="https://mail.google.com/chat/" external icon="add_comment" label={`Chat met ${member.name}`} disabled={isCurrentUser} />
            <IconButton href={member.phone ? `tel:${member.phone}` : undefined} icon="call" label={`Bel ${member.name}`} disabled={isCurrentUser} />
            <IconButton onClick={() => setScheduleOpen(true)} icon="calendar_add_on" label={`Plan afspraak met ${member.name}`} disabled={isCurrentUser} />
          </div>

          <Link href={`/team/${member.slug}`} className="group flex items-center gap-1.5 bg-black text-white text-xs leading-normal rounded-md px-3 py-1.5 hover:bg-purple transition-colors">
            <span>{isCurrentUser ? "Bewerk profiel" : "Profiel"}</span>
            <AnimatedArrow size="xs" className="text-white" />
          </Link>
        </div>
      </div>

      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} memberName={member.name} memberEmail={member.email} />
    </>
  );
}

interface IconButtonProps {
  href?: string;
  external?: boolean;
  onClick?: () => void;
  icon: string;
  label: string;
  /**
   * Dimmed + non-interactive. Used on the current user's own
   * card — you can't chat/call/schedule yourself.
   */
  disabled?: boolean;
}

function IconButton({ href, external, onClick, icon, label, disabled }: IconButtonProps) {
  const base = "flex items-center justify-center size-8 rounded-md border border-black/10 text-black transition-colors";
  const interactive = "hover:bg-black hover:text-white hover:border-black cursor-pointer";
  const dimmed = "opacity-30 pointer-events-none";
  const className = `${base} ${disabled ? dimmed : interactive}`;

  // Button variant — used for `onClick` handlers and the disabled
  // state. When `disabled` we keep the button element so keyboard
  // focus skipping works, regardless of the href.
  if (disabled || !href) {
    return (
      <button type="button" onClick={disabled ? undefined : onClick} aria-label={label} aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : undefined} className={className}>
        <span className="icon">{icon}</span>
      </button>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={className}>
        <span className="icon">{icon}</span>
      </a>
    );
  }

  return (
    <a href={href} aria-label={label} className={className}>
      <span className="icon">{icon}</span>
    </a>
  );
}
