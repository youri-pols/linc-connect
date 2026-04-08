import { Expertise, UserExpertise } from "@/lib/types";
import { users } from "./users";

export const expertises: Expertise[] = [
  { id: "exp-1", name: "React", discipline: "development" },
  { id: "exp-2", name: "TypeScript", discipline: "development" },
  { id: "exp-3", name: "Next.js", discipline: "development" },
  { id: "exp-4", name: "Node.js", discipline: "development" },
  { id: "exp-5", name: "Figma", discipline: "design" },
  { id: "exp-6", name: "UI Design", discipline: "design" },
  { id: "exp-7", name: "UX Research", discipline: "design" },
  { id: "exp-8", name: "SEO", discipline: "marketing" },
  { id: "exp-9", name: "Content Strategy", discipline: "marketing" },
  { id: "exp-10", name: "Project Management", discipline: "account" },
];

export const userExpertises: UserExpertise[] = [
  { id: "ue-1", user_id: "user-1", expertise_id: "exp-1", level: "beginner" },
  { id: "ue-2", user_id: "user-1", expertise_id: "exp-2", level: "beginner" },
  { id: "ue-3", user_id: "user-2", expertise_id: "exp-1", level: "expert" },
  { id: "ue-4", user_id: "user-2", expertise_id: "exp-2", level: "expert" },
  { id: "ue-5", user_id: "user-2", expertise_id: "exp-3", level: "werkkennis" },
  { id: "ue-6", user_id: "user-4", expertise_id: "exp-1", level: "werkkennis" },
  { id: "ue-7", user_id: "user-4", expertise_id: "exp-8", level: "expert" },
  { id: "ue-8", user_id: "user-7", expertise_id: "exp-5", level: "expert" },
  { id: "ue-9", user_id: "user-7", expertise_id: "exp-6", level: "expert" },
  { id: "ue-10", user_id: "user-3", expertise_id: "exp-10", level: "expert" },
];

export function getExpertisesForUser(userId: string) {
  return userExpertises
    .filter((ue) => ue.user_id === userId)
    .map((ue) => ({
      ...ue,
      expertise: expertises.find((e) => e.id === ue.expertise_id)!,
    }));
}

export function getUsersWithExpertise(expertiseId: string) {
  return userExpertises
    .filter((ue) => ue.expertise_id === expertiseId)
    .map((ue) => ({
      ...ue,
      user: users.find((u) => u.id === ue.user_id)!,
    }));
}

export function getTeamByDiscipline(discipline: string) {
  const relevantExpertiseIds = expertises
    .filter((e) => e.discipline === discipline)
    .map((e) => e.id);
  const userIds = new Set(
    userExpertises
      .filter((ue) => relevantExpertiseIds.includes(ue.expertise_id))
      .map((ue) => ue.user_id)
  );
  return users.filter((u) => userIds.has(u.id));
}
