"use client";

import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  calendarSelectors,
  setActiveMonth,
  setSelectedDay,
} from "@/store/calendarSlice";

const { selectedDaySelector, activeMonthSelector } = calendarSelectors;

const formatMonthKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

const formatDateKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const Calendar = ({ dayBalances = {}, daySummaryByDay = {} }) => {
  const dispatch = useDispatch();
  const activeMonth = useSelector(activeMonthSelector);
  const selectedDay = useSelector(selectedDaySelector);

  const monthLabel = activeMonth.toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });

  const daysInMonth = new Date(
    activeMonth.getFullYear(),
    activeMonth.getMonth() + 1,
    0,
  ).getDate();

  const firstDay = new Date(
    activeMonth.getFullYear(),
    activeMonth.getMonth(),
    1,
  ).getDay();

  const leading = (firstDay + 6) % 7;

  const formatCompactBalance = (value) => {
    if (value === undefined) {
      return "";
    }
    const sign = value < 0 ? "-" : "+";
    const abs = Math.abs(value);
    if (abs >= 1000) {
      const compact =
        abs % 1000 === 0
          ? String(abs / 1000)
          : (abs / 1000).toFixed(1).replace(/\.0$/, "");
      return `${sign}${compact}k`;
    }
    return `${sign}${Math.round(abs)}`;
  };

  const handleChangeMonth = useCallback(
    (offset) => {
      const newMonth = new Date(
        activeMonth.getFullYear(),
        activeMonth.getMonth() + offset,
        1,
      );
      dispatch(setActiveMonth(formatMonthKey(newMonth)));
      dispatch(setSelectedDay(formatDateKey(newMonth)));
    },
    [activeMonth, dispatch],
  );

  const handleDayChange = useCallback(
    (day) => {
      const newDay = new Date(
        activeMonth.getFullYear(),
        activeMonth.getMonth(),
        day,
      );

      dispatch(setSelectedDay(formatDateKey(newDay)));
    },
    [activeMonth, dispatch],
  );

  const calendarCells = [];
  for (let i = 0; i < leading; i += 1) {
    calendarCells.push(
      <div
        key={`empty-${i}`}
        className="h-12 rounded-2xl border border-base-300 bg-base-200/40 md:h-28"
      />,
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDay === day;
    const dayValue = dayBalances[day];
    const daySummary = daySummaryByDay[day];
    const hasEntries = Boolean(daySummary);
    const markerClass = !hasEntries
      ? "bg-base-content/30"
      : daySummary.income > Math.max(daySummary.expense, daySummary.savings)
        ? "bg-success"
        : daySummary.savings > daySummary.expense
          ? "bg-info"
          : "bg-error";
    const desktopAmount = hasEntries
      ? `${dayValue < 0 ? "-" : "+"}INR ${Math.round(Math.abs(dayValue)).toLocaleString("en-IN")}`
      : "No entries";

    calendarCells.push(
      <button
        type="button"
        key={day}
        onClick={() => handleDayChange(day)}
        className={`h-12 rounded-2xl border px-1.5 py-1 text-left transition md:h-28 md:px-3 md:py-2 ${
          isSelected
            ? "border-primary/70 bg-primary/10"
            : "border-base-300 bg-base-100 hover:border-primary/40"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="text-xs font-semibold text-base-content md:text-2xl md:leading-none">
            {day}
          </div>
          <span className={`h-1.5 w-1.5 rounded-full md:h-2.5 md:w-2.5 ${markerClass}`} />
        </div>
        <div className="mt-0.5 text-[9px] font-semibold leading-none text-base-content/60 md:hidden">
          {formatCompactBalance(dayValue)}
        </div>
        <div className="hidden md:mt-8 md:block md:text-base md:font-semibold md:text-base-content/65">
          {desktopAmount}
        </div>
      </button>,
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-2.5 md:mt-5 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="btn btn-sm btn-outline rounded-xl"
          onClick={() => handleChangeMonth(-1)}
        >
          ←
        </button>
        <div className="text-base font-semibold text-base-content md:text-lg">
          {monthLabel}
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline rounded-xl"
          onClick={() => handleChangeMonth(1)}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-base-content/60 md:gap-3 md:text-xs">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5 md:gap-3">
        {calendarCells}
      </div>
    </div>
  );
};

export default Calendar;
