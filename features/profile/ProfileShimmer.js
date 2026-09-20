export default function ProfileShimmer() {
  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-6xl">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="mt-2 skeleton h-9 w-40 rounded-lg" />
        <div className="mt-2 skeleton h-4 w-80 rounded-lg" />

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="border-b border-base-300 px-4 py-3">
              <div className="skeleton h-6 w-36 rounded-lg" />
            </div>
            <div className="space-y-2 px-4 py-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`profile-account-row-${index}`} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="border-b border-base-300 px-4 py-3">
              <div className="skeleton h-6 w-36 rounded-lg" />
            </div>
            <div className="space-y-2 px-4 py-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`profile-security-row-${index}`} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          </section>
        </div>

        <section className="mt-3 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-300 px-4 py-3">
            <div className="skeleton h-6 w-24 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`profile-action-${index}`} className="skeleton h-10 w-36 rounded-xl" />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
