"use client";

const TransactionsShimmer = () => {
  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-44 rounded-lg" />
            <div className="skeleton h-4 w-72 rounded-lg" />
          </div>
          <div className="skeleton h-11 w-full rounded-xl sm:w-44" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 md:mt-5 md:grid-cols-4 md:gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={`stat-shimmer-${index}`}
              className="rounded-2xl border border-base-300 bg-base-100 p-3"
            >
              <div className="skeleton h-3 w-16 rounded" />
              <div className="mt-2 skeleton h-7 w-24 rounded" />
            </article>
          ))}
        </div>

        <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-3 md:mt-5 md:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="skeleton h-10 w-24 rounded-xl" />
            <div className="skeleton h-8 w-28 rounded-lg" />
            <div className="skeleton h-10 w-24 rounded-xl" />
          </div>
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={`day-shimmer-${index}`}
                className="skeleton h-[72px] rounded-xl md:h-[98px]"
              />
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-3 md:mt-5 md:p-4">
          <div className="skeleton h-7 w-40 rounded-lg" />
          <div className="mt-3 space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`txn-shimmer-${index}`} className="rounded-xl border border-base-300 p-3">
                <div className="skeleton h-5 w-48 rounded" />
                <div className="mt-2 skeleton h-4 w-36 rounded" />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default TransactionsShimmer;
