"use client";

import { useEffect, useMemo, useState } from "react";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  /** Full name of the colleague whose calendar we're querying. */
  memberName: string;
  /** Email used to look up busy times + add them as the invitee. */
  memberEmail: string;
}

interface Slot {
  start: string;
  end: string;
}

interface DaySlots {
  date: string;
  slots: Slot[];
}

const DURATION_OPTIONS = [15, 30, 60] as const;
type Duration = (typeof DURATION_OPTIONS)[number];

const WEEKDAY_SHORT = ["zo", "ma", "di", "wo", "do", "vr", "za"];

type Step = { kind: "select" } | { kind: "compose"; slot: Slot } | { kind: "sent"; slot: Slot; htmlLink?: string };

/*
 * Cal.com-style scheduling modal with three sequential steps:
 *
 *   1. `select`  — date picker + time grid; pick a slot.
 *   2. `compose` — name the meeting + optional description,
 *                  then send the invite via our
 *                  `POST /api/calendar/invite` endpoint.
 *   3. `sent`    — success confirmation with a link to the new
 *                  Google Calendar event.
 *
 * Day list is pre-grouped by the server so the UI can mark
 * "Volgeboekt" / "Weekend" days without a second round-trip.
 */
export function ScheduleModal({ open, onClose, memberName, memberEmail }: ScheduleModalProps) {
  const [duration, setDuration] = useState<Duration>(30);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>({ kind: "select" });

  // Fetch day-grouped slots whenever the modal opens or the
  // duration changes.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/calendar/slots?email=${encodeURIComponent(memberEmail)}&duration=${duration}`, { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((data: { days?: DaySlots[]; error?: string }) => {
        if (data.error) {
          setError(data.error);
          setDays([]);
          setSelectedDate(null);
        } else {
          const nextDays = data.days ?? [];
          setDays(nextDays);
          const firstAvailable = nextDays.find((d) => d.slots.length > 0);
          setSelectedDate(firstAvailable?.date ?? nextDays[0]?.date ?? null);
        }
      })
      .catch(() => {
        /* aborted or offline — swallow */
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [open, memberEmail, duration]);

  // Reset wizard state whenever the modal closes so re-opening is
  // always on the select step.
  useEffect(() => {
    if (!open) setStep({ kind: "select" });
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const selectedDay = useMemo(() => days.find((d) => d.date === selectedDate), [days, selectedDate]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title" className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <button type="button" aria-label="Sluiten" onClick={onClose} className="absolute inset-0 bg-black/50" />

      <div className="relative bg-white rounded-2xl shadow-modal-lift w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-black/10">
          <div className="flex flex-col gap-1 min-w-0">
            <h2 id="schedule-modal-title" className="font-display font-medium text-lg text-black leading-none">
              {step.kind === "sent" ? "Uitnodiging verstuurd" : `Plan afspraak met ${memberName}`}
            </h2>
            <p className="text-body text-xs text-black/60 leading-relaxed">{step.kind === "compose" ? "Geef de afspraak een naam en stuur de uitnodiging." : step.kind === "sent" ? `${memberName} heeft je uitnodiging per e-mail ontvangen.` : "Eerstvolgende vrije momenten tussen 08:30 en 17:00."}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Sluiten" className="shrink-0 flex items-center justify-center size-8 rounded-md border border-black/10 text-black/60 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer">
            <span className="icon">close</span>
          </button>
        </div>

        {step.kind === "select" && (
          <>
            {/* Duration picker */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-black/10">
              <span className="text-body text-xs text-black/60">Duur:</span>
              <div className="flex items-center gap-1.5">
                {DURATION_OPTIONS.map((opt) => (
                  <button key={opt} type="button" onClick={() => setDuration(opt)} className={`cursor-pointer text-body text-xs rounded-md px-3 py-1.5 border transition-colors ${opt === duration ? "bg-black border-black text-white" : "bg-white border-black/10 text-black hover:bg-black hover:text-white hover:border-black"}`}>
                    {opt} min
                  </button>
                ))}
              </div>
            </div>

            {/* Date picker + slot grid */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <div className="w-40 sm:w-56 shrink-0 border-r border-black/10 overflow-y-auto py-2">{loading && days.length === 0 ? <p className="px-5 py-3 text-body text-xs text-black/60">Even kijken…</p> : error ? <p className="px-5 py-3 text-body text-xs text-black/60">Kon de agenda niet ophalen.</p> : days.map((day) => <DateTile key={day.date} day={day} active={day.date === selectedDate} onSelect={() => setSelectedDate(day.date)} />)}</div>

              <div className="flex-1 min-w-0 overflow-y-auto p-5">
                {selectedDay && selectedDay.slots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedDay.slots.map((slot) => (
                      <button key={slot.start} type="button" onClick={() => setStep({ kind: "compose", slot })} className="flex items-center justify-center border border-black/15 rounded-md px-3 py-2.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer">
                        {formatTime(slot.start)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <EmptyState memberName={memberName} />
                )}
              </div>
            </div>
          </>
        )}

        {step.kind === "compose" && <ComposeForm memberName={memberName} memberEmail={memberEmail} slot={step.slot} onBack={() => setStep({ kind: "select" })} onSent={(htmlLink) => setStep({ kind: "sent", slot: step.slot, htmlLink })} />}

        {step.kind === "sent" && <SentView slot={step.slot} htmlLink={step.htmlLink} onPlanAnother={() => setStep({ kind: "select" })} onClose={onClose} />}
      </div>
    </div>
  );
}

interface ComposeFormProps {
  memberName: string;
  memberEmail: string;
  slot: Slot;
  onBack: () => void;
  onSent: (htmlLink?: string) => void;
}

/*
 * Step 2 — name the meeting + send. We pre-fill the title with
 * "Meeting met <name>" so the user can just hit send, but they
 * can override it (and add a description) before committing.
 */
function ComposeForm({ memberName, memberEmail, slot, onBack, onSent }: ComposeFormProps) {
  const [title, setTitle] = useState(`Meeting met ${memberName}`);
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim() || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/calendar/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: memberEmail,
          title: title.trim(),
          description: description.trim() || undefined,
          start: slot.start,
          end: slot.end,
        }),
      });
      const data = (await res.json()) as {
        htmlLink?: string;
        error?: string;
      };
      if (!res.ok || data.error) {
        setSendError(data.error ?? `Er ging iets mis (${res.status}).`);
      } else {
        onSent(data.htmlLink);
      }
    } catch {
      setSendError("Kon de uitnodiging niet versturen. Probeer opnieuw.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-5">
      {/* Slot summary */}
      <div className="flex items-center gap-3 p-3 bg-purple/5 border border-purple/20 rounded-md">
        <span className="icon text-purple">event</span>
        <div className="flex flex-col min-w-0">
          <p className="text-body text-13 font-medium text-black leading-none">{formatFullDate(slot.start)}</p>
          <p className="text-body text-xs text-black/60 leading-none mt-1">
            {formatTimeRange(slot.start, slot.end)} · {memberEmail}
          </p>
        </div>
      </div>

      {/* Title */}
      <label className="flex flex-col gap-1.5">
        <span className="text-body text-xs text-black/60">Titel</span>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Geef de afspraak een naam" className="text-body text-sm text-black bg-white border border-black/10 rounded-md px-3 py-2 outline-none focus:border-purple transition-colors" />
      </label>

      {/* Description */}
      <label className="flex flex-col gap-1.5">
        <span className="text-body text-xs text-black/60">Toelichting (optioneel)</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Waar gaat de afspraak over?" rows={3} className="text-body text-sm text-black bg-white border border-black/10 rounded-md px-3 py-2 outline-none focus:border-purple transition-colors resize-none" />
      </label>

      {sendError && <p className="text-body text-xs text-red leading-normal">{sendError}</p>}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-2">
        <button type="button" onClick={onBack} className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer">
          <span className="icon h-4">arrow_back</span>
          Ander moment
        </button>
        <button type="button" onClick={handleSend} disabled={!title.trim() || sending} className={`flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 transition-colors ${!title.trim() || sending ? "opacity-60 cursor-not-allowed" : "hover:bg-purple cursor-pointer"}`}>
          <span className="icon">send</span>
          {sending ? "Versturen…" : "Stuur uitnodiging"}
        </button>
      </div>
    </div>
  );
}

interface SentViewProps {
  slot: Slot;
  htmlLink?: string;
  onPlanAnother: () => void;
  onClose: () => void;
}

/*
 * Step 3 — success confirmation. Shows the slot that was booked,
 * a link to the freshly-created Google Calendar event, and a
 * shortcut back to the select step for a "plan another" flow.
 */
function SentView({ slot, htmlLink, onPlanAnother, onClose }: SentViewProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-8 flex flex-col items-center text-center gap-5">
      <div className="size-14 rounded-full bg-green/10 flex items-center justify-center">
        <span className="icon text-green" style={{ fontSize: "1.75rem" }}>
          check
        </span>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-display font-medium text-base text-black leading-none">Uitnodiging verstuurd</p>
        <p className="text-body text-xs text-black/60 leading-relaxed">
          {formatFullDate(slot.start)} · {formatTimeRange(slot.start, slot.end)}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {htmlLink && (
          <a href={htmlLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer">
            <span className="icon h-4">open_in_new</span>
            Open in Agenda
          </a>
        )}
        <button type="button" onClick={onPlanAnother} className="flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer">
          Plan nog een moment
        </button>
        <button type="button" onClick={onClose} className="flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors cursor-pointer">
          Sluiten
        </button>
      </div>
    </div>
  );
}

interface DateTileProps {
  day: DaySlots;
  active: boolean;
  onSelect: () => void;
}

/*
 * One row in the date picker. Renders weekday + day number + the
 * available-slot count. Days with 0 slots are dimmed and not
 * clickable; the active day gets a subtle purple tint + 3px left
 * accent (matching our FilterItem pattern).
 */
function DateTile({ day, active, onSelect }: DateTileProps) {
  const date = new Date(`${day.date}T12:00:00`);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const dayName = WEEKDAY_SHORT[date.getDay()];
  const dayNum = date.getDate();
  const monthName = date.toLocaleDateString("nl-NL", { month: "short" });
  const count = day.slots.length;
  const disabled = count === 0;

  const container = active ? "bg-purple/10 border-purple" : disabled ? "border-transparent" : "border-transparent hover:bg-purple/10";

  return (
    <button type="button" onClick={disabled ? undefined : onSelect} aria-disabled={disabled || undefined} disabled={disabled} className={`w-full flex items-center justify-between px-5 py-2.5 border-l-3 transition-colors text-left ${container} ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={`text-body text-13 leading-none ${active ? "font-bold text-black" : "text-black"}`}>
          {dayName} {dayNum} {monthName}
        </span>
        <span className="text-body text-xs text-black/50 leading-none">{disabled ? (isWeekend ? "Weekend" : "Volgeboekt") : `${count} ${count === 1 ? "slot" : "slots"}`}</span>
      </div>
    </button>
  );
}

function EmptyState({ memberName }: { memberName: string }) {
  return (
    <div className="h-full flex flex-col gap-3 items-center justify-center text-center">
      <p className="text-body text-sm text-black leading-snug">Geen ruimte op deze dag.</p>
      <p className="text-body text-xs text-black/60 leading-relaxed max-w-xs">Wil je buiten werktijd of eerder afspreken? Stuur {memberName} een bericht om iets te regelen.</p>
      <a href="https://mail.google.com/chat/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-black text-white text-xs rounded-md px-3 py-1.5 hover:bg-purple transition-colors cursor-pointer">
        <span className="icon h-4">add_comment</span>
        Open chat
      </a>
    </div>
  );
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`;
}

function formatFullDate(iso: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}
