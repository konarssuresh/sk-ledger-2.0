export default function DashboardShimmer() {
  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-base-300 bg-base-100 p-3 shadow-sm sm:p-4 md:p-6">
        <div className="mb-3">
          <div className="skeleton h-8 w-44 rounded-lg" />
          <div className="mt-2 skeleton h-4 w-72 rounded-lg" />
        </div>

        <section className="rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`chip-${index}`} className="skeleton h-8 w-20 rounded-full" />
              ))}
            </div>
            <div className="skeleton h-10 w-44 rounded-full" />
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
          <div className="skeleton h-6 w-32 rounded-lg" />
          <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`stat-${index}`} className="rounded-2xl border border-base-300 p-3">
                <div className="skeleton h-3 w-16 rounded" />
                <div className="mt-2 skeleton h-8 w-24 rounded" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
          <div className="skeleton h-6 w-28 rounded-lg" />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-base-300 p-3 md:p-4">
              <div className="skeleton h-5 w-24 rounded" />
              <div className="mt-2 skeleton h-64 rounded-xl md:h-72" />
            </div>
            <div className="rounded-2xl border border-base-300 p-3 md:p-4">
              <div className="skeleton h-5 w-24 rounded" />
              <div className="mt-2 skeleton h-64 rounded-xl md:h-72" />
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
          <div className="skeleton h-6 w-28 rounded-lg" />
          <div className="mt-3 grid gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`insight-${index}`} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
          <div className="mt-4">
            <div className="skeleton h-5 w-36 rounded" />
            <div className="mt-2 grid gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`recent-${index}`} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
