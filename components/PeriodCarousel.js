"use client";

export default function PeriodCarousel({ label, onPrevious, onNext }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-2 py-1">
      <button
        type="button"
        className="btn btn-xs btn-ghost rounded-full border border-base-300 md:btn-sm"
        onClick={onPrevious}
        aria-label="Previous period"
      >
        ←
      </button>
      <span className="min-w-24 text-center text-xs font-semibold text-base-content md:min-w-28 md:text-sm">
        {label}
      </span>
      <button
        type="button"
        className="btn btn-xs btn-ghost rounded-full border border-base-300 md:btn-sm"
        onClick={onNext}
        aria-label="Next period"
      >
        →
      </button>
    </div>
  );
}
