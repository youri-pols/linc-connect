import { articles } from "./articles";

/*
 * BHV contacts shown on the /praktisch/veiligheid-bhv page. Each
 * card surfaces an avatar, name, role label and a "Bel nu" button
 * that opens the user's dialer via a tel: link.
 */
export interface BhvContact {
  id: string;
  name: string;
  /** Short role/company line shown under the name, e.g. "LiNC · BHV". */
  roleLabel: string;
  /** Two-letter fallback initials shown when no `photoUrl` is set. */
  initials: string;
  /** Optional photo. Falls back to coloured initials when absent. */
  photoUrl?: string;
  /** Accent for the initials fallback. */
  avatarColor: "purple" | "orange" | "green" | "red";
  /** E.164-ish phone number for the tel: href. */
  phone: string;
}

export interface PracticalDocument {
  id: string;
  title: string;
  /** Text like "Bijgewerkt jan 2026 · Joost B.". */
  meta: string;
  href: string;
}

export const bhvContacts: BhvContact[] = [
  {
    id: "eline",
    name: "Eline van den Dool",
    roleLabel: "LiNC · BHV",
    initials: "EV",
    avatarColor: "purple",
    photoUrl: "/images/eline.webp",
    phone: "+31612345671",
  },
  {
    id: "noreen",
    name: "Noreen de Vaan",
    roleLabel: "Scheepens · BHV",
    initials: "NV",
    avatarColor: "orange",
    photoUrl: "/images/noreen.webp",
    phone: "+31612345672",
  },
  {
    id: "lotte",
    name: "Lotte Hagenstein",
    roleLabel: "Scheepens · BHV",
    initials: "LH",
    avatarColor: "green",
    photoUrl: "/images/lotte.webp",
    phone: "+31612345673",
  },
];

export const bhvDocuments: PracticalDocument[] = [
  {
    id: "evacuatieplan",
    title: "Evacuatieplan kantoor",
    meta: "Bijgewerkt jan 2026 · Joost B.",
    href: "#",
  },
  {
    id: "vertrouwenspersoon",
    title: "Vertrouwenspersoon contactgegevens",
    meta: "Bijgewerkt jan 2026 · Joost B.",
    href: "#",
  },
  {
    id: "ehbo-aed",
    title: "Locatie EHBO-doos & AED",
    meta: "Bijgewerkt jan 2026 · HR",
    href: "#",
  },
];

export interface PracticalCategory {
  slug: string;
  title: string;
  /** One-line subtitle shown under the category title. */
  description: string;
  /** Emoji shown to the left of the title. */
  icon: string;
  /**
   * When true the category is rendered as the "urgent" variant —
   * red-tinted background + red title. Used to give Veiligheid &
   * BHV its own card above the divider.
   */
  urgent?: boolean;
}

/*
 * The praktisch overview page treats Veiligheid & BHV as a
 * separate, always-prominent card so it's one tap away in an
 * emergency. Everything else lives in the regular list below.
 */
export const practicalCategories: PracticalCategory[] = [
  {
    slug: "veiligheid-bhv",
    title: "Veiligheid & BHV",
    description:
      "3 BHV-contacten direct bereikbaar, evacuatieplan, AED-locaties",
    icon: "🚨",
    urgent: true,
  },
  {
    slug: "kantoor-faciliteiten",
    title: "Kantoor & Faciliteiten",
    description: "Wifi, vergaderruimtes, parkeren, printer",
    icon: "🏢",
  },
  {
    slug: "verlof-afwezigheid",
    title: "Verlof & Afwezigheid",
    description: "Vakantiedagen aanvragen, ziekte doorgeven",
    icon: "📅",
  },
  {
    slug: "hr-contracten",
    title: "HR & Contracten",
    description: "Loonstrook, onkostendeclaratie",
    icon: "🧾",
  },
  {
    slug: "arbeidsvoorwaarden",
    title: "Arbeidsvoorwaarden",
    description: "Pensioen, vergoedingen",
    icon: "💰",
  },
  {
    slug: "tools-toegang",
    title: "Tools & Toegang",
    description: "Licenties, software aanvragen",
    icon: "🔧",
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    description: "Interne en externe regelingen, incidentplan",
    icon: "🔒",
  },
];

export function getPracticalCategories() {
  return practicalCategories;
}

export function getPracticalCategory(slug: string) {
  return practicalCategories.find((c) => c.slug === slug);
}

export function getPracticalArticles() {
  return articles.filter((a) => a.type === "praktisch");
}

export function getPracticalArticlesByCategory(category: string) {
  return articles.filter((a) => a.type === "praktisch" && a.category === category);
}

/*
 * Articles shown as rows on each category detail page. Keyed by
 * the parent category slug so the detail page can look them up
 * directly. BHV has no entry here — its layout is a bespoke
 * contacts-and-documents screen, not a generic article list.
 */
export interface PracticalArticleSection {
  heading?: string;
  body: string;
}

export interface PracticalArticle {
  slug: string;
  icon: string;
  title: string;
  description: string;
  /** Small label path shown above the H1, e.g. "HR · Zelf regelen". */
  labelPath?: string;
  authorName?: string;
  authorPhotoUrl?: string;
  /** Display string for the update date, e.g. "18 februari 2026". */
  updatedAt?: string;
  readingMinutes?: number;
  /** Article body rendered on the detail page. */
  sections?: PracticalArticleSection[];
}

const PRACTICAL_LOREM =
  "Lorem ipsum dolor sit amet consectetur. Non semper pellentesque.";

const PRACTICAL_LEAD =
  "Lorem ipsum dolor sit amet consectetur. Id malesuada faucibus in elit. Bibendum ullamcorper ut sed urna id magna scelerisque eros sed. Bibendum quisque tristique sed tortor ultrices fermentum volutpat amet. Lectus ultrices aliquet donec mattis. In cras sit sit pretium. Dictum sed et volutpat egestas mauris cursus ornare. Risus euismod malesuada.";

const PRACTICAL_SECTION_BODY =
  "Lorem ipsum dolor sit amet consectetur. Tincidunt tincidunt non ut ipsum malesuada sit leo. Nulla platea fermentum mi egestas. Eget massa neque interdum viverra ultricies nisi justo faucibus. Quam diam lectus rhoncus nec vel enim in. Amet proin metus ultrices vitae posuere in odio. Vulputate natoque enim morbi sit sagittis. Mus viverra placerat tellus sed.";

const DEFAULT_ARTICLE_SECTIONS: PracticalArticleSection[] = [
  { body: PRACTICAL_LEAD },
  { heading: "1. Titel", body: PRACTICAL_SECTION_BODY },
  { heading: "2. Titel", body: PRACTICAL_SECTION_BODY },
  { heading: "3. Titel", body: PRACTICAL_SECTION_BODY },
];

/*
 * Shared defaults applied on top of each article entry below, so
 * every article has something to render on its detail page
 * without needing to repeat the same body text.
 */
const DEFAULT_ARTICLE: Partial<PracticalArticle> = {
  authorName: "Youri Pols",
  updatedAt: "18 februari 2026",
  readingMinutes: 2,
  sections: DEFAULT_ARTICLE_SECTIONS,
};

export const practicalArticlesByCategory: Record<string, PracticalArticle[]> = {
  "verlof-afwezigheid": [
    {
      slug: "verlof-aanvragen",
      icon: "🏖️",
      title: "Verlof aanvragen",
      description:
        "Lorem ipsum dolor sit amet consectetur. Donec porttitor nulla.",
      labelPath: "HR · Zelf regelen",
    },
    {
      slug: "ziekmelden",
      icon: "📅",
      title: "Ziekmelden",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "lorem-1",
      icon: "📅",
      title: "Lorem",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "lorem-2",
      icon: "📅",
      title: "Lorem",
      description: PRACTICAL_LOREM,
    },
  ],
  "kantoor-faciliteiten": [
    {
      slug: "wifi",
      icon: "📶",
      title: "Wifi & netwerk",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "vergaderruimtes",
      icon: "🗓️",
      title: "Vergaderruimtes reserveren",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "parkeren",
      icon: "🅿️",
      title: "Parkeren",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "printer",
      icon: "🖨️",
      title: "Printer",
      description: PRACTICAL_LOREM,
    },
  ],
  "hr-contracten": [
    {
      slug: "loonstrook",
      icon: "🧾",
      title: "Loonstrook bekijken",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "onkostendeclaratie",
      icon: "💳",
      title: "Onkostendeclaratie indienen",
      description: PRACTICAL_LOREM,
    },
  ],
  arbeidsvoorwaarden: [
    {
      slug: "pensioen",
      icon: "🏦",
      title: "Pensioenregeling",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "vergoedingen",
      icon: "💰",
      title: "Vergoedingen",
      description: PRACTICAL_LOREM,
    },
  ],
  "tools-toegang": [
    {
      slug: "licenties",
      icon: "🔑",
      title: "Licenties aanvragen",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "software",
      icon: "🔧",
      title: "Software installeren",
      description: PRACTICAL_LOREM,
    },
  ],
  "cyber-security": [
    {
      slug: "wachtwoorden",
      icon: "🔐",
      title: "Wachtwoord- en MFA-beleid",
      description: PRACTICAL_LOREM,
    },
    {
      slug: "incident-melden",
      icon: "🚨",
      title: "Beveiligingsincident melden",
      description: PRACTICAL_LOREM,
    },
  ],
};

export function getPracticalArticlesForCategory(
  slug: string,
): PracticalArticle[] {
  return practicalArticlesByCategory[slug] ?? [];
}

/*
 * Resolve a single article by (category, slug) tuple. Merges in
 * `DEFAULT_ARTICLE` so the detail page always has author/meta/
 * sections to render even when the row only declares the summary
 * fields.
 */
export function getPracticalArticle(
  categorySlug: string,
  articleSlug: string,
): PracticalArticle | undefined {
  const match = practicalArticlesByCategory[categorySlug]?.find(
    (a) => a.slug === articleSlug,
  );
  if (!match) return undefined;
  return { ...DEFAULT_ARTICLE, ...match };
}
