"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#14b8a6", "#0ea5e9", "#f97316", "#ef4444", "#6366f1", "#22c55e"];

export default function PieChartCard({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <section className="overflow-hidden rounded-xl border border-base-300 bg-base-100 p-3 md:rounded-2xl md:p-4">
      <div className="mb-2 text-sm font-semibold text-base-content">Category Split</div>
      <div className="h-52 rounded-xl bg-base-100 p-1 md:h-64 md:border md:border-base-300">
        {!hasData ? (
          <div className="grid h-full place-items-center text-sm text-base-content/60">
            No category data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="categoryName"
                cx="50%"
                cy="46%"
                outerRadius={78}
                innerRadius={42}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry.categoryId}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {hasData ? (
        <div className="mt-2 flex max-h-20 flex-wrap gap-x-3 gap-y-1 overflow-y-auto pr-1 text-xs text-base-content/85 md:text-sm">
          {data.map((entry, index) => (
            <div
              key={`${entry.categoryId}-legend`}
              className="inline-flex max-w-full items-center gap-1.5"
              title={entry.categoryName}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">{entry.categoryName}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
