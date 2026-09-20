"use client";

import { useMeQuery } from "@/features/auth/hooks";
import AccountDetails from "./AccountDetails";
import SecurityInfo from "./SecurityInfo";
import ProfileActions from "./ProfileActions";
import ProfileShimmer from "./ProfileShimmer";

export default function ProfilePage() {
  const { data, isLoading, isError } = useMeQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const user = data?.user || {};

  if (isLoading) {
    return <ProfileShimmer />;
  }

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl font-semibold text-base-content md:text-3xl">Profile</h1>

        {isError ? (
          <div className="mt-4 rounded-2xl border border-error/30 bg-error/10 p-4 text-sm text-error">
            Failed to load profile.
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <div className="mt-4 grid gap-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <AccountDetails user={user} />
              <SecurityInfo user={user} />
            </div>
            <ProfileActions user={user} />
          </div>
        ) : null}
      </section>
    </main>
  );
}
