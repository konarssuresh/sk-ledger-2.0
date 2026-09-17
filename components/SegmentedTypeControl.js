"use client";

import clsx from "clsx";

export default function SegmentedTypeControl({
  value,
  onChange,
  options = [],
  className,
}) {
  return (
    <div
      className={clsx(
        "grid grid-cols-3 gap-2 rounded-xl border border-slate-200 p-1",
        className,
      )}
      role="tablist"
      aria-label="Type selector"
    >
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(option.id)}
            className={clsx(
              "btn btn-sm rounded-lg capitalize",
              isActive ? "btn-primary text-white" : "btn-ghost",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
