"use client";

import { useMemo, useState } from "react";
import { Dropdown } from "@/components/create/dropdown";
import { WysiwygEditor } from "@/components/create/wysiwyg-editor";
import { ChecklistItem } from "@/components/create/checklist-item";
import {
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_DISCIPLINES,
} from "@/lib/types/knowledge";

const STATUS_OPTIONS = [
  { value: "up-to-date", label: "Up-to-date" },
  { value: "concept", label: "Concept" },
  { value: "verouderd", label: "Verouderd?" },
];

/*
 * Form state for creating a new kennisbank article. The right-side
 * checklist ("Klaar voor publicatie?") is derived from this state
 * — every time the title, discipline, category or editor content
 * changes, the checklist rerenders with the matching tick.
 *
 * Publishing is visual only for fase 1: the Publiceren button lives
 * in the TopBar and has hover feedback but no click handler.
 *
 * The meta sections (status, checklist, discipline, category) live
 * in a right aside on lg+ and inline below the editor on smaller
 * screens so mobile users can still fill them out. Both use the
 * same `metaSections` render to stay DRY.
 *
 * Section labels are rendered as <p> rather than <h3>: they're
 * field/section labels, not content headings, and shouldn't appear
 * in the document outline.
 */
export function CreateArticleView() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string | null>("up-to-date");
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [bodyText, setBodyText] = useState("");

  const disciplineOptions = useMemo(
    () => KNOWLEDGE_DISCIPLINES.map((d) => ({ value: d.id, label: d.label })),
    []
  );
  const categoryOptions = useMemo(
    () => KNOWLEDGE_CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
    []
  );

  const checklist = [
    { label: "Titel ingevuld", done: title.trim().length > 0 },
    { label: "Discipline gekozen", done: discipline !== null },
    { label: "Categorie gekozen", done: category !== null },
    { label: "Inhoud aanwezig", done: bodyText.length > 0 },
  ];

  const metaSections = (
    <>
      <section className="flex flex-col gap-3">
        <p className="text-nav leading-normal text-black/60">Status (Markering)</p>
        <Dropdown
          options={STATUS_OPTIONS}
          value={status}
          onChange={setStatus}
          placeholder="Kies status"
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-nav leading-normal text-black/60">Klaar voor publicatie?</p>
        <div className="flex flex-col gap-1">
          {checklist.map((item) => (
            <ChecklistItem key={item.label} label={item.label} done={item.done} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-nav leading-normal text-black/60">Discipline</p>
        <Dropdown
          options={disciplineOptions}
          value={discipline}
          onChange={setDiscipline}
          placeholder="Kies een discipline"
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-nav leading-normal text-black/60">Categorie</p>
        <Dropdown
          options={categoryOptions}
          value={category}
          onChange={setCategory}
          placeholder="Kies een categorie"
        />
      </section>
    </>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex h-full">
        <div className="flex-1 min-w-0 flex flex-col gap-8 p-4 lg:p-8">
          {/* Title input */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type hier de titel"
              className="font-display font-medium text-h2 text-black placeholder:text-black/60 outline-none bg-transparent"
            />
            <div className="h-px bg-black/15" />
          </div>

          {/* Editor */}
          <WysiwygEditor onChange={setBodyText} />

          {/* Mobile meta panel — below editor, hidden on lg+ */}
          <div className="lg:hidden flex flex-col gap-6 bg-white border border-black/15 rounded-lg p-5">
            {metaSections}
          </div>
        </div>

        {/* Desktop aside */}
        <aside className="hidden lg:flex w-71 shrink-0 bg-white border-l border-black/15 flex-col gap-6 p-6">
          {metaSections}
        </aside>
      </div>
    </div>
  );
}
