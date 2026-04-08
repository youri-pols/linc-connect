import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Fase 1: geen authenticatie, alles doorlaten
  // Fase 2: hier komt Supabase session refresh + redirect naar /login
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
