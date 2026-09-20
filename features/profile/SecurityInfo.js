"use client";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SecurityInfo({ user }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <header className="border-b border-base-300 px-4 py-3">
        <h2 className="text-base font-semibold text-base-content">Meta & Security</h2>
      </header>
      <div className="px-4 py-3">
        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            User ID
          </div>
          <div className="mt-1 break-all text-xs font-semibold text-base-content md:mt-0">
            {user?.id ? String(user.id) : "-"}
          </div>
        </div>
        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Password
          </div>
          <div className="mt-1 md:mt-0">
            <span className="inline-flex rounded-full border border-warning/35 bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning">
              Managed securely (hidden)
            </span>
          </div>
        </div>
        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Created At
          </div>
          <div className="mt-1 text-sm font-semibold text-base-content md:mt-0">
            {formatDateTime(user?.createdAt)}
          </div>
        </div>
        <div className="py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Updated At
          </div>
          <div className="mt-1 text-sm font-semibold text-base-content md:mt-0">
            {formatDateTime(user?.updatedAt)}
          </div>
        </div>
      </div>
    </section>
  );
}
