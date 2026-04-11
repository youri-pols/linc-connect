import Link from "next/link";
import type { KnowledgePreview } from "@/lib/types/home";

interface KnowledgeItemProps {
  item: KnowledgePreview;
}

/*
 * Preview row shown under "Nieuw in kennisbank" in the right panel.
 * On hover only the title becomes purple — no background animation,
 * so the right panel stays visually calm.
 */
export function KnowledgeItem({ item }: KnowledgeItemProps) {
  const { discipline, title, author, timeAgo, href } = item;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 border-b border-black/15 py-3"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-body text-2xs font-bold uppercase text-purple">
          {discipline}
        </p>
        <p className="text-body text-sm font-semibold group-hover:text-purple transition-colors">
          {title}
        </p>
      </div>
      <p className="text-body text-xs text-black/60">
        {author} · {timeAgo}
      </p>
    </Link>
  );
}
