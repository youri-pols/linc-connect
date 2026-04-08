import { articles } from "./articles";

export interface PracticalCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const practicalCategories: PracticalCategory[] = [
  {
    slug: "veiligheid-bhv",
    title: "Veiligheid & BHV",
    description: "BHV-procedures, vluchtwegen en noodcontacten",
    icon: "shield",
  },
  {
    slug: "hr",
    title: "HR & Verlof",
    description: "Verlof aanvragen, ziekmelden en arbeidsvoorwaarden",
    icon: "people",
  },
  {
    slug: "faciliteiten",
    title: "Faciliteiten",
    description: "Kantoor, vergaderruimtes en faciliteiten",
    icon: "business",
  },
  {
    slug: "it",
    title: "IT & Accounts",
    description: "Accounts, wachtwoorden en IT-support",
    icon: "computer",
  },
];

export function getPracticalArticles() {
  return articles.filter((a) => a.type === "praktisch");
}

export function getPracticalArticlesByCategory(category: string) {
  return articles.filter((a) => a.type === "praktisch" && a.category === category);
}
