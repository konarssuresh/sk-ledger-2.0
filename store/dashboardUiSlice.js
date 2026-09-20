import { createSlice } from "@reduxjs/toolkit";

const PERIOD_TYPES = ["daily", "weekly", "monthly", "yearly"];

const toIsoDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const fromIsoDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const shiftDateByPeriod = (date, periodType, direction) => {
  const multiplier = direction === "previous" ? -1 : 1;
  const next = new Date(date);

  if (periodType === "daily") {
    next.setDate(next.getDate() + multiplier);
    return next;
  }
  if (periodType === "weekly") {
    next.setDate(next.getDate() + multiplier * 7);
    return next;
  }
  if (periodType === "monthly") {
    next.setMonth(next.getMonth() + multiplier);
    return next;
  }
  next.setFullYear(next.getFullYear() + multiplier);
  return next;
};

const initialState = {
  periodType: "monthly",
  currentDate: toIsoDate(new Date()),
};

export const dashboardUiSlice = createSlice({
  name: "dashboardUi",
  initialState,
  reducers: {
    setPeriodType(state, action) {
      const period = String(action.payload || "").toLowerCase();
      if (PERIOD_TYPES.includes(period)) {
        state.periodType = period;
      }
    },
    setCurrentDate(state, action) {
      const nextDate = action.payload;
      if (!nextDate) return;
      state.currentDate = toIsoDate(fromIsoDate(nextDate));
    },
    goToPreviousPeriod(state) {
      const date = fromIsoDate(state.currentDate);
      state.currentDate = toIsoDate(
        shiftDateByPeriod(date, state.periodType, "previous"),
      );
    },
    goToNextPeriod(state) {
      const date = fromIsoDate(state.currentDate);
      state.currentDate = toIsoDate(
        shiftDateByPeriod(date, state.periodType, "next"),
      );
    },
  },
});

export const {
  setPeriodType,
  setCurrentDate,
  goToPreviousPeriod,
  goToNextPeriod,
} = dashboardUiSlice.actions;

export const periodTypeSelector = (state) => state.dashboardUi.periodType;
export const currentDateSelector = (state) => state.dashboardUi.currentDate;

export default dashboardUiSlice.reducer;
