import { PageLoadingStatus } from "@/components/shared/page-loading-status";

export default function SettingsShimmer() {
  return (
    <PageLoadingStatus label="Loading settings">
      <main className="min-h-screen p-2 sm:p-3 md:p-10">
        <section className="mx-auto w-full max-w-5xl rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5 md:p-8">
          <div className="mb-5 space-y-2">
            <div className="skeleton h-8 w-32 rounded-lg" />
            <div className="skeleton h-4 w-64 rounded-lg" />
          </div>

          <section className="rounded-2xl border border-base-300 bg-base-100 p-4">
            <div className="skeleton h-3 w-16 rounded" />
            <div className="mt-3 grid gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`settings-account-row-${index}`}
                  className="skeleton h-[58px] rounded-xl"
                />
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-4">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="mt-3 skeleton h-[58px] rounded-xl" />
          </section>
        </section>
      </main>
    </PageLoadingStatus>
  );
}
