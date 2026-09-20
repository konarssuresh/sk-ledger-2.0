"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FormButton } from "@/components";
import { showDialog } from "@/components/DialogContainer";
import ChangePasswordDialog from "@/features/profile/ChangePasswordDialog";
import {
  useChangePreferencesMutation,
  useMeQuery,
  useSignoutMutation,
} from "@/features/auth/hooks";
import { setTheme, themeSelector } from "@/store/userPreferenceSlice";
import SettingsShimmer from "./SettingsShimmer";

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector(themeSelector);

  const { data, isLoading } = useMeQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const { mutateAsync: changePreferences, isPending: isSavingPref } =
    useChangePreferencesMutation();
  const { mutateAsync: signout, isPending: isSigningOut } = useSignoutMutation();

  const user = data?.user || {};
  const activeTheme = theme || user?.theme || "light";

  const handleToggleTheme = async () => {
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    dispatch(setTheme(nextTheme));
    try {
      await changePreferences({ theme: nextTheme });
    } catch (error) {
      dispatch(setTheme(activeTheme));
      console.error("Failed to update theme preference", error);
    }
  };

  const handleSignout = async () => {
    try {
      await signout();
      router.replace("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const handleOpenChangePassword = () => {
    let closeDialog = () => {};
    closeDialog = showDialog(
      <ChangePasswordDialog
        onClose={() => {
          closeDialog();
        }}
      />,
    );
  };

  if (isLoading && !data?.user) {
    return <SettingsShimmer />;
  }

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-5xl rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5 md:p-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-base-content">Settings</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Manage account and app preferences.
          </p>
        </div>

        <section className="rounded-2xl border border-base-300 bg-base-100 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Account
          </h2>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex items-center justify-between rounded-xl border border-base-300 px-3 py-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-base-content">Profile</div>
                <div className="text-xs text-base-content/60">
                  View and edit account details
                </div>
              </div>
              <span className="text-base-content/50">›</span>
            </button>

            <button
              type="button"
              onClick={handleOpenChangePassword}
              className="flex items-center justify-between rounded-xl border border-base-300 px-3 py-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-base-content">
                  Change Password
                </div>
                <div className="text-xs text-base-content/60">
                  Update your login password
                </div>
              </div>
              <span className="text-base-content/50">›</span>
            </button>

            <div className="flex items-center justify-between rounded-xl border border-error/30 bg-error/10 px-3 py-3">
              <div>
                <div className="text-sm font-semibold text-error">Logout</div>
                <div className="text-xs text-error/80">Sign out from this device</div>
              </div>
              <FormButton
                fullWidth={false}
                type="button"
                loading={isSigningOut}
                className="border-error/40 bg-error text-error-content hover:bg-error/90"
                onClick={handleSignout}
              >
                Logout
              </FormButton>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Appearance
          </h2>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-base-300 px-3 py-3">
            <div>
              <div className="text-sm font-semibold text-base-content">Theme</div>
              <div className="text-xs text-base-content/60">
                Current: {activeTheme}
              </div>
            </div>
            <label className="swap rounded-full border border-base-300 px-3 py-2">
              <input
                type="checkbox"
                checked={activeTheme === "dark"}
                disabled={isSavingPref}
                onChange={handleToggleTheme}
              />
              <span className="swap-off text-xs font-medium text-base-content/70">
                Dark mode
              </span>
              <span className="swap-on text-xs font-medium text-base-content/70">
                Light mode
              </span>
            </label>
          </div>
        </section>
      </section>
    </main>
  );
}
