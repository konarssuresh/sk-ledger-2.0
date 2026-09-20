"use client";

import clsx from "clsx";

export default function StatCard({ label, value, tone = "default" }) {
  return (
    <article className="rounded-2xl border border-base-300 bg-base-100 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
        {label}
      </div>
      <div
        className={clsx(
          "mt-1 text-lg font-bold md:text-2xl",
          tone === "success" && "text-success",
          tone === "error" && "text-error",
          tone === "info" && "text-info",
          tone === "default" && "text-base-content",
        )}
      >
        {value}
      </div>
    </article>
  );
}
