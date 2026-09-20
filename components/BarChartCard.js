"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function BarChartCard({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <section className="rounded-xl border border-base-300 bg-base-100 p-3 md:rounded-2xl md:p-4">
      <div className="mb-2 text-sm font-semibold text-base-content">Period Trend</div>
      <div className="h-64 rounded-xl bg-base-100 p-2 md:h-72 md:border md:border-base-300">
        {!hasData ? (
          <div className="grid h-full place-items-center text-sm text-base-content/60">
            No trend data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
