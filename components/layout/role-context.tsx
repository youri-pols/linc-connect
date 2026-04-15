"use client";

import { createContext, useContext } from "react";

/*
 * Fase 1 placeholder role, derived in AppShell from the last
 * visited /home/[variant] URL and persisted in localStorage. The
 * context exposes it so any client component (kennisbank page,
 * future editors, ...) can render role-conditional affordances
 * without re-implementing the sync.
 */
export type Role = "nieuw" | "ervaren" | "begeleider";

const RoleContext = createContext<Role>("nieuw");

export function RoleProvider({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

export function useRole(): Role {
  return useContext(RoleContext);
}

export function canWriteArticles(role: Role): boolean {
  return role === "ervaren" || role === "begeleider";
}
