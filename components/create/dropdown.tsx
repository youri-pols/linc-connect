"use client";

import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
}

/*
 * Custom dropdown, shadcn-styled but built from scratch. Handles
 * outside click + Escape to close, rotates the chevron when open,
 * and highlights the active item in the menu.
 */
export function Dropdown({ options, value, onChange, placeholder }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 border border-black/10 rounded-md px-3 py-3.5 cursor-pointer hover:bg-black/5 transition-colors"
      >
        <span
          className={`font-display text-13 leading-none ${
            selected ? "text-black" : "text-black/60"
          }`}
        >
          {selected?.label ?? placeholder}
        </span>
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3.83833 4.32833C3.75171 4.32833 3.67108 4.31449 3.59644 4.28681C3.5218 4.25914 3.45081 4.21169 3.38348 4.14448L0.152827 0.913828C0.0533872 0.814269 0.0024692 0.68913 7.3058e-05 0.538413C-0.00220327 0.387816 0.0487147 0.260401 0.152827 0.156168C0.257059 0.0520562 0.383335 0 0.531656 0C0.679977 0 0.806254 0.0520562 0.910486 0.156168L3.83833 3.08419L6.76617 0.156168C6.86573 0.0567286 6.99087 0.00581068 7.14159 0.00341454C7.29218 0.00113821 7.4196 0.0520562 7.52383 0.156168C7.62794 0.260401 7.68 0.386677 7.68 0.534998C7.68 0.683319 7.62794 0.809596 7.52383 0.913828L4.29318 4.14448C4.22584 4.21169 4.15486 4.25914 4.08022 4.28681C4.00558 4.31449 3.92495 4.32833 3.83833 4.32833Z"
            fill="currentColor"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/15 rounded-lg shadow-lg p-1 z-50 max-h-64 overflow-y-auto">
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded text-body text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-purple/10 text-purple font-medium"
                    : "text-black hover:bg-black/5"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
