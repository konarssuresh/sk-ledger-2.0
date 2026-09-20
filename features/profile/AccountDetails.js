"use client";

export default function AccountDetails({ user }) {
  const verified = Boolean(user?.verified);

  return (
    <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <header className="border-b border-base-300 px-4 py-3">
        <h2 className="text-base font-semibold text-base-content">Account Details</h2>
      </header>
      <div className="px-4 py-3">
        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Full Name
          </div>
          <div className="mt-1 text-sm font-semibold text-base-content md:mt-0">
            {user?.fullName || "-"}
          </div>
        </div>

        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Email
          </div>
          <div className="mt-1 break-all text-sm font-semibold text-base-content md:mt-0">
            {user?.email || "-"}
          </div>
        </div>

        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Verified
          </div>
          <div
            className={`mt-1 inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold md:mt-0 ${
              verified
                ? "border-success/30 bg-success/15 text-success"
                : "border-warning/30 bg-warning/15 text-warning"
            }`}
          >
            {verified ? "● Verified" : "● Not verified"}
          </div>
        </div>

        <div className="border-b border-dashed border-base-300 py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Base Currency
          </div>
          <div className="mt-1 md:mt-0">
            <span className="inline-flex rounded-full border border-base-300 bg-base-200/45 px-2.5 py-1 text-xs font-semibold text-base-content/90">
              {user?.baseCurrency || "INR"}
            </span>
          </div>
        </div>

        <div className="py-2 md:grid md:grid-cols-[160px_1fr] md:items-center md:gap-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Theme
          </div>
          <div className="mt-1 md:mt-0">
            <span className="inline-flex rounded-full border border-base-300 bg-base-200/45 px-2.5 py-1 text-xs font-semibold text-base-content/90">
              {user?.theme || "light"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
