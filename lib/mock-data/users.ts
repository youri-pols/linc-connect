import { User, Role } from "@/lib/types";

export const roles: Role[] = [
  { id: "role-1", name: "medewerker", description: "Standaard medewerker" },
  { id: "role-2", name: "content_eigenaar", description: "Kan artikelen aanmaken en beheren" },
  { id: "role-3", name: "begeleider", description: "Kan voortgang van medewerkers inzien" },
  { id: "role-4", name: "administrator", description: "Volledige toegang tot platform" },
];

export const users: User[] = [
  {
    id: "user-1",
    google_id: "g-001",
    name: "Sophie de Vries",
    email: "sophie@linc.nl",
    photo_url: "",
    role_id: "role-1",
    created_at: "2026-03-15T09:00:00Z",
    last_login: "2026-04-07T08:30:00Z",
  },
  {
    id: "user-2",
    google_id: "g-002",
    name: "Thomas Bakker",
    email: "thomas@linc.nl",
    photo_url: "",
    role_id: "role-1",
    created_at: "2024-06-01T09:00:00Z",
    last_login: "2026-04-07T10:00:00Z",
  },
  {
    id: "user-3",
    google_id: "g-003",
    name: "Joost Bakkers",
    email: "joost@linc.nl",
    photo_url: "",
    role_id: "role-3",
    created_at: "2023-01-10T09:00:00Z",
    last_login: "2026-04-07T09:15:00Z",
  },
  {
    id: "user-4",
    google_id: "g-004",
    name: "Lisa Jansen",
    email: "lisa@linc.nl",
    photo_url: "",
    role_id: "role-2",
    created_at: "2024-02-01T09:00:00Z",
    last_login: "2026-04-06T14:00:00Z",
  },
  {
    id: "user-5",
    google_id: "g-005",
    name: "Daan Willems",
    email: "daan@linc.nl",
    photo_url: "",
    role_id: "role-1",
    created_at: "2025-11-01T09:00:00Z",
    last_login: "2026-04-07T11:00:00Z",
  },
  {
    id: "user-6",
    google_id: "g-006",
    name: "Emma van Dijk",
    email: "emma@linc.nl",
    photo_url: "",
    role_id: "role-1",
    created_at: "2026-02-01T09:00:00Z",
    last_login: "2026-04-07T08:45:00Z",
  },
  {
    id: "user-7",
    google_id: "g-007",
    name: "Roy van Kasteren",
    email: "roy@linc.nl",
    photo_url: "",
    role_id: "role-2",
    created_at: "2023-06-15T09:00:00Z",
    last_login: "2026-04-07T09:30:00Z",
  },
  {
    id: "user-8",
    google_id: "g-008",
    name: "Nina Peters",
    email: "nina@linc.nl",
    photo_url: "",
    role_id: "role-1",
    created_at: "2025-08-01T09:00:00Z",
    last_login: "2026-04-05T16:00:00Z",
  },
];

// Helpers
export const currentNewUser = users[0]; // Sophie - nieuwe medewerker
export const currentExperiencedUser = users[1]; // Thomas - ervaren medewerker
export const currentMentor = users[2]; // Joost - begeleider

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUsersByRole(roleId: string): User[] {
  return users.filter((u) => u.role_id === roleId);
}
