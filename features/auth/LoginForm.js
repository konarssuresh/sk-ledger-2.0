"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { FormButton, FormInput, LogoWordmark } from "@/components";
import {
  useGoogleLoginMutation,
  useLoginMutation,
  useMeQuery,
} from "@/features/auth/hooks";
import { themeSelector, setTheme } from "@/store/userPreferenceSlice";

export default function LoginForm() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const router = useRouter();
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const { mutateAsync: login, isPending: isLoading } = useLoginMutation();
  const { mutateAsync: loginWithGoogle, isPending: isGoogleLoading } =
    useGoogleLoginMutation();
  const { data: meData } = useMeQuery();

  useEffect(() => {
    if (meData?.user?.id) {
      router.replace("/transactions");
    }
  }, [meData?.user?.id, router]);

  const { control, getValues, formState } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const authHeroClass = clsx(
    "auth-hero",
    "rounded-3xl",
    "border",
    "border-teal-300/30",
    "p-6",
    "text-slate-900",
    "md:p-8",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = getValues();
    try {
      await login({ email, password });
      router.replace("/transactions");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    try {
      await loginWithGoogle({
        credential: credentialResponse.credential,
      });
      router.replace("/transactions");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <main className="auth-page auth-bg grid min-h-screen place-items-center p-6 md:p-10">
      <label className="theme-switch swap fixed right-5 top-5 z-50 rounded-full border border-slate-300/70 bg-base-100 px-3 py-2 shadow-sm">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => {
            dispatch(setTheme(theme === "dark" ? "light" : "dark"));
          }}
        />
        <span className="swap-off text-xs font-medium text-slate-700">
          Dark mode
        </span>
        <span className="swap-on text-xs font-medium text-slate-200">
          Light mode
        </span>
      </label>
      <section className="auth-shell mx-auto grid w-full max-w-6xl items-center gap-6 md:items-stretch md:grid-cols-[1.1fr_1fr] md:rounded-3xl md:border md:border-slate-200/60 md:bg-base-100 md:p-8 md:shadow-xl">
        <aside className={clsx(authHeroClass, "hidden h-full md:block")}>
          <LogoWordmark />
          <div className="mt-6 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Welcome back
            </h1>
            <p className="text-slate-600">
              Track expenses, income, and savings in one clean ledger.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-xs text-slate-700">
              Base currency: INR
            </span>
            <span className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-xs text-slate-700">
              Secure sync
            </span>
          </div>
        </aside>

        <section className="card mx-auto w-full max-w-md border border-slate-200/70 bg-base-100 shadow-sm md:max-w-none">
          <div className="card-body p-6 md:p-8">
            <div className="mb-6 md:hidden">
              <LogoWordmark className="h-9 w-auto text-slate-900" />
              <p className="mt-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Secure Finance
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
            <p className="mt-1 text-sm text-slate-500">
              Use your SKLedger account to continue.
            </p>

            <form
              className="mt-6 space-y-4 flex flex-col gap-1 md:gap-2"
              onSubmit={handleSubmit}
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
                render={({ field, fieldState }) => (
                  <FormInput
                    {...field}
                    error={fieldState.invalid && fieldState.error?.message}
                    type="email"
                    label="Email"
                    placeholder=""
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field, fieldState }) => (
                  <FormInput
                    {...field}
                    type="password"
                    label="Password"
                    placeholder="********"
                    error={fieldState.invalid && fieldState.error?.message}
                  />
                )}
              />

              {googleClientId ? (
                <div className="google-login-shell mt-1">
                  <div className="google-login-visual" aria-hidden>
                    Continue with Google
                  </div>
                  <div className="google-login-hitbox">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        console.error("Google sign in popup failed");
                      }}
                      useOneTap={false}
                      text="continue_with"
                      shape="pill"
                      size="large"
                      width={360}
                    />
                  </div>
                </div>
              ) : null}

              <FormButton
                disabled={
                  !formState?.isValid || isLoading || isGoogleLoading
                }
                type="submit"
                loading={isLoading}
              >
                Login
              </FormButton>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              New here?{" "}
              <Link
                href="/signup"
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
