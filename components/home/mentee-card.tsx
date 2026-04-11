import Image from "next/image";
import type { AvatarColor, Mentee, StatAccent } from "@/lib/types/home";

interface MenteeCardProps {
  mentee: Mentee;
}

/*
 * Row in the mentor "Vooruitgang medewerkers" grid. Renders an
 * avatar (photo or colored initials) with the mentee's name and
 * role, a progress block (value + stretched bar) on the left and a
 * status block on the right. The status block shows an optional
 * warning (e.g. "Geen activiteit in 4 dagen") above the task count.
 *
 * The card is purely informational in fase 1 — no link or hover
 * state. Fase 2 (Supabase) will wire it to an actual mentee detail
 * page.
 */
const avatarColorClass: Record<AvatarColor, string> = {
  orange: "bg-orange",
  purple: "bg-purple",
  green: "bg-green",
  red: "bg-red",
};

const accentClass: Record<StatAccent, string> = {
  green: "text-green",
  orange: "text-orange",
  purple: "text-purple",
};

const progressFillClass: Record<StatAccent, string> = {
  green: "bg-green",
  orange: "bg-orange",
  purple: "bg-purple",
};

export function MenteeCard({ mentee }: MenteeCardProps) {
  const {
    name,
    roleLabel,
    photoUrl,
    initials,
    avatarColor,
    progress,
    progressAccent,
    taskStatus,
    warning,
  } = mentee;

  return (
    <div className="flex flex-col gap-3 bg-white border border-black/10 rounded-lg shadow-card px-6 py-5">
      {/* Header: avatar + name + role */}
      <div className="flex items-center gap-2 min-w-0">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={48}
            height={48}
            className="size-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className={`shrink-0 size-12 rounded-full flex items-center justify-center ${avatarColorClass[avatarColor]}`}
          >
            <span className="font-display font-medium text-sm leading-none text-white">
              {initials}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-body text-sm font-bold leading-none truncate">{name}</p>
          <p className="text-body text-xs text-black/60 leading-card">{roleLabel}</p>
        </div>
      </div>

      {/*
       * Footer: progress (stretches to fill the card) + status
       * (intrinsic width on the right). Fixed 44px gap regardless
       * of viewport width.
       */}
      <div className="flex items-end justify-between gap-11">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="font-display font-medium text-xl leading-normal">{progress}%</p>
          <div className="h-1 w-full rounded-full bg-black/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${progressFillClass[progressAccent]}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 items-end text-right shrink-0">
          {warning && (
            <div className={`flex items-center gap-1 ${accentClass[warning.accent]}`}>
              <span className="icon">{warning.icon}</span>
              <p className="text-body text-xs font-semibold">{warning.text}</p>
            </div>
          )}
          <p className="text-body text-xs text-black/60">{taskStatus}</p>
        </div>
      </div>
    </div>
  );
}
