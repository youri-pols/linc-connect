import type { StatAccent, UpcomingCheckIn } from "@/lib/types/home";

interface CheckInItemProps {
  checkIn: UpcomingCheckIn;
}

/*
 * Row inside the mentor right-panel "Aankomende check-ins" list.
 * Structure mirrors KnowledgeItem (small uppercase accent label,
 * bold title, meta below) but surfaces a meeting instead of an
 * article. Non-interactive in fase 1 — planning and opening a
 * check-in live in the Google Calendar integration (fase 3).
 */
const whenClass: Record<StatAccent, string> = {
  green: "text-green",
  orange: "text-orange",
  purple: "text-purple",
};

export function CheckInItem({ checkIn }: CheckInItemProps) {
  const { when, whenAccent, title, subtitle } = checkIn;

  return (
    <div className="flex flex-col gap-3 border-b border-black/15 py-3">
      <div className="flex flex-col gap-0.5">
        <p className={`text-body text-2xs font-bold uppercase ${whenClass[whenAccent]}`}>
          {when}
        </p>
        <p className="text-body text-sm font-semibold">{title}</p>
      </div>
      <p className="text-body text-xs text-black/60">{subtitle}</p>
    </div>
  );
}
