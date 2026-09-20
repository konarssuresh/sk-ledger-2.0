"use client";

import { StatCard } from "@/components";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function SummaryCards({ summary }) {
  const income = summary?.income || 0;
  const expense = summary?.expense || 0;
  const savings = summary?.savings || 0;
  const balance = summary?.balance || 0;

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
      <h2 className="text-base font-semibold text-base-content md:text-lg">Summary</h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
        <StatCard label="Income" value={formatINR(income)} tone="success" />
        <StatCard label="Expense" value={formatINR(expense)} tone="error" />
        <StatCard label="Savings" value={formatINR(savings)} tone="info" />
        <StatCard label="Balance" value={formatINR(balance)} tone="default" />
      </div>
    </section>
  );
}
