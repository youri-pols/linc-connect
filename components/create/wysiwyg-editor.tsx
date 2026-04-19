"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface WysiwygEditorProps {
  /**
   * Called whenever the visible text content changes. Parent uses
   * this to decide whether the "Inhoud aanwezig" checklist item
   * should be ticked.
   */
  onChange?: (plainText: string) => void;
}

/*
 * Compact WYSIWYG editor built on `contentEditable` and
 * `document.execCommand`. execCommand is technically deprecated but
 * still implemented everywhere and is plenty for fase 1 — we only
 * need bold/italic/underline/strikethrough and two heading levels.
 *
 * The toolbar stays in sync with the selection via
 * `document.queryCommandState`, so clicking inside an already-bold
 * word will light up the B button.
 *
 * When fase 2 wires this to real Supabase-backed articles the
 * engine can be swapped for Tiptap / ProseMirror without the parent
 * having to change — it only reads the plain-text `onChange`.
 */
type Format = "bold" | "italic" | "underline" | "strikethrough";

export function WysiwygEditor({ onChange }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Record<Format, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  const syncActive = useCallback(() => {
    if (typeof document === "undefined") return;
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikethrough: document.queryCommandState("strikethrough"),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", syncActive);
    return () => document.removeEventListener("selectionchange", syncActive);
  }, [syncActive]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    syncActive();
    emitChange();
  };

  const emitChange = () => {
    const text = editorRef.current?.innerText.trim() ?? "";
    onChange?.(text);
  };

  const heading = (level: 2 | 3) => exec("formatBlock", `h${level}`);
  const undo = () => exec("undo");
  const redo = () => exec("redo");
  const link = () => {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  };
  const image = () => {
    const url = window.prompt("Afbeelding URL");
    if (url) exec("insertImage", url);
  };
  const code = () => exec("formatBlock", "pre");

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="bg-white border border-black/15 rounded-lg flex items-center gap-1.5 pl-4 pr-6 py-2">
        <ToolbarGroup>
          <ToolbarTextButton label="H2" bold onClick={() => heading(2)} />
          <ToolbarTextButton label="H3" bold onClick={() => heading(3)} />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolbarTextButton label="B" bold active={active.bold} onClick={() => exec("bold")} />
          <ToolbarTextButton label="U" underline active={active.underline} onClick={() => exec("underline")} />
          <ToolbarTextButton label="I" italic active={active.italic} onClick={() => exec("italic")} />
          <ToolbarTextButton label="S" strike active={active.strikethrough} onClick={() => exec("strikethrough")} />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolbarIconButton icon="link" label="Link invoegen" onClick={link} />
          <ToolbarIconButton icon="image" label="Afbeelding invoegen" onClick={image} />
          <ToolbarTextButton label="</>" onClick={code} />
        </ToolbarGroup>
        <Divider />
        <ToolbarGroup>
          <ToolbarIconButton icon="undo" label="Ongedaan maken" onClick={undo} />
          <ToolbarIconButton icon="redo" label="Opnieuw uitvoeren" onClick={redo} />
        </ToolbarGroup>
      </div>

      {/* Editor surface */}
      <div ref={editorRef} contentEditable role="textbox" aria-multiline="true" aria-label="Artikelinhoud" onInput={emitChange} onBlur={emitChange} suppressContentEditableWarning data-placeholder="Typ hier de inhoud van je artikel..." className="wysiwyg-content bg-white border border-black/15 rounded-lg px-6 py-5 min-h-72 text-body text-sm text-black leading-relaxed outline-none focus:border-purple transition-colors" />
    </div>
  );
}

/* ── Toolbar bits ─────────────────────────────────────────── */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

function Divider() {
  return <div className="w-px h-4.5 bg-black/15 shrink-0" />;
}

function ToolbarTextButton({ label, active, bold, italic, underline, strike, onClick }: { label: string; active?: boolean; bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean; onClick: () => void }) {
  const decoration = [underline ? "underline" : "", strike ? "line-through" : ""].filter(Boolean).join(" ");

  return (
    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`flex items-center justify-center h-7 w-7.5 rounded-md text-xs transition-colors cursor-pointer ${active ? "bg-purple/10 text-purple" : "text-black hover:bg-black/5"}`}>
      <span className={`${bold || active ? "font-bold" : "font-normal"} ${italic ? "italic" : ""} ${decoration}`}>{label}</span>
    </button>
  );
}

function ToolbarIconButton({ icon, label, active, onClick }: { icon: string; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`flex items-center justify-center h-7 w-7.5 rounded-md transition-colors cursor-pointer ${active ? "bg-purple/10 text-purple" : "text-black hover:bg-black/5"}`}>
      <span aria-hidden className="icon">{icon}</span>
    </button>
  );
}
