"use client";

import Link from "next/link";

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function InsightsSection({ insights = {}, recentTransactions = [] }) {
  const items = [
    insights?.topExpenseCategory
      ? `${insights.topExpenseCategory.emoji || "📁"} Top expense category is ${insights.topExpenseCategory.name} (${formatINR(insights.topExpenseCategory.amount)}).`
      : "No expense category trend available for this period.",
    `Savings rate is ${formatPercent(insights?.savingsRate)} of income.`,
    `Expense changed ${formatPercent(insights?.expenseVsPreviousPct)} vs previous period.`,
    `Net flow for selected period is ${formatINR(insights?.netFlow)}.`,
  ];

  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
      <h2 className="text-base font-semibold text-base-content md:text-lg">Insights</h2>
      <div className="mt-3 grid gap-2">
        {items.map((item, index) => (
          <article
            key={`insight-${index}`}
            className="rounded-xl border border-base-300 bg-base-200/35 px-3 py-2 text-sm text-base-content/80"
          >
            {item}
          </article>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-base-content">Recent Transactions</h3>
        <div className="mt-2 grid gap-2">
          {recentTransactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-base-300 px-3 py-3 text-sm text-base-content/60">
              No recent transactions in this period.
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <article
                key={String(tx._id)}
                className="flex items-center justify-between rounded-xl border border-base-300 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-semibold text-base-content">{tx.name}</div>
                  <div className="text-xs text-base-content/60">
                    {tx.categoryEmoji ? `${tx.categoryEmoji} ` : ""}
                    {tx.categoryName} · {tx.type}
                  </div>
                </div>
                <div className="text-sm font-semibold text-base-content">
                  {formatINR(tx.amount)}
                </div>
              </article>
            ))
          )}
        </div>
        <div className="mt-3 flex justify-end">
          <Link
            href="/transactions"
            className="text-sm font-semibold text-primary transition hover:opacity-85"
          >
            Show all transactions →
          </Link>
        </div>
      </div>
    </section>
  );
}
