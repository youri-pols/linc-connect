interface ChecklistItemProps {
  label: string;
  done: boolean;
}

/*
 * Row in the "Klaar voor publicatie?" auto-checklist. Done state
 * is a solid green square with a white check glyph inside; pending
 * is an empty bordered square with a neutral label.
 */
export function ChecklistItem({ label, done }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <div className="size-4 rounded bg-green flex items-center justify-center shrink-0">
          <span className="icon text-white text-xs leading-none">check</span>
        </div>
      ) : (
        <div className="size-4 border border-black/10 rounded shrink-0" />
      )}
      <p
        className={`text-body text-13 leading-none ${
          done ? "text-black/20 line-through" : "text-black"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
