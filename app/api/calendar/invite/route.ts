import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
 * Create a meeting on the signed-in user's primary calendar and
 * send the invite to the colleague. Body:
 *
 *   {
 *     email: "joost@linc.nl",      // invitee
 *     title: "Catch-up",            // event summary
 *     description?: "…",            // optional body
 *     start: "2026-04-17T10:00:00Z",
 *     end:   "2026-04-17T10:30:00Z"
 *   }
 *
 * Requires the `calendar.events` scope. `sendUpdates=all` makes
 * Google email the invite to every attendee (including the
 * organiser's CC copy).
 */

export async function POST(request: Request) {
  let body: {
    email?: string;
    title?: string;
    description?: string;
    start?: string;
    end?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { email, title, description, start, end } = body;
  if (!email || !title || !start || !end) {
    return NextResponse.json({ error: "email, title, start and end are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const providerToken = sessionData.session?.provider_token;
  const organiserEmail = sessionData.session?.user?.email;
  if (!providerToken) {
    return NextResponse.json({ error: "missing_provider_token" }, { status: 401 });
  }

  /*
   * Include the organiser in the attendee list too so both sides
   * of the meeting show up as "going" in Google Calendar. Dedupe
   * on lowercase email to avoid sending a self-invite when the
   * colleague somehow resolves to the current user.
   */
  const attendeeEmails = new Set<string>();
  attendeeEmails.add(email.toLowerCase());
  if (organiserEmail) {
    attendeeEmails.add(organiserEmail.toLowerCase());
  }
  const attendees = [...attendeeEmails].map((e) => {
    const base: { email: string; organizer?: boolean; self?: boolean; responseStatus?: string } = { email: e };
    if (organiserEmail && e === organiserEmail.toLowerCase()) {
      base.organizer = true;
      base.self = true;
      base.responseStatus = "accepted";
    }
    return base;
  });

  try {
    const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${providerToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        summary: title,
        description,
        start: { dateTime: new Date(start).toISOString() },
        end: { dateTime: new Date(end).toISOString() },
        attendees,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn("[calendar/invite] failed:", res.status, text);
      return NextResponse.json({ error: `events_${res.status}`, detail: text }, { status: 200 });
    }

    const event = (await res.json()) as { id?: string; htmlLink?: string };
    return NextResponse.json({
      id: event.id,
      htmlLink: event.htmlLink,
    });
  } catch (err) {
    console.error("[calendar/invite] unexpected:", err);
    return NextResponse.json({ error: "exception" }, { status: 200 });
  }
}
