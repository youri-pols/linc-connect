import Link from "next/link";
import { notFound } from "next/navigation";
import { BhvContactCard } from "@/components/practical/bhv-contact-card";
import { CategoryRow } from "@/components/practical/category-row";
import { DocumentRow } from "@/components/practical/document-row";
import { bhvContacts, bhvDocuments, getPracticalArticlesForCategory, getPracticalCategory } from "@/lib/mock-data/practical";

interface CategoriePageProps {
  params: Promise<{ categorie: string }>;
}

/*
 * Category detail page. Veiligheid & BHV renders a bespoke layout
 * (contacts grid + documents list); every other category renders
 * a grouped card with one row per article, deep-linking to
 * `/praktische-info/[categorie]/[slug]`.
 */
export default async function CategoriePage({ params }: CategoriePageProps) {
  const { categorie } = await params;
  const category = getPracticalCategory(categorie);
  if (!category) notFound();

  const isBhv = category.slug === "veiligheid-bhv";
  const articles = isBhv ? [] : getPracticalArticlesForCategory(category.slug);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <Link href="/praktische-info" className="w-fit flex items-center gap-1.5 border border-black/10 rounded-md px-3 py-1.5 text-body text-xs text-black hover:bg-black hover:text-white hover:border-black transition-colors">
          <span className="icon h-4">arrow_back</span>
          Terug naar Praktische info
        </Link>

        <div className="flex flex-col gap-6">
          {isBhv && <p className="text-body text-xs text-red leading-none">Noodsituatie · Direct bellen</p>}
          <h1 className="font-display font-medium text-h2">{category.title}</h1>
          {isBhv ? <p className="text-body text-sm text-black">Gebruik de belknop hieronder. Het nummer wordt automatisch ingevuld op je telefoon. Bel 112 bij levensgevaar.</p> : <p className="text-body text-sm text-black">Lorem ipsum dolor sit amet consectetur. Ornare aliquam tortor rhoncus volutpat duis ipsum nulla pulvinar. Et at lacinia quam odio sem tincidunt et suspendisse a. Tincidunt.</p>}
        </div>

        {!isBhv && <div className="h-px bg-black/15" />}

        {isBhv ? (
          <>
            {/* BHV contact grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {bhvContacts.map((contact) => (
                <BhvContactCard key={contact.id} contact={contact} />
              ))}
            </div>

            {/* Documents & procedures */}
            <div className="flex flex-col gap-4">
              <h2 className="font-display font-medium text-sm text-black px-5">Documenten & procedures</h2>
              <div className="flex flex-col bg-white border border-black/15 rounded-lg shadow-card overflow-hidden">
                {bhvDocuments.map((doc, i) => (
                  <DocumentRow key={doc.id} document={doc} isLast={i === bhvDocuments.length - 1} />
                ))}
              </div>
            </div>
          </>
        ) : articles.length > 0 ? (
          <div className="flex flex-col bg-white border border-black/15 rounded-lg shadow-card overflow-hidden">
            {articles.map((article, i) => (
              <CategoryRow key={article.slug} href={`/praktische-info/${category.slug}/${article.slug}`} icon={article.icon} title={article.title} description={article.description} isLast={i === articles.length - 1} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-black/15 rounded-lg shadow-card px-5 py-6 text-body text-sm text-black/60 text-center">Deze categorie is nog in ontwikkeling.</div>
        )}
      </div>
    </div>
  );
}
