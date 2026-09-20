"use client";

import { FilterChips, PeriodCarousel } from "@/components";

const PERIOD_OPTIONS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const formatPeriodLabel = (periodType, currentDate) => {
  const date = new Date(currentDate);
  if (Number.isNaN(date.getTime())) return currentDate;

  if (periodType === "daily") {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  if (periodType === "weekly") {
    const day = date.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const start = new Date(date);
    start.setDate(date.getDate() + mondayOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    })} - ${end.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }
  if (periodType === "yearly") {
    return `${date.getFullYear()}`;
  }
  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

export default function DashboardHeader({
  periodType,
  currentDate,
  onPeriodChange,
  onPrevious,
  onNext,
}) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-3 md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterChips
          options={PERIOD_OPTIONS}
          value={periodType}
          onChange={onPeriodChange}
        />
        <PeriodCarousel
          label={formatPeriodLabel(periodType, currentDate)}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
    </section>
  );
}
