import { CategoryRow } from "@/components/practical/category-row";
import { UrgentCategoryCard } from "@/components/practical/urgent-category-card";
import { getPracticalCategories } from "@/lib/mock-data/practical";

/*
 * Praktische informatie overview. Veiligheid & BHV gets its own
 * red-tinted card above the divider so it's always one tap away;
 * the remaining categories live in a single grouped card.
 */
export default function PraktischPage() {
  const categories = getPracticalCategories();
  const urgent = categories.find((c) => c.urgent);
  const regular = categories.filter((c) => !c.urgent);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <h1 className="font-display font-medium text-h2">Praktische informatie</h1>
          <p className="text-body text-sm text-black">Alles wat je nodig hebt om je werk te doen. Bij een noodsituatie ga je direct naar Veiligheid & BHV.</p>
        </div>

        {urgent && <UrgentCategoryCard category={urgent} />}

        <div className="h-px bg-black/15" />

        <div className="flex flex-col bg-white border border-black/15 rounded-lg shadow-card overflow-hidden">
          {regular.map((category, i) => (
            <CategoryRow key={category.slug} href={`/praktisch/${category.slug}`} icon={category.icon} title={category.title} description={category.description} isLast={i === regular.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
