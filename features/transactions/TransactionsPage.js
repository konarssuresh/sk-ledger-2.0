"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { FormButton } from "@/components";
import { mountDialog } from "./dialog-utils";
import AddTransactionDialog from "./AddTransactionDialog";
import Calendar from "./Calendar";
import DayTransactions from "./DayTransactions";
import TransactionsShimmer from "./TransactionsShimmer";
import { calendarSelectors } from "@/store/calendarSlice";
import { useMonthlySummaryQuery } from "@/features/transactions/hooks";

const { activeMonthSelector } = calendarSelectors;

export default function TransactionsPage() {
  const activeMonth = useSelector(activeMonthSelector);

  const {
    data: monthlySummary = {},
    isLoading: isLoadingSummary,
    isFetching: isFetchingSummary,
  } = useMonthlySummaryQuery({
    year: activeMonth.getFullYear(),
    month: activeMonth.getMonth() + 1,
  });

  const isSummaryLoading =
    (isLoadingSummary || isFetchingSummary) &&
    Object.keys(monthlySummary || {}).length === 0;

  const handleOpenAddTransaction = () => {
    mountDialog((close) => <AddTransactionDialog onClose={close} />);
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const totals = useMemo(() => {
    return Object.values(monthlySummary).reduce(
      (acc, day) => ({
        income: acc.income + Number(day?.income || 0),
        expense: acc.expense + Number(day?.expense || 0),
        savings: acc.savings + Number(day?.savings || 0),
      }),
      { income: 0, expense: 0, savings: 0 },
    );
  }, [monthlySummary]);

  const actualBalance = totals.income - (totals.expense + totals.savings);

  const dayBalances = useMemo(() => {
    const map = {};
    Object.entries(monthlySummary).forEach(([dateKey, day]) => {
      const dayNum = Number(dateKey.split("-")[2]);
      if (!dayNum) return;
      map[dayNum] =
        Number(day?.income || 0) -
        (Number(day?.expense || 0) + Number(day?.savings || 0));
    });
    return map;
  }, [monthlySummary]);

  const daySummaryByDay = useMemo(() => {
    const map = {};
    Object.entries(monthlySummary).forEach(([dateKey, day]) => {
      const dayNum = Number(dateKey.split("-")[2]);
      if (!dayNum) return;
      map[dayNum] = {
        income: Number(day?.income || 0),
        expense: Number(day?.expense || 0),
        savings: Number(day?.savings || 0),
      };
    });
    return map;
  }, [monthlySummary]);

  if (isSummaryLoading) {
    return <TransactionsShimmer />;
  }

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-base-content">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-base-content/60">
              Track and manage income, expense, and savings entries.
            </p>
          </div>
          <FormButton
            type="button"
            fullWidth={false}
            className="min-w-44"
            onClick={handleOpenAddTransaction}
          >
            Add transaction
          </FormButton>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 md:mt-5 md:gap-3 md:grid-cols-4">
          <article className="rounded-2xl border border-base-300 bg-base-100 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
              Income
            </div>
            <div className="mt-1 text-lg font-bold text-success md:text-xl">
              {formatINR(totals.income)}
            </div>
          </article>
          <article className="rounded-2xl border border-base-300 bg-base-100 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
              Expense
            </div>
            <div className="mt-1 text-lg font-bold text-error md:text-xl">
              {formatINR(totals.expense)}
            </div>
          </article>
          <article className="rounded-2xl border border-base-300 bg-base-100 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
              Savings
            </div>
            <div className="mt-1 text-lg font-bold text-info md:text-xl">
              {formatINR(totals.savings)}
            </div>
          </article>
          <article className="rounded-2xl border border-base-300 bg-base-100 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-base-content/60">
              Balance
            </div>
            <div className="mt-1 text-lg font-bold text-base-content md:text-xl">
              {formatINR(actualBalance)}
            </div>
          </article>
        </div>

        <Calendar dayBalances={dayBalances} daySummaryByDay={daySummaryByDay} />
        <DayTransactions />
      </section>
    </main>
  );
}

