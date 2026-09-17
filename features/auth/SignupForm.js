"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import clsx from "clsx";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  FormButton,
  FormInput,
  FormSelect,
  LogoWordmark,
} from "@/components";
import { useMeQuery, useSignupMutation } from "@/features/auth/hooks";
import { themeSelector, setTheme } from "@/store/userPreferenceSlice";

export default function SignupForm() {
  const router = useRouter();
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const { mutateAsync: signup, isPending: isLoading } = useSignupMutation();
  const { data: meData } = useMeQuery();

  useEffect(() => {
    if (meData?.user?.id) {
      router.replace("/transactions");
    }
  }, [meData?.user?.id, router]);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
  }, [theme]);

  const { control, getValues, formState } = useForm({
    mode: "all",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      baseCurrency: "INR",
      monthlyBudget: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = getValues();

    try {
      await signup({
        fullName,
        email,
        password,
      });
      router.replace("/login");
    } catch (error) {
      console.error("Signup failed:", error);
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
              Create your account
            </h1>
            <p className="text-slate-600">
              Set your base currency and start tracking your monthly cash flow.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-xs text-slate-700">
              Income
            </span>
            <span className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-xs text-slate-700">
              Expense
            </span>
            <span className="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-xs text-slate-700">
              Savings
            </span>
          </div>
        </aside>

        <section className="card mx-auto w-full max-w-md border border-slate-200/70 bg-base-100 shadow-sm md:max-w-none">
          <div className="card-body p-6 md:p-8">
            <div className="mb-6 md:hidden">
              <LogoWordmark className="h-9 w-auto text-slate-900" />
              <p className="mt-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                Start in minutes
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">Sign Up</h2>
            <p className="mt-1 text-sm text-slate-500">
              Create your SKLedger account in minutes.
            </p>

            <form
              className="mt-6 space-y-4 flex flex-col gap-1 md:gap-2"
              onSubmit={handleSignup}
            >
              <Controller
                control={control}
                name="fullName"
                rules={{ required: "Full name is required" }}
                render={({ field, fieldState }) => (
                  <FormInput
                    {...field}
                    type="text"
                    label="Full name"
                    placeholder="Suresh Konar"
                    error={fieldState.invalid && fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field, fieldState }) => (
                  <FormInput
                    {...field}
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    error={fieldState.invalid && fieldState.error?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field, fieldState }) => (
                  <FormInput
                    {...field}
                    type="password"
                    label="Password"
                    placeholder="Create a password"
                    error={fieldState.invalid && fieldState.error?.message}
                  />
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={control}
                  name="baseCurrency"
                  render={({ field }) => (
                    <FormSelect
                      {...field}
                      label="Base currency"
                      options={[
                        { label: "INR", value: "INR" },
                        { label: "USD", value: "USD" },
                        { label: "EUR", value: "EUR" },
                      ]}
                      helperText="Can be changed later from settings."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="monthlyBudget"
                  render={({ field }) => (
                    <FormInput
                      {...field}
                      type="text"
                      label="Monthly budget (optional)"
                      placeholder="25000"
                      helperText="Optional goal for spending alerts."
                    />
                  )}
                />
              </div>

              <FormButton
                disabled={isLoading || !formState?.isValid}
                type="submit"
                loading={isLoading}
              >
                Create account
              </FormButton>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
