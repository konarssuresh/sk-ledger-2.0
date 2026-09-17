"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/features/auth/hooks";
import AppNavigation from "@/components/layout/AppNavigation";
import DialogContainer from "@/components/DialogContainer";

function ProtectedShellShimmer() {
  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="mt-4 skeleton h-4 w-72 rounded-lg" />
      </div>
    </main>
  );
}

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const [desktopNavCollapsed, setDesktopNavCollapsed] = useState(false);
  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return <ProtectedShellShimmer />;
  }

  if (isError || !data?.user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <DialogContainer />
      <AppNavigation
        desktopCollapsed={desktopNavCollapsed}
        onDesktopToggle={() => setDesktopNavCollapsed((prev) => !prev)}
      />
      <div
        className={`pb-20 transition-all duration-300 ease-out md:pb-0 ${
          desktopNavCollapsed ? "md:pl-0" : "md:pl-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
