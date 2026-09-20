"use client";

import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "./DashboardHeader";
import SummaryCards from "./SummaryCards";
import ChartsSection from "./ChartsSection";
import InsightsSection from "./InsightsSection";
import DashboardShimmer from "./DashboardShimmer";
import { useDashboardAnalyticsQuery } from "./hooks";
import {
  goToNextPeriod,
  goToPreviousPeriod,
  setPeriodType,
  periodTypeSelector,
  currentDateSelector,
} from "@/store/dashboardUiSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const periodType = useSelector(periodTypeSelector);
  const currentDate = useSelector(currentDateSelector);

  const { data, isLoading, isFetching, isError } = useDashboardAnalyticsQuery({
    periodType,
    date: currentDate,
  });

  const summary = data?.summary || {};
  const categorySummary = data?.categorySummary || [];
  const trendSummary = data?.trendSummary || [];
  const insights = data?.insights || {};
  const recentTransactions = data?.recentTransactions || [];

  if (isLoading) {
    return <DashboardShimmer />;
  }

  return (
    <main className="min-h-screen p-2 sm:p-3 md:p-10">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-base-300 bg-base-100 p-3 shadow-sm sm:p-4 md:p-6">
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-base-content">Dashboard</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Summary, charts and insights by selected period.
          </p>
        </div>

        <DashboardHeader
          periodType={periodType}
          currentDate={currentDate}
          onPeriodChange={(nextPeriod) => dispatch(setPeriodType(nextPeriod))}
          onPrevious={() => dispatch(goToPreviousPeriod())}
          onNext={() => dispatch(goToNextPeriod())}
        />

        {isError ? (
          <section className="mt-3 rounded-2xl border border-error/35 bg-error/10 p-3 text-sm text-error">
            Failed to load dashboard analytics.
          </section>
        ) : null}

        <div className="mt-3">
          <SummaryCards summary={summary} />
        </div>
        <div className="mt-3">
          <ChartsSection
            categorySummary={categorySummary}
            trendSummary={trendSummary}
          />
        </div>
        <div className="mt-3">
          <InsightsSection
            insights={insights}
            recentTransactions={recentTransactions}
          />
        </div>

        {isFetching && !isLoading ? (
          <div className="mt-2 text-xs text-base-content/55">Updating dashboard...</div>
        ) : null}
      </section>
    </main>
  );
}
