import Link from "next/link";
import type { PracticalDocument } from "@/lib/mock-data/practical";

interface DocumentRowProps {
  document: PracticalDocument;
  isLast: boolean;
}

/*
 * Single row inside the "Documenten & procedures" card. Title on
 * the left, meta ("Bijgewerkt …") on the right. The last row
 * skips its bottom border so the card's rounded corners stay
 * clean.
 */
export function DocumentRow({ document, isLast }: DocumentRowProps) {
  return (
    <Link
      href={document.href}
      className={`flex items-center justify-between gap-4 px-5 py-4 hover:bg-black/5 transition-colors ${
        isLast ? "" : "border-b border-black/15"
      }`}
    >
      <p className="text-body text-13 font-medium text-black leading-tight min-w-0 truncate">
        {document.title}
      </p>
      <p className="text-body text-xs text-black/60 leading-snug shrink-0">
        {document.meta}
      </p>
    </Link>
  );
}
