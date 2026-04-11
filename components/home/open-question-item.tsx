import Link from "next/link";
import type { OpenQuestion } from "@/lib/types/home";

interface OpenQuestionItemProps {
  question: OpenQuestion;
}

/*
 * Row in the "Open vragen" list on the experienced-employee home.
 * Same visual rhythm as TaskItem but without the checkbox — a
 * question emoji next to the title, and a discipline pill on the
 * right (vertically centered against the row).
 */
export function OpenQuestionItem({ question }: OpenQuestionItemProps) {
  const { title, discipline, href } = question;

  return (
    <Link
      href={href}
      className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 px-5 py-3 hover:bg-black/5 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 text-sm">❓</span>
        <p className="text-body text-13 truncate">{title}</p>
      </div>
      <div className="shrink-0 self-start md:self-center bg-purple/10 rounded px-2 py-1.5">
        <p className="text-body text-xs leading-none text-purple">{discipline}</p>
      </div>
    </Link>
  );
}
