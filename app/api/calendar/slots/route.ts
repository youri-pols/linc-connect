import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
 * Find open slots in a colleague's calendar for the next ~14
 * working days, grouped by day so the UI can show a Cal.com-like
 * date picker with "this day is fully booked" states.
 *
 *   GET /api/calendar/slots?email=joost@linc.nl&duration=30
 *
 * Response:
 *   {
 *     days: [
 *       { date: "2026-04-15", slots: [{ start, end }, ...] },
 *       ...
 *     ]
 *   }
 *
 * Days that fall within the horizon but are fully booked /
 * weekend / in the past are still included with an empty
 * `slots` array so the date picker can render them as disabled
 * without a second round-trip.
 *
 * Uses Google Calendar's freeBusy endpoint with the signed-in
 * user's OAuth token — we never see the events themselves, only
 * the busy time ranges. Slots are clipped to 08:30–17:00 local
 * time and cursor buffers 5 minutes past `now` so we never
 * suggest a slot that's about to start.
 */

const WORK_START_HOUR = 8;
const WORK_START_MINUTE = 30;
const WORK_END_HOUR = 17;
const WORK_END_MINUTE = 0;
const HORIZON_DAYS = 14;

interface FreeBusyResponse {
  calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
}

function toLocalWindow(day: Date, hour: number, minute: number) {
  const d = new Date(day);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function toDateKey(d: Date) {
  // YYYY-MM-DD in local time.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const duration = Number.parseInt(searchParams.get("duration") ?? "30", 10);

  if (!email || !duration || Number.isNaN(duration)) {
    return NextResponse.json({ error: "email and duration are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const providerToken = sessionData.session?.provider_token;
  if (!providerToken) {
    return NextResponse.json({ error: "missing_provider_token" }, { status: 401 });
  }

  const now = new Date();
  const horizon = new Date(now);
  horizon.setDate(horizon.getDate() + HORIZON_DAYS);

  let busy: { start: Date; end: Date }[] = [];
  try {
    const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${providerToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        timeMin: now.toISOString(),
        timeMax: horizon.toISOString(),
        items: [{ id: email }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.warn("[calendar/slots] freeBusy failed:", res.status, body);
      return NextResponse.json({ error: `freebusy_${res.status}`, days: [] }, { status: 200 });
    }

    const data = (await res.json()) as FreeBusyResponse;
    const raw = data.calendars?.[email]?.busy ?? [];
    busy = raw.map((b) => ({ start: new Date(b.start), end: new Date(b.end) })).sort((a, b) => a.start.getTime() - b.start.getTime());
  } catch (err) {
    console.error("[calendar/slots] unexpected:", err);
    return NextResponse.json({ error: "exception", days: [] }, { status: 200 });
  }

  const durationMs = duration * 60_000;
  const days: { date: string; slots: { start: string; end: string }[] }[] = [];

  for (let day = new Date(now); day <= horizon; day.setDate(day.getDate() + 1)) {
    const dateKey = toDateKey(day);
    const dow = day.getDay();
    const slots: { start: string; end: string }[] = [];

    // Weekends stay in the response (for the picker) but with an
    // empty slot list so the UI marks them as unavailable.
    if (dow === 0 || dow === 6) {
      days.push({ date: dateKey, slots });
      continue;
    }

    const workStart = toLocalWindow(day, WORK_START_HOUR, WORK_START_MINUTE);
    const workEnd = toLocalWindow(day, WORK_END_HOUR, WORK_END_MINUTE);
    let cursor = new Date(Math.max(workStart.getTime(), now.getTime() + 5 * 60_000));

    const todaysBusy = busy.filter((b) => b.end > workStart && b.start < workEnd);

    for (const b of todaysBusy) {
      while (cursor.getTime() + durationMs <= b.start.getTime()) {
        const slotEnd = new Date(cursor.getTime() + durationMs);
        slots.push({
          start: cursor.toISOString(),
          end: slotEnd.toISOString(),
        });
        cursor = slotEnd;
      }
      if (cursor < b.end) cursor = new Date(b.end);
    }

    while (cursor.getTime() + durationMs <= workEnd.getTime()) {
      const slotEnd = new Date(cursor.getTime() + durationMs);
      slots.push({ start: cursor.toISOString(), end: slotEnd.toISOString() });
      cursor = slotEnd;
    }

    days.push({ date: dateKey, slots });
  }

  return NextResponse.json({ days });
}
