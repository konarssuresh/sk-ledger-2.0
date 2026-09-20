"use client";

import clsx from "clsx";

export default function FilterChips({ options = [], value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange?.(option.value)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition md:text-sm",
              isActive
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-base-300 bg-base-100 text-base-content/70 hover:border-primary/35 hover:text-base-content",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
